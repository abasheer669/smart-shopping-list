FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
# SQLite database lives in a volume-mounted directory
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/shopping.db"
EXPOSE 5000
ENTRYPOINT ["dotnet", "backend.dll"]
