# Azure Web App Configuration

After deployment, configure these environment variables in Azure:

## Azure Portal Configuration
1. Go to Azure Portal → Your Web App
2. Navigate to Settings → Configuration
3. Add these Application Settings:

```
NEXTAUTH_URL=https://your-app-name.azurewebsites.net
NEXTAUTH_SECRET=your-generated-secret-key-here
API_BASE_URL=https://openpath-api-prod.azurewebsites.net/api
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=18.17.0
```

## Azure CLI Configuration (Alternative)
```powershell
# Set environment variables via CLI
az webapp config appsettings set --name "your-app-name" --resource-group "rg-unattended-merchant" --settings NEXTAUTH_URL="https://your-app-name.azurewebsites.net"

az webapp config appsettings set --name "your-app-name" --resource-group "rg-unattended-merchant" --settings NEXTAUTH_SECRET="your-secret-here"

az webapp config appsettings set --name "your-app-name" --resource-group "rg-unattended-merchant" --settings API_BASE_URL="https://openpath-api-prod.azurewebsites.net/api"
```

## Verification
After configuration:
1. Restart the web app: `az webapp restart --name "your-app-name" --resource-group "rg-unattended-merchant"`
2. Visit your app URL
3. Test login with demo credentials:
   - Email: demo@joker.com
   - Password: demo123
4. Test door unlock functionality in the Doors section
