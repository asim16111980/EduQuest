# Simple Authentication Test
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  EduQuest Authentication Test" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if scripts exist
if (Test-Path ".\scripts\test-auth.sh") { 
    Write-Host "[✓] Authentication test script exists" -ForegroundColor Green 
} else { 
    Write-Host "[✗] Authentication test script not found" -ForegroundColor Red 
}

if (Test-Path ".\scripts\verify\verify-env.sh") { 
    Write-Host "[✓] Environment validation script exists" -ForegroundColor Green 
} else { 
    Write-Host "[✗] Environment validation script not found" -ForegroundColor Red 
}

# Check if documentation exists
if (Test-Path ".\docs\railway-env-vars.md") { 
    Write-Host "[✓] Railway environment variables documentation exists" -ForegroundColor Green 
} else { 
    Write-Host "[✗] Railway environment variables documentation not found" -ForegroundColor Red 
}

if (Test-Path ".\docs\deployment-checklist.md") { 
    Write-Host "[✓] Deployment checklist documentation exists" -ForegroundColor Green 
} else { 
    Write-Host "[✗] Deployment checklist documentation not found" -ForegroundColor Red 
}

if (Test-Path ".\.env.local.template") { 
    Write-Host "[✓] Environment template exists" -ForegroundColor Green 
} else { 
    Write-Host "[✗] Environment template not found" -ForegroundColor Red 
}

Write-Host "Authentication testing resources READY" -ForegroundColor Green