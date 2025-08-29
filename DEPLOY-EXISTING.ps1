# Deploy to existing Azure App Service
Write-Host "Deploying to existing Azure App Service..." -ForegroundColor Green

# Configuration
$resourceGroup = "Unattended"
$webAppName = "unattended-merchant-prod"
$location = "norwayeast"

# Generate a random secret for NextAuth
$nextAuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "Configuring environment variables for $webAppName..." -ForegroundColor Yellow

# Configure app settings for the existing web app
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $webAppName `
  --settings `
    NEXTAUTH_SECRET="$nextAuthSecret" `
    NEXTAUTH_URL="https://$webAppName.azurewebsites.net" `
    NODE_ENV="production" `
    WEBSITE_NODE_DEFAULT_VERSION="~18" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    WEBSITE_RUN_FROM_PACKAGE="1"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Environment variables configured successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to configure environment variables" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

# Deploy using zip deployment
Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Create a zip file with the application
$zipFile = "deployment.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

# Create deployment zip (excluding node_modules, .git, etc.)
$excludePatterns = @("node_modules", ".git", ".next", "*.log", "*.zip", "DEPLOY*.ps1")
$filesToZip = Get-ChildItem -Recurse | Where-Object { 
    $item = $_
    -not ($excludePatterns | Where-Object { $item.FullName -like "*$_*" })
}

Write-Host "Compressing files for deployment..." -ForegroundColor Yellow
Compress-Archive -Path $filesToZip.FullName -DestinationPath $zipFile -Force

# Deploy the zip file
Write-Host "Deploying to Azure App Service..." -ForegroundColor Yellow
az webapp deploy `
  --resource-group $resourceGroup `
  --name $webAppName `
  --src-path $zipFile `
  --type zip

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    
    # Clean up
    Remove-Item $zipFile
    
    Write-Host "`n=== DEPLOYMENT SUCCESSFUL ===" -ForegroundColor Green
    Write-Host "Web App Name: $webAppName" -ForegroundColor Cyan
    Write-Host "Web App URL: https://$webAppName.azurewebsites.net" -ForegroundColor Cyan
    Write-Host "`nYour merchant portal is now live!" -ForegroundColor Green
    Write-Host "Login with: demo@joker.com / demo123" -ForegroundColor Yellow
    
} else {
    Write-Host "Deployment failed" -ForegroundColor Red
    Remove-Item $zipFile -ErrorAction SilentlyContinue
    exit 1
}

# Get publish profile for GitHub Actions setup
Write-Host "`nGetting publish profile for GitHub Actions..." -ForegroundColor Yellow
$publishProfile = az webapp deployment list-publishing-profiles `
  --resource-group $resourceGroup `
  --name $webAppName `
  --xml

if ($publishProfile) {
    Write-Host "`n=== GITHUB ACTIONS SETUP ===" -ForegroundColor Cyan
    Write-Host "1. Create GitHub repository for this project" -ForegroundColor White
    Write-Host "2. Add this publish profile as a secret named 'AZUREAPPSERVICE_PUBLISHPROFILE':" -ForegroundColor White
    Write-Host "$publishProfile" -ForegroundColor Gray
    Write-Host "3. Update .github/workflows/azure-webapps-node.yml with app name: $webAppName" -ForegroundColor White
}
