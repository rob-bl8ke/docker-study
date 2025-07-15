# Explaining the Docker File

1. ASP.Net Coe used as base image to expose ports.
2. Core SDK used to restore and then build the project.
3. Binaries are published to the publish layer.
4. Published assets are copied to the final layer and the command to run the application is invoked when the container is up and running.
## ASP.Net Core base

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
```

Sets the base image for the subsequent build stages. Here, it uses the `aspnet` image from the official Microsoft .NET Core repository, version 3.1, as the base image. The `AS base` part assigns the name "base" to this stage, allowing it to be referenced later.

Sets the working directory inside the container to `/app`. Any subsequent commands will be executed in this directory.

These lines expose ports 80 and 443 on the container. It indicates that the web application running inside the container will listen on these ports for incoming HTTP and HTTPS requests.

## Use Core SDK to restore packages
```Dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"
```

Sets the base image for the build stage. The `sdk` image is used here, which includes the .NET Core SDK required for building the application.

Sets the working directory to `/src` within the container, and then copies the `WebApplication1.csproj` file from the local machine to the `/src/WebApplication1/` directory in the container.

Restores the NuGet packages specified in the `WebApplication1.csproj` file. It ensures that the required dependencies are downloaded and available for the build process.

## Build the web app and publish it
```Dockerfile
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build
```

Copies the rest of the application source code from the local machine to the current working directory in the container (`/src/`).

Changes the working directory to `/src/WebApplication1` within the container.


```Dockerfile
FROM build AS publish
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish
```

Builds the application inside the container using the `dotnet build` command. It specifies the `WebApplication1.csproj` file, sets the build configuration to `Release`, and specifies the output directory as `/app/build`.

## Copy binaries and set entry point
```Dockerfile
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
```

Creates a new stage named "final" based on the "base" stage. changes the working directory to `/app` within the container.

Copies the published output from the "publish" stage (the compiled and published application) to the current working directory (`/app`) in the "final" stage.

Sets the entry point command for the container. It specifies that when the container starts, it should execute the `dotnet WebApplication1.dll` command, which launches the .NET Core web application.

### Summary

In summary, this Dockerfile sets up a multi-stage build process. It starts from a base image, builds the application, publishes it, and finally creates a smaller final image that contains the published application. This approach helps to keep the final Docker image size smaller and separates the build and runtime environments.

# References

- [Official Microsoft Documentation](https://learn.microsoft.com/en-us/visualstudio/containers/container-tools?view=vs-2019)
- [Docker Reference](https://docs.docker.com/engine/reference/builder/)