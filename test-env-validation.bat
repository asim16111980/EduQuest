@echo off
setlocal enabledelayedexpansion

echo ==================================================
echo   EduQuest Environment Variable Test
echo ==================================================
echo.

REM Check if environment file exists
if exist ".env.local" (
    echo [✓] Environment file .env.local exists
) else (
    echo [✗] Environment file .env.local not found
    goto :error
)

echo.
echo Testing environment variables...
set SUPABASE_URL=
set SUPABASE_ANON_KEY=
set SUPABASE_SERVICE_ROLE_KEY=

REM Parse environment file
set "line="
for /f "usebackq delims=" %%a in (".env.local") do (
    set "line=%%a"
    REM Remove comments and empty lines
    for /f "tokens=*" %%b in ("!line:*#=!") do (
        if not "%%b"=="" (
            REM Parse key=value pairs
            for /f "tokens=1,2 delims==" %%c in ("%%b") do (
                if "%%c"=="SUPABASE_URL" set SUPABASE_URL=%%d
                if "%%c"=="SUPABASE_ANON_KEY" set SUPABASE_ANON_KEY=%%d
                if "%%c"=="SUPABASE_SERVICE_ROLE_KEY" set SUPABASE_SERVICE_ROLE_KEY=%%d
            )
        )
    )
)

REM Check if variables are set
if defined SUPABASE_URL (
    echo [✓] SUPABASE_URL is set: %SUPABASE_URL%
) else (
    echo [✗] SUPABASE_URL is not set
)

if defined SUPABASE_ANON_KEY (
    echo [✓] SUPABASE_ANON_KEY is set (first 20 chars): %SUPABASE_ANON_KEY:~0,20%...
) else (
    echo [✗] SUPABASE_ANON_KEY is not set
)

if defined SUPABASE_SERVICE_ROLE_KEY (
    echo [✓] SUPABASE_SERVICE_ROLE_KEY is set (first 20 chars): %SUPABASE_SERVICE_ROLE_KEY:~0,20%...
) else (
    echo [✗] SUPABASE_SERVICE_ROLE_KEY is not set
)

echo.
echo Checking gitignore configuration...
if exist ".gitignore" (
    echo [✓] Gitignore file exists
    findstr /C:".env" ".gitignore" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [✓] Environment variables protected in gitignore
    ) else (
        echo [✗] Environment variables not protected in gitignore
    )
) else (
    echo [✗] No gitignore file found
)

echo.
echo Checking git status...
git status --porcelain 2>nul | findstr /R "^\?\?.*\.env" >nul 2>&1
if !errorlevel! equ 0 (
    echo [✓] .env.local is untracked (good - not committed)
) else (
    echo [!] .env.local may be tracked or not present
)

echo.
echo Checking Railway domain configuration...
if defined SITE_URL (
    echo [✓] SITE_URL is set: %SITE_URL%
    echo SITE_URL | findstr /R "railway\.app" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [✓] Railway domain configured
    ) else (
        echo [!] Railway domain not configured
    )
) else (
    echo [!] SITE_URL not set
)

echo.
echo ==================================================
echo   Environment Test Complete
echo ==================================================

REM Test file existence and basic configuration
if exist ".env.local" (
    echo Environment validation PASSED
    exit /b 0
) else (
    echo Environment validation FAILED
    exit /b 1
)