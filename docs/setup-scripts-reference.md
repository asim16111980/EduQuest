# Setup Scripts Reference

**Date**: 2026-05-10  
**Project**: EduQuest Admin Dashboard  
**Scripts Directory**: `scripts/`

## Overview

This document provides detailed information about all setup scripts used in the EduQuest admin dashboard project. Each script serves a specific purpose in the setup and configuration process.

## Script Organization

### Setup Scripts (`scripts/setup/`)
- `supabase-project-setup.sh` - Project initialization
- `security-config.sh` - Security and RLS configuration
- `realtime-setup.sh` - Realtime service setup
- `cli-auth-framework.sh` - CLI authentication framework

### Verification Scripts (`scripts/verify/`)
- `verify-env.sh` - Environment validation
- `project-connection.sh` - Project connection verification
- `security-verification.sh` - Security configuration verification
- `verify-realtime.sh` - Realtime functionality verification
- `phase2-verification.sh` - Comprehensive phase verification

### Test Scripts (`scripts/test-`)
- `test-auth.sh` - Authentication configuration testing

### Library Scripts (`scripts/lib/`)
- `logging.sh` - Logging utilities
- `retry-utils.sh` - Retry logic utilities
- `env-validation.sh` - Environment validation utilities

## Detailed Script Information

### Setup Scripts

#### 1. `supabase-project-setup.sh`

**Purpose**: Initialize Supabase project and basic configuration

**Usage**:
```bash
./scripts/setup/supabase-project-setup.sh
```

**Features**:
- Creates new Supabase project
- Configures basic project settings
- Sets up initial database structure
- Implements retry logic for transient failures

**Exit Codes**:
- 0: Success
- 1: Project creation failed
- 2: Configuration failed

#### 2. `security-config.sh`

**Purpose**: Configure security settings including RLS and authentication

**Usage**:
```bash
./scripts/setup/security-config.sh
```

**Features**:
- Enables Row Level Security (RLS) globally
- Creates basic security policies
- Configures authentication settings
- Sets up site URL configuration

**Exit Codes**:
- 0: Success
- 1: RLS enablement failed
- 2: Policy creation failed

#### 3. `realtime-setup.sh`

**Purpose**: Configure Realtime service for specific tables

**Usage**:
```bash
./scripts/setup/realtime-setup.sh
```

**Features**:
- Enables Realtime service
- Configures `activity_logs` table
- Configures `leaderboard_snapshots` table
- Sets up proper permissions

**Exit Codes**:
- 0: Success
- 1: Realtime configuration failed

#### 4. `cli-auth-framework.sh`

**Purpose**: CLI authentication and project linking framework

**Usage**:
```bash
./scripts/setup/cli-auth-framework.sh
```

**Features**:
- Authenticates with Supabase CLI
- Links local project to remote
- Validates project connection
- Provides error handling

### Verification Scripts

#### 1. `verify-env.sh`

**Purpose**: Comprehensive environment validation

**Usage**:
```bash
./scripts/verify/verify-env.sh [env-file]
```

**Arguments**:
- `env-file`: Environment file to validate (default: `.env.local`)

**Features**:
- Validates environment variables format and presence
- Checks gitignore configuration
- Verifies no sensitive files are staged
- Tests Railway domain configuration

**Exit Codes**:
- 0: All validations passed
- 1: Validation failed

**Example Output**:
```
==================================================
  EduQuest Environment Variable Verification
==================================================
[✓] Environment file .env.local exists
[✓] SUPABASE_URL is set: https://project.supabase.co
[✓] SUPABASE_ANON_KEY is set (first 20 chars): eyJhbGciOiJIUzI1NiIs...
[✓] Gitignore properly configured for secrets protection
[✓] No sensitive files are staged for commit
[✓] Railway production configuration is valid
✅ Environment validation PASSED
```

#### 2. `project-connection.sh`

**Purpose**: Verify Supabase project connection and status

**Usage**:
```bash
./scripts/verify/project-connection.sh [project-ref]
```

**Arguments**:
- `project-ref`: Supabase project reference

**Features**:
- Tests CLI connection to project
- Validates project status
- Checks database connection
- Measures connection time

**Exit Codes**:
- 0: Connection successful
- 1: Connection failed

#### 3. `security-verification.sh`

**Purpose**: Verify security configuration

**Usage**:
```bash
./scripts/verify/security-verification.sh
```

**Features**:
- Checks RLS enablement status
- Validates security policies
- Tests authentication configuration
- Verifies site URL settings

**Exit Codes**:
- 0: Security configuration valid
- 1: Security issues found

#### 4. `verify-realtime.sh`

**Purpose**: Verify Realtime functionality

**Usage**:
```bash
./scripts/verify/verify-realtime.sh
```

**Features**:
- Tests Realtime service status
- Validates table configuration
- Tests subscription functionality
- Measures performance

**Exit Codes**:
- 0: Realtime working
- 1: Realtime configuration issues

#### 5. `phase2-verification.sh`

**Purpose**: Comprehensive phase 2 verification

**Usage**:
```bash
./scripts/verify/phase2-verification.sh
```

**Features**:
- Runs all verification scripts in order
- Provides detailed reporting
- Measures execution time
- Generates summary report

### Test Scripts

#### 1. `test-auth.sh`

**Purpose**: Test authentication configuration

**Usage**:
```bash
./scripts/test-auth.sh [env-file] [options]
```

**Arguments**:
- `env-file`: Environment file to test (default: `.env.local`)
- `--no-cleanup`: Skip test user cleanup

**Features**:
- Creates test user account
- Tests authentication flow
- Validates session management
- Tests PKCE configuration
- Provides cleanup functionality

**Exit Codes**:
- 0: Authentication tests passed
- 1: Authentication tests failed

**Example Output**:
```
==================================================
  EduQuest Authentication Configuration Test
==================================================
[✓] Environment file .env.local exists
[✓] SUPABASE_URL is set: https://project.supabase.co
[✓] Email Provider: Configured
[✓] PKCE Flow: Enabled
[✓] Site URL: Railway domain configured
[✓] Authentication: Working
Authentication test PASSED
```

### Library Scripts

#### 1. `logging.sh`

**Purpose**: Logging utilities for consistent output

**Features**:
- Standardized log levels (DEBUG, INFO, WARN, ERROR)
- Timestamp formatting
- Color-coded output
- Configurable verbosity

**Usage**:
```bash
source scripts/lib/logging.sh
log_info "Information message"
log_error "Error message"
log_debug "Debug message"
```

#### 2. `retry-utils.sh`

**Purpose**: Retry logic for transient failures

**Features**:
- Exponential backoff
- Maximum retry attempts
- Configurable delays
- Error handling

**Usage**:
```bash
source scripts/lib/retry-utils.sh
retry_command 3 2 "supabase status"
```

#### 3. `env-validation.sh`

**Purpose**: Environment variable validation utilities

**Features**:
- Variable format validation
- Pattern matching
- Required variable checking
- Gitignore validation

**Usage**:
```bash
source scripts/lib/env-validation.sh
validate_required
validate_railway_domain
```

## Script Execution Order

### Recommended Setup Sequence

1. **Environment Preparation**
   ```bash
   cp .env.local.template .env.local
   ./scripts/verify/verify-env.sh
   ```

2. **Project Setup**
   ```bash
   ./scripts/setup/supabase-project-setup.sh
   ./scripts/setup/cli-auth-framework.sh
   ```

3. **Security Configuration**
   ```bash
   ./scripts/setup/security-config.sh
   ./scripts/verify/security-verification.sh
   ```

4. **Realtime Setup**
   ```bash
   ./scripts/setup/realtime-setup.sh
   ./scripts/verify/verify-realtime.sh
   ```

5. **Comprehensive Testing**
   ```bash
   ./scripts/test-auth.sh
   ./scripts/verify/phase2-verification.sh
   ```

### Verification Sequence

```bash
# Phase-by-phase verification
./scripts/verify/verify-env.sh          # Environment
./scripts/verify/project-connection.sh  # Connection
./scripts/verify/security-verification.sh # Security
./scripts/verify/verify-realtime.sh     # Realtime
./scripts/test-auth.sh                  # Authentication
```

## Error Handling

### Common Exit Codes

- **0**: Success
- **1**: General error
- **2**: Configuration error
- **3**: Connection error
- **4**: Authentication error
- **5**: Validation error

### Error Recovery

Scripts include error recovery mechanisms:
- Retry logic for transient failures
- Graceful degradation
- Clear error messages
- Suggested fixes

### Debug Mode

Enable debug logging:
```bash
export DEBUG=true
./scripts/verify/verify-env.sh
```

## Best Practices

### Script Usage

1. **Always verify environment first**
   ```bash
   ./scripts/verify/verify-env.sh
   ```

2. **Run scripts in order**
   - Setup scripts must be executed sequentially
   - Verification scripts can run in parallel
   - Test scripts should run after setup

3. **Check exit codes**
   ```bash
   ./scripts/verify/verify-env.sh
   if [ $? -ne 0 ]; then
     echo "Validation failed"
     exit 1
   fi
   ```

4. **Use appropriate logging levels**
   - INFO for normal operation
   - DEBUG for troubleshooting
   - ERROR for failures

### Security Considerations

1. **Never commit environment files**
   - Use `.gitignore` to protect sensitive files
   - Validate with `./scripts/verify/verify-env.sh`

2. **Use service role keys carefully**
   - Only in server-side operations
   - Never in client-side code

3. **Test authentication before deployment**
   - Run `./scripts/test-auth.sh`
   - Verify PKCE flow is working

## Troubleshooting

### Common Issues

1. **Script Execution Failed**
   - Check file permissions
   - Verify dependencies are installed
   - Check environment variables

2. **Connection Issues**
   - Verify project reference
   - Check CLI authentication
   - Run `./scripts/verify/project-connection.sh`

3. **Authentication Issues**
   - Run `./scripts/test-auth.sh`
   - Check site URL configuration
   - Verify email provider settings

### Support

For script issues:
- Check log output for detailed error messages
- Review related documentation
- Run with debug mode enabled
- Contact project maintainers