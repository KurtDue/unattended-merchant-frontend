# 🛠️ TOOL INSTALLATION GUIDE

## 1. Node.js Installation (Required for npm and Next.js)

### Download and Install Node.js
1. **Visit**: https://nodejs.org/
2. **Download**: "LTS" version (currently 18.x or 20.x)
3. **Run the installer** and follow the setup wizard
4. **Important**: Check "Add to PATH" during installation

### Verify Installation
After installation, open a new PowerShell window and run:
```powershell
node --version
npm --version
```
You should see version numbers like:
- Node: v18.17.0 (or higher)
- npm: 9.6.7 (or higher)

---

## 2. Azure CLI Installation (Required for Azure deployment)

### Option A: Windows Installer (Recommended)
1. **Visit**: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
2. **Download**: Azure CLI MSI installer
3. **Run the installer** and follow the setup wizard

### Option B: PowerShell (Alternative)
Run PowerShell as Administrator and execute:
```powershell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi
```

### Verify Installation
Open a new PowerShell window and run:
```powershell
az --version
```
You should see Azure CLI version information.

---

## 3. Git Installation (Required for version control)

### Download and Install Git
1. **Visit**: https://git-scm.com/download/win
2. **Download**: Git for Windows
3. **Run the installer** with these recommended settings:
   - ✅ Use Git from the command line and also from 3rd-party software
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use Windows' default console window

### Verify Installation
Open a new PowerShell window and run:
```powershell
git --version
```
You should see Git version information.

---

## 4. Quick Verification Script

After installing all tools, save this as `verify-tools.ps1` and run it:

```powershell
# Tool Verification Script
Write-Host "🔍 Checking installed tools..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
}

# Check Azure CLI
try {
    $azVersion = az --version | Select-Object -First 1
    Write-Host "✅ Azure CLI: $azVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found" -ForegroundColor Red
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found" -ForegroundColor Red
}

Write-Host "`n🎉 Tool verification complete!" -ForegroundColor Cyan
Write-Host "If any tools show as ❌, please install them using the links above." -ForegroundColor Yellow
```

---

## 5. Troubleshooting

### Common Issues:

**"Command not found" after installation:**
- Close and reopen PowerShell/VS Code
- Restart your computer if needed
- Check if tools were added to PATH environment variable

**Node.js installation issues:**
- Try downloading from https://nodejs.org/en/download/
- Use the Windows Installer (.msi) version
- Run as Administrator if needed

**Azure CLI issues:**
- Try the MSI installer instead of PowerShell method
- Restart terminal after installation
- Check Windows Defender didn't block the download

**Git issues:**
- Download from official site: https://git-scm.com/
- During installation, ensure "Add Git to PATH" is selected
- Restart terminal after installation

---

## 6. Next Steps After Installation

Once all tools are installed and verified:

1. **Return to VS Code**
2. **Open a new terminal** (Ctrl + ` or View → Terminal)
3. **Navigate to project folder**: `cd C:\Git\ReceiptHub\unattended-merchant2`
4. **Continue with deployment**: Follow the DEPLOYMENT-CHECKLIST.md

Ready to proceed with the actual deployment steps!
