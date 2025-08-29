# Azure Deployment Script
# Run these commands in PowerShell with Azure CLI installed

# 1. Login to Azure
az login

# 2. Set your subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id"

# 3. Create resource group
az group create --name "rg-unattended-merchant" --location "East US"

# 4. Deploy Azure resources using ARM template
az deployment group create `
  --resource-group "rg-unattended-merchant" `
  --template-file "azure-deploy.json" `
  --parameters webAppName="unattended-merchant-$(Get-Random)"

# 5. Get the web app URL
az webapp show --name "unattended-merchant-xxxxx" --resource-group "rg-unattended-merchant" --query "defaultHostName" --output tsv

# 6. Download publish profile for GitHub Actions
az webapp deployment list-publishing-profiles --name "unattended-merchant-xxxxx" --resource-group "rg-unattended-merchant" --xml
