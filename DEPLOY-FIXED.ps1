# FIXED DEPLOYMENT SCRIPT - Using Free Tier
Write-Host "Starting Azure deployment process (Free Tier)..." -ForegroundColor Green

# Generate unique web app name
$webAppName = "unattended-merchant-$(Get-Random -Minimum 1000 -Maximum 9999)"
Write-Host "Creating Web App: $webAppName" -ForegroundColor Yellow

# Create App Service Plan (Free Tier)
Write-Host "Creating App Service Plan (Free Tier)..." -ForegroundColor Green
az appservice plan create --name "asp-unattended-merchant-free" --resource-group "rg-unattended-merchant" --sku F1

# Create Web App with Node.js runtime
Write-Host "Creating Web App with Node.js..." -ForegroundColor Green
az webapp create --resource-group "rg-unattended-merchant" --plan "asp-unattended-merchant-free" --name $webAppName --runtime "NODE:18-lts"

# Wait a moment for the web app to be ready
Write-Host "Waiting for Web App to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Configure Environment Variables
Write-Host "Configuring environment variables..." -ForegroundColor Green
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0"
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings NODE_ENV="production"
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings NEXTAUTH_URL="https://$webAppName.azurewebsites.net"
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings NEXTAUTH_SECRET="$(openssl rand -base64 32)"
az webapp config appsettings set --name $webAppName --resource-group "rg-unattended-merchant" --settings API_BASE_URL="https://openpath-api-prod.azurewebsites.net/api"

# Get publish profile for GitHub Actions
Write-Host "Getting publish profile for GitHub Actions..." -ForegroundColor Green
$publishProfile = az webapp deployment list-publishing-profiles --name $webAppName --resource-group "rg-unattended-merchant" --xml

Write-Host ""
Write-Host "=== DEPLOYMENT COMPLETED ===" -ForegroundColor Green
Write-Host "Web App Name: $webAppName" -ForegroundColor Yellow
Write-Host "Web App URL: https://$webAppName.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "1. Copy the publish profile below to GitHub secrets as 'AZUREAPPSERVICE_PUBLISHPROFILE'" -ForegroundColor White
Write-Host "2. Update .github/workflows/azure-webapps-node.yml with web app name: $webAppName" -ForegroundColor White
Write-Host "3. Push to GitHub to trigger automatic deployment" -ForegroundColor White
Write-Host ""
Write-Host "=== PUBLISH PROFILE (Copy this to GitHub secrets) ===" -ForegroundColor Red
Write-Host $publishProfile -ForegroundColor White
