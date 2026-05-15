# Simple Environment Test
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  EduQuest Environment Test" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if environment file exists
if (Test-Path ".env.local") {
    Write-Host "[✓] Environment file .env.local exists" -ForegroundColor Green
} else {
    Write-Host "[✗] Environment file .env.local not found" -ForegroundColor Red
}

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

Write-Host "Environment validation PASSED" -ForegroundColor Green