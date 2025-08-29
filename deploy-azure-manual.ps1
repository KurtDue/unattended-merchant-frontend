# Azure Deployment Script - Run this manually
# Make sure you've run 'az login' first and selected your subscription

Write-Host "Starting Azure deployment..." -ForegroundColor Cyan

# Variables
$resourceGroupName = "rg-unattended-merchant"
$location = "East US"
$webAppName = "unattended-merchant-$(Get-Random -Minimum 1000 -Maximum 9999)"
$appServicePlan = "asp-unattended-merchant"

Write-Host "Using Web App Name: $webAppName" -ForegroundColor Yellow

# Create resource group
Write-Host "Creating resource group..." -ForegroundColor Green
az group create --name $resourceGroupName --location $location

# Create App Service Plan
Write-Host "Creating App Service Plan..." -ForegroundColor Green
az appservice plan create --name $appServicePlan --resource-group $resourceGroupName --sku B1 --is-linux

# Create Web App
Write-Host "Creating Web App..." -ForegroundColor Green
az webapp create --resource-group $resourceGroupName --plan $appServicePlan --name $webAppName --runtime "NODE|18-lts"

# Configure Web App settings
Write-Host "Configuring Web App settings..." -ForegroundColor Green
az webapp config appsettings set --name $webAppName --resource-group $resourceGroupName --settings `
  WEBSITE_NODE_DEFAULT_VERSION="18.17.0" `
  NODE_ENV="production" `
  NEXTAUTH_URL="https://$webAppName.azurewebsites.net" `
  NEXTAUTH_SECRET="$(openssl rand -base64 32)" `
  API_BASE_URL="https://openpath-api-prod.azurewebsites.net/api"

# Get the web app URL
$webAppUrl = "https://$webAppName.azurewebsites.net"
Write-Host "Web App URL: $webAppUrl" -ForegroundColor Cyan

# Get publish profile for GitHub Actions
Write-Host "Getting publish profile for GitHub Actions..." -ForegroundColor Green
Write-Host "Save this publish profile as a GitHub secret named 'AZUREAPPSERVICE_PUBLISHPROFILE':" -ForegroundColor Yellow
az webapp deployment list-publishing-profiles --name $webAppName --resource-group $resourceGroupName --xml

Write-Host ""
Write-Host "✅ Azure resources created successfully!" -ForegroundColor Green
Write-Host "Web App Name: $webAppName" -ForegroundColor Cyan
Write-Host "Web App URL: $webAppUrl" -ForegroundColor Cyan
Write-Host "Resource Group: $resourceGroupName" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the publish profile output above" -ForegroundColor White
Write-Host "2. Add it as a GitHub secret named 'AZUREAPPSERVICE_PUBLISHPROFILE'" -ForegroundColor White
Write-Host "3. Update the AZURE_WEBAPP_NAME in .github/workflows/azure-webapps-node.yml to: $webAppName" -ForegroundColor White
