# DEPLOYMENT STEPS - Run these manually

## Step 1: Azure Login and Setup
Write-Host "Starting Azure deployment process..." -ForegroundColor Green

# Login to Azure (will open browser)
az login

# Set your subscription (replace with your actual subscription ID)
# az account set --subscription "your-subscription-id-here"

# Create resource group
az group create --name "rg-unattended-merchant" --location "East US"

## Step 2: Deploy Web App
$webAppName = "unattended-merchant-$(Get-Random -Minimum 1000 -Maximum 9999)"
Write-Host "Creating Web App: $webAppName" -ForegroundColor Yellow

# Create App Service Plan
az appservice plan create --name "asp-unattended-merchant" --resource-group "rg-unattended-merchant" --sku B1 --is-linux

# Create Web App
az webapp create --resource-group "rg-unattended-merchant" --plan "asp-unattended-merchant" --name $webAppName --runtime "NODE|18-lts"

## Step 3: Configure Environment Variables
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings `
  WEBSITE_NODE_DEFAULT_VERSION="18.17.0" `
  NODE_ENV="production" `
  NEXTAUTH_URL="https://$webAppName.azurewebsites.net" `
  NEXTAUTH_SECRET="your-random-secret-here" `
  API_BASE_URL="https://openpath-api-prod.azurewebsites.net/api"

## Step 4: Get Publish Profile for GitHub
Write-Host "Getting publish profile for GitHub Actions..." -ForegroundColor Green
az webapp deployment list-publishing-profiles --name $webAppName --resource-group "rg-unattended-merchant" --xml

Write-Host ""
Write-Host "Web App URL: https://$webAppName.azurewebsites.net" -ForegroundColor Green
Write-Host "Web App Name: $webAppName" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Copy the publish profile XML output above and add it as GitHub secret 'AZUREAPPSERVICE_PUBLISHPROFILE'" -ForegroundColor Red
