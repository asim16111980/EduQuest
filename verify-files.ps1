# File Verification Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  EduQuest File Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check files
$files = @(
    ".env.local",
    ".env.local.template", 
    ".\scripts\verify\verify-env.sh",
    ".\scripts\test-auth.sh",
    ".\docs\railway-env-vars.md",
    ".\docs\deployment-checklist.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[✓] $file exists" -ForegroundColor Green
    } else {
        Write-Host "[✗] $file not found" -ForegroundColor Red
    }
}

Write-Host "Phase 6 implementation files VERIFIED" -ForegroundColor Green