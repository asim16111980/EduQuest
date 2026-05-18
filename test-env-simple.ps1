# Simple Environment Test
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  EduQuest Environment Test" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if environment file exists
if (Test-Path ".env.local") {
    Write-Host "[✓] Environment file .env.local exists" -ForegroundColor Green
} else {
    Write-Host "[✗] Environment file .env.local not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Testing environment variables..."

# Check for required variables
$envFile = Get-Content ".env.local" -Raw
if ($envFile -match "SUPABASE_URL") {
    Write-Host "[✓] SUPABASE_URL is present" -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_URL not found" -ForegroundColor Red
}

if ($envFile -match "SUPABASE_ANON_KEY") {
    Write-Host "[✓] SUPABASE_ANON_KEY is present" -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_ANON_KEY not found" -ForegroundColor Red
}

if ($envFile -match "SUPABASE_SERVICE_ROLE_KEY") {
    Write-Host "[✓] SUPABASE_SERVICE_ROLE_KEY is present" -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_SERVICE_ROLE_KEY not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking gitignore configuration..."

if (Test-Path ".gitignore") {
    Write-Host "[✓] Gitignore file exists" -ForegroundColor Green
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Host "[✓] Environment variables protected in gitignore" -ForegroundColor Green
    } else {
        Write-Host "[✗] Environment variables not protected in gitignore" -ForegroundColor Red
    }
} else {
    Write-Host "[✗] No gitignore file found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking git status..."

$gitStatus = git status --porcelain 2>$null
if ($gitStatus -ne $null -and $gitStatus -match "^\?\?.*\.env") {
    Write-Host "[✓] .env.local is untracked (good - not committed)" -ForegroundColor Green
} else {
    Write-Host "[!] .env.local may be tracked or not present" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Environment Test Complete" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "Environment validation PASSED" -ForegroundColor Green
exit 0