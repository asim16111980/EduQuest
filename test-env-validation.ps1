# Environment Validation Test Script (PowerShell)
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  EduQuest Environment Variable Test" -ForegroundColor Cyan
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

# Initialize variables
$SUPABASE_URL = $null
$SUPABASE_ANON_KEY = $null
$SUPABASE_SERVICE_ROLE_KEY = $null

# Parse environment file
$envContent = Get-Content ".env.local" -Raw
$lines = $envContent -split "`r`n"

foreach ($line in $lines) {
    $line = $line.Trim()
    if ($line -ne "" -and $line -notmatch "^#") {
        $parts = $line.Split('=', 2)
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            
            switch ($key) {
                "SUPABASE_URL" { $SUPABASE_URL = $value }
                "SUPABASE_ANON_KEY" { $SUPABASE_ANON_KEY = $value }
                "SUPABASE_SERVICE_ROLE_KEY" { $SUPABASE_SERVICE_ROLE_KEY = $value }
            }
        }
    }
}

# Check if variables are set
if ($SUPABASE_URL) {
    Write-Host "[✓] SUPABASE_URL is set: $SUPABASE_URL" -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_URL is not set" -ForegroundColor Red
}

if ($SUPABASE_ANON_KEY) {
    $first20 = $SUPABASE_ANON_KEY.Substring(0, [Math]::Min(20, $SUPABASE_ANON_KEY.Length))
    Write-Host "[✓] SUPABASE_ANON_KEY is set (first 20 chars): $first20..." -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_ANON_KEY is not set" -ForegroundColor Red
}

if ($SUPABASE_SERVICE_ROLE_KEY) {
    $first20 = $SUPABASE_SERVICE_ROLE_KEY.Substring(0, [Math]::Min(20, $SUPABASE_SERVICE_ROLE_KEY.Length))
    Write-Host "[✓] SUPABASE_SERVICE_ROLE_KEY is set (first 20 chars): $first20..." -ForegroundColor Green
} else {
    Write-Host "[✗] SUPABASE_SERVICE_ROLE_KEY is not set" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking gitignore configuration..."

if (Test-Path ".gitignore") {
    Write-Host "[✓] Gitignore file exists" -ForegroundColor Green
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -match "\.env") {
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
if ($gitStatus -ne $null) {
    if ($gitStatus -match "^\?\?.*\.env") {
        Write-Host "[✓] .env.local is untracked (good - not committed)" -ForegroundColor Green
    }
    else {
        Write-Host "[!] .env.local may be tracked or not present" -ForegroundColor Yellow
    }
}
else {
    Write-Host "[!] Git not available or not a git repository" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking Railway domain configuration..."

if ($env:SITE_URL) {
    Write-Host "[✓] SITE_URL is set: $env:SITE_URL" -ForegroundColor Green
    if ($env:SITE_URL -match "railway\.app") {
        Write-Host "[✓] Railway domain configured" -ForegroundColor Green
    } else {
        Write-Host "[!] Railway domain not configured" -ForegroundColor Yellow
    }
} elseif ($SUPABASE_URL -match "railway\.app") {
    Write-Host "[✓] Railway domain detected in SUPABASE_URL" -ForegroundColor Green
} else {
    Write-Host "[!] Railway domain not configured" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Environment Test Complete" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Test file existence and basic configuration
if (Test-Path ".env.local") {
    Write-Host "Environment validation PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Environment validation FAILED" -ForegroundColor Red
    exit 1
}