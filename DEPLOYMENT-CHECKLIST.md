# 🚀 DEPLOYMENT CHECKLIST

## ✅ **Phase 1: Prerequisites** (Do this first)

### Install Required Tools
- [ ] **Node.js 18+**: Download from https://nodejs.org/
- [ ] **Azure CLI**: Download from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
- [ ] **Git**: Download from https://git-scm.com/

### Verify Installation
```powershell
node --version    # Should show v18.x.x or higher
npm --version     # Should show npm version
az --version      # Should show Azure CLI version
git --version     # Should show Git version
```

---

## ✅ **Phase 2: Local Testing** (5 minutes)

```powershell
cd C:\Git\ReceiptHub\unattended-merchant2
npm install
npm run build
npm start  # Test at http://localhost:3000
```

**Test the application:**
- [ ] Login with demo@joker.com / demo123
- [ ] Navigate through dashboard
- [ ] Test door unlock functionality
- [ ] Check cameras and analytics pages

---

## ✅ **Phase 3: Azure Setup** (10 minutes)

### 1. Login to Azure
```powershell
az login
az account set --subscription "your-subscription-id"
```

### 2. Run Deployment Script
```powershell
# Make the deployment script executable and run it
.\deploy-azure.ps1
```

**OR manually create resources:**
```powershell
# Create resource group
az group create --name "rg-unattended-merchant" --location "East US"

# Deploy using ARM template
az deployment group create --resource-group "rg-unattended-merchant" --template-file "azure-deploy.json" --parameters webAppName="unattended-merchant-$(Get-Random)"
```

### 3. Get Web App Details
```powershell
# Note down your web app name and URL
az webapp list --resource-group "rg-unattended-merchant" --output table
```

---

## ✅ **Phase 4: GitHub Setup** (5 minutes)

### 1. Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Name: `unattended-merchant-frontend`
- [ ] Set visibility (public/private)
- [ ] Don't initialize with README

### 2. Push Code to GitHub
```powershell
git init
git add .
git commit -m "Complete merchant frontend application"
git remote add origin https://github.com/YOUR_USERNAME/unattended-merchant-frontend.git
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Secrets
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add secret: `AZUREAPPSERVICE_PUBLISHPROFILE`
3. Get publish profile:
   ```powershell
   az webapp deployment list-publishing-profiles --name "your-app-name" --resource-group "rg-unattended-merchant" --xml
   ```
4. Copy entire XML output as the secret value

---

## ✅ **Phase 5: Environment Configuration** (5 minutes)

### Configure Azure Web App Settings
```powershell
# Replace "your-app-name" with your actual app name
az webapp config appsettings set --name "your-app-name" --resource-group "rg-unattended-merchant" --settings `
  NEXTAUTH_URL="https://your-app-name.azurewebsites.net" `
  NEXTAUTH_SECRET="$(openssl rand -base64 32)" `
  API_BASE_URL="https://openpath-api-prod.azurewebsites.net/api" `
  NODE_ENV="production"
```

---

## ✅ **Phase 6: Deploy and Test** (5 minutes)

### 1. Trigger Deployment
```powershell
# Make any small change and push to trigger deployment
echo "# Deployment trigger" >> README.md
git add .
git commit -m "Trigger deployment"
git push origin main
```

### 2. Monitor Deployment
- [ ] Go to GitHub → Your repo → Actions tab
- [ ] Watch the deployment workflow run
- [ ] Wait for green checkmark (usually 3-5 minutes)

### 3. Test Live Application
- [ ] Visit `https://your-app-name.azurewebsites.net`
- [ ] Login with demo@joker.com / demo123
- [ ] Test door unlock functionality
- [ ] Verify cameras and analytics work

---

## 🎉 **Success Criteria**

Your deployment is successful when:
- [ ] ✅ Application loads at your Azure URL
- [ ] ✅ Login works with demo credentials
- [ ] ✅ Dashboard shows store data
- [ ] ✅ Door unlock makes real API calls
- [ ] ✅ All pages render correctly
- [ ] ✅ No console errors in browser

---

## 🔧 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check package.json and run `npm run build` locally first
2. **Login doesn't work**: Verify NEXTAUTH_SECRET is set in Azure
3. **API calls fail**: Check API_BASE_URL environment variable
4. **Page not found**: Ensure all pages are committed to Git

### Get Help:
- Check Azure logs: `az webapp log tail --name "your-app-name" --resource-group "rg-unattended-merchant"`
- GitHub Actions logs: Go to your repo → Actions → Click on failed run
- Browser console: F12 → Console tab for client-side errors

---

## 📋 **Next Steps After Deployment**

1. **Custom Domain**: Configure your own domain in Azure
2. **SSL Certificate**: Enable HTTPS (usually automatic)
3. **Monitoring**: Set up Application Insights
4. **Backup**: Configure automated backups
5. **Scaling**: Adjust App Service Plan as needed
