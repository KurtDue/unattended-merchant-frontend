# Simple deployment script - Configure existing Azure App Service
Write-Host "Configuring existing Azure App Service for Next.js deployment..." -ForegroundColor Green

# Configuration
$resourceGroup = "Unattended"
$webAppName = "unattended-merchant-prod"

# Generate a random secret for NextAuth
$nextAuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Configure app settings
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $webAppName `
  --settings `
    NEXTAUTH_SECRET="$nextAuthSecret" `
    NEXTAUTH_URL="https://$webAppName.azurewebsites.net" `
    NODE_ENV="production" `
    WEBSITE_NODE_DEFAULT_VERSION="~18" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    ENABLE_ORYX_BUILD="true" `
    WEBSITE_RUN_FROM_PACKAGE="1"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Environment variables configured successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to configure environment variables" -ForegroundColor Red
    exit 1
}

# Set Node.js version
Write-Host "Configuring Node.js runtime..." -ForegroundColor Yellow
az webapp config set `
  --resource-group $resourceGroup `
  --name $webAppName `
  --linux-fx-version "NODE|18-lts"

# Get deployment info
Write-Host "`n=== AZURE APP SERVICE CONFIGURED ===" -ForegroundColor Green
Write-Host "Web App Name: $webAppName" -ForegroundColor Cyan
Write-Host "Web App URL: https://$webAppName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "Resource Group: $resourceGroup" -ForegroundColor Cyan

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "1. Create GitHub repository for this project" -ForegroundColor White
Write-Host "2. Set up GitHub Actions for automatic deployment" -ForegroundColor White
Write-Host "3. Push code to GitHub to trigger deployment" -ForegroundColor White

# Get publish profile
Write-Host "`nGetting publish profile for GitHub Actions..." -ForegroundColor Yellow
$publishProfile = az webapp deployment list-publishing-profiles `
  --resource-group $resourceGroup `
  --name $webAppName `
  --xml

if ($publishProfile) {
    Write-Host "`n=== PUBLISH PROFILE FOR GITHUB SECRETS ===" -ForegroundColor Cyan
    Write-Host "Copy this entire profile and add it as a GitHub secret named 'AZUREAPPSERVICE_PUBLISHPROFILE':" -ForegroundColor White
    Write-Host "$publishProfile" -ForegroundColor Gray
}
