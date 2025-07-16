
# `Dockerfile`

## Dockerfile to build and publish a ASP.NET Core Web Application


```dockerfile
FROM mcr.microsoft.com/dotnet/core/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:5.0 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
```
### Example from an real-life project
```dockerfile
# 
# Build command, from solution root
# docker build -t xchangedocs.server:tag --build-arg config=tag .
#
# Note that args are case sensitive
# 

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

#
# copy csproj and restore as distinct layers
#
ENV API=SuperBetting
ENV APISERVER=$API.ApiServer \
  COMMON=$API.Common \
  DATA=$API.Data \
  DOMAIN=$API.Domain \
  MODEL=$API.Model \
  STORAGE=$API.Storage

COPY $APISERVER/*.csproj ./$APISERVER/
COPY $COMMON/*.csproj ./$COMMON/
COPY $DATA/*.csproj ./$DATA/
COPY $DOMAIN/*.csproj ./$DOMAIN/
COPY $MODEL/*.csproj ./$MODEL/
COPY $STORAGE/*.csproj ./$STORAGE/
RUN dotnet restore $APISERVER/

#
# Get which config to build from config param in
# docker build command, default to Release
#
ARG config=Release

#
# copy everything else and build app
#
COPY ./. ./
RUN python $APISERVER/git-hooks/commit-info-json.py
RUN dotnet publish -c $config -o /app/out $APISERVER/$APISERVER.csproj
COPY $APISERVER/test-container/* /app/out/

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "SuperBetting.ApiServer.dll"]

```


# `docker-compose.yml`

```yaml
version: "3.7"
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server
    ports:
      - "2434:1433"
    environment:
      - "ACCEPT_EULA=Y"
      - "SA_PASSWORD=xyzzy_42"
    mem_limit: "3GB"
```

### Example MS SQL Server and Azurite

```yaml
version: "3.7"
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2017-latest
    ports:
      - "2433:1433"
    environment:
      - "ACCEPT_EULA=Y"
      - "SA_PASSWORD=xyzzy_42"
    mem_limit: "3GB"

  azureite:
    image: mcr.microsoft.com/azure-storage/azurite
    ports:
      - 10000:10000
      - 10001:10001
      - 10002:10002
    volumes: 
      - ./.local/azurite:/data:z
    restart: "on-failure"
```