# Tool Verification Script
Write-Host "Checking installed tools..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found - Install from https://nodejs.org/" -ForegroundColor Red
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found - Should come with Node.js" -ForegroundColor Red
}

# Check Azure CLI
try {
    $azVersion = az --version | Select-Object -First 1
    Write-Host "Azure CLI: $azVersion" -ForegroundColor Green
} catch {
    Write-Host "Azure CLI not found - Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Red
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git not found - Install from https://git-scm.com/" -ForegroundColor Red
}

Write-Host ""
Write-Host "Tool verification complete!" -ForegroundColor Cyan
Write-Host "If any tools show as missing, please install them and restart your terminal." -ForegroundColor Yellow
Write-Host "Once all tools are available, you can proceed with deployment!" -ForegroundColor Green
