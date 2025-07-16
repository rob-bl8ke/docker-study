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