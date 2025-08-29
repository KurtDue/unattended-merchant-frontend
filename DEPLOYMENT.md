# GitHub Setup Instructions

## 1. Initialize Git Repository (if not already done)
```powershell
cd C:\Git\ReceiptHub\unattended-merchant2
git init
git add .
git commit -m "Initial commit: Complete merchant frontend application"
```

## 2. Create GitHub Repository
- Go to https://github.com/new
- Repository name: `unattended-merchant-frontend`
- Description: `Frontend web application for unattended store management`
- Set to Public or Private as needed
- Don't initialize with README (we already have one)

## 3. Link Local Repository to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/unattended-merchant-frontend.git
git branch -M main
git push -u origin main
```

## 4. Configure GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

### Required Secrets:
- **AZUREAPPSERVICE_PUBLISHPROFILE**: 
  - Get this from Azure CLI command in deploy-azure.ps1
  - Copy the entire XML content from the publish profile

### Optional Secrets (for enhanced security):
- **AZURE_WEBAPP_NAME**: Your Azure Web App name
- **NEXTAUTH_SECRET**: Generate a random string for production

## 5. Trigger Deployment
Once secrets are configured, push any change to main branch:
```powershell
git add .
git commit -m "Configure deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
✅ Install dependencies
✅ Build the Next.js application  
✅ Deploy to Azure Web Apps
✅ Make your app live at https://your-app-name.azurewebsites.net
