# Quick Start: Database Bootstrap Phase 0A

**Date**: 2026-05-10  
**Target**: EduQuest Admin Dashboard Database Setup  
**Platform**: Railway + Supabase

## Prerequisites

1. **Railway Account**: Active Railway account with project created
2. **Supabase CLI**: Installed and authenticated (`supabase login`)
3. **Git Repository**: Clean working directory
4. **Environment**: Node.js 20+ for local development

## Setup Steps

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project details:
   - **Name**: eduquest-admin
   - **Database Password**: Generate strong password
   - **Region**: US (East)
   - **Organization**: Your organization
4. Wait for project creation (5-10 minutes)

### 2. Configure Authentication

1. In Supabase Dashboard → Settings → Authentication
2. Configure Site URL:
   - **Site URL**: `https://eduquest-admin.railway.app`
3. Under "Redirect URLs", add:
   - `https://eduquest-admin.railway.app/auth/callback`
4. Enable "Email provider"
5. Enable PKCE under "Configuration"

### 3. Enable Row Level Security

1. In Supabase Dashboard → Settings → Database
2. Run the following SQL in the SQL Editor to enable RLS on required tables:

```sql
-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT 
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relname IN ('users', 'activities', 'leaderboard_snapshots', 'activity_logs');
```

> Note: RLS will be configured with specific policies during schema migrations via the security-config.sh script.

### 4. Configure Realtime

1. In Supabase Dashboard → Settings → Realtime
2. Enable Realtime service
3. Add tables to Realtime:
   - `activity_logs`
   - `leaderboard_snapshots`

### 5. Set Up Environment Variables

#### Railway Dashboard Variables

Add these to your Railway project settings:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
# ⚠️ SERVER-ONLY KEY: DO NOT EXPOSE TO CLIENTS / NO LOGGING
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Local Development

Create `.env.local` in project root:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
# ⚠️ SERVER-ONLY KEY: DO NOT EXPOSE TO CLIENTS / NO LOGGING
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 6. Link Supabase CLI

```bash
# Link your local project to the remote
supabase link --project-ref YOUR_PROJECT_REF

# Verify connection
supabase status
```

### 7. Run Setup Scripts

```bash
# Execute setup scripts in order
./scripts/setup/supabase-project-setup.sh
./scripts/setup/security-config.sh
./scripts/setup/realtime-setup.sh
```

## Verification

### Complete Environment Validation

After completing the setup scripts, run the comprehensive environment validation:

```bash
# Validate environment variables and security configuration
./scripts/verify/verify-env.sh

# Expected output:
# ==================================================
#   EduQuest Environment Variable Verification
# ==================================================
# [✓] Environment file .env.local exists
# [✓] SUPABASE_URL is set: https://your-project-ref.supabase.co
# [✓] SUPABASE_ANON_KEY is set (first 20 chars): eyJhbGciOiJIUzI1NiIs...
# [✓] SUPABASE_SERVICE_ROLE_KEY is set (first 20 chars): eyJhbGciOiJIUzI1NiIs...
# [✓] Gitignore properly configured for secrets protection
# [✓] No sensitive files are staged for commit
# [✓] Railway production configuration is valid
# ✅ Environment validation PASSED
```

### Test Authentication Configuration

```bash
# Test authentication with the new test script
./scripts/test-auth.sh

# Expected output:
# ==================================================
#   EduQuest Authentication Configuration Test
# ==================================================
# [✓] Environment file .env.local exists
# [✓] SUPABASE_URL is set: https://your-project-ref.supabase.co
# [✓] SUPABASE_ANON_KEY is present
# [✓] SUPABASE_SERVICE_ROLE_KEY is present
# [✓] Environment variables protected in gitignore
# [✓] .env.local is untracked (good - not committed)
# [✓] Railway domain configured
# Authentication testing resources READY
```

### Check Project Connection

```bash
# Should show project details
supabase projects list
```

### Check Project Connection

```bash
# Should show project details
supabase projects list
```

### Test Authentication

```bash
# Use the new authentication test script
./scripts/test-auth.sh --no-cleanup

# This will:
# 1. Create a test user
# 2. Test authentication flow
# 3. Validate session management
# 4. Clean up the test user (unless --no-cleanup is used)
```

### Verify Environment Variables

```bash
# Check Railway environment variables (if deployed)
echo "SUPABASE_URL: ${SUPABASE_URL:0:20}..."
echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
echo "SUPABASE_SERVICE_ROLE_KEY: [REDACTED - Server Only]"
```

### Verify Realtime

1. Go to Supabase Dashboard → Realtime
2. Check that both tables are enabled
3. Verify channels are configured

### Run Final Validation

```bash
# Run comprehensive validation suite
./scripts/verify/verify-env.sh
./scripts/test-auth.sh

# Generate deployment checklist
cat docs/deployment-checklist.md | head -30
```

### Check Git Status (Security Check)

```bash
# Ensure no sensitive files are committed
git status --porcelain | grep -E "^\?\?.*\.env"
# Should show .env.local as untracked

# Check gitignore protection
grep "\.env" .gitignore
# Should show .env patterns
```

## Next Steps

### 1. Deployment Preparation

```bash
# Review deployment checklist
cat docs/deployment-checklist.md

# Test deployment script (if available)
# ./scripts/deploy.sh --dry-run
```

### 2. Documentation Review

```bash
# Review all documentation
ls docs/
# Should include:
# - railway-env-vars.md
# - deployment-checklist.md
# - troubleshooting.md (if created)
```

### 3. Environment Variables Setup

For production deployment, ensure these are set in Railway dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Final Verification Checklist

- [ ] All environment variables are properly configured
- [ ] Authentication test passes
- [ ] Realtime is working
- [ ] No sensitive data committed to git
- [ ] Deployment checklist is complete
- [ ] All documentation is up-to-date

## Troubleshooting

If any verification steps fail:

1. **Environment Issues**: Run `./scripts/verify/verify-env.sh` for detailed errors
2. **Authentication Issues**: Run `./scripts/test-auth.sh` for auth-specific errors
3. **Connection Issues**: Check `supabase status` and project linking
4. **Realtime Issues**: Verify table configuration in Supabase dashboard

### Environment Variables Check

```bash
# Check if variables are set (DO NOT print values)
[ -n "$SUPABASE_URL" ] && echo "SUPABASE_URL is set" || echo "SUPABASE_URL is not set"
[ -n "$SUPABASE_ANON_KEY" ] && echo "SUPABASE_ANON_KEY is set" || echo "SUPABASE_ANON_KEY is not set"
[ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "SUPABASE_SERVICE_ROLE_KEY is set" || echo "SUPABASE_SERVICE_ROLE_KEY is not set"
```

## Troubleshooting

### Common Issues

1. **CLI Link Fails**
   - Verify project reference is correct
   - Check CLI is authenticated
   - Ensure project is fully created

2. **RLS Not Working**
   - Verify RLS is enabled on table
   - Check policies exist
   - Test with service role key

3. **Realtime Not Connecting**
   - Verify table is in Realtime settings
   - Check CORS configuration
   - Ensure frontend is using correct URL

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Railway Documentation](https://docs.railway.app)
- Project: `001-db-bootstrap`

## Next Steps

1. Review `docs/supabase-connection.md` for detailed setup
2. Configure schema migrations in Phase 1
3. Set up CI/CD pipeline for automated deployments