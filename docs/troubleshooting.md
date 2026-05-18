# EduQuest Admin Dashboard Troubleshooting Guide

**Date**: 2026-05-10  
**Project**: EduQuest Admin Dashboard  
**Environment**: Railway + Supabase

## Overview

This troubleshooting guide provides solutions to common issues encountered during setup, configuration, and deployment of the EduQuest admin dashboard. Each issue includes symptoms, causes, and step-by-step solutions.

## Table of Contents

1. [Environment Issues](#environment-issues)
2. [Supabase Connection Issues](#supabase-connection-issues)
3. [Authentication Problems](#authentication-problems)
4. [Realtime Configuration Issues](#realtime-configuration-issues)
5. [Railway Deployment Issues](#railway-deployment-issues)
6. [Security Configuration Issues](#security-configuration-issues)
7. [Script Execution Issues](#script-execution-issues)
8. [Performance Issues](#performance-issues)
9. [Common Error Messages](#common-error-messages)

## Environment Issues

### Issue 1: Environment Variables Not Set

**Symptoms**:
- Error messages about undefined variables
- Scripts failing to run
- Connection errors

**Causes**:
- Missing `.env.local` file
- Incorrect variable names
- File not properly sourced

**Solutions**:

1. **Check if environment file exists**
   ```bash
   # File should exist
   ls -la .env.local
   
   # If missing, create from template
   cp .env.local.template .env.local
   ```

2. **Validate environment variables**
   ```bash
   # Run environment validation
   ./scripts/verify/verify-env.sh
   
   # Check specific variables
   echo "SUPABASE_URL: ${SUPABASE_URL:-[not set]}"
   echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:-[not set]}"
   echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:-[not set]}"
   ```

3. **Source environment file**
   ```bash
   # Load environment variables
   source .env.local
   
   # Or use specific file
   source path/to/your/env/file
   ```

**Prevention**:
- Always run `./scripts/verify/verify-env.sh` before running other scripts
- Use the template file as a reference
- Keep environment files in `.gitignore`

### Issue 2: Gitignore Not Protecting Secrets

**Symptoms**:
- Environment files are tracked by git
- Risk of committing sensitive data
- Git shows environment files as staged

**Causes**:
- Missing `.gitignore` entries
- Incorrect gitignore patterns
- File already committed

**Solutions**:

1. **Check gitignore configuration**
   ```bash
   # Check if environment patterns exist
   grep "\.env" .gitignore
   
   # Should show patterns like:
   # *.env
   # .env.local
   # .env.template
   ```

2. **Update gitignore if needed**
   ```bash
   # Add missing patterns
   echo "*.env" >> .gitignore
   echo ".env.local" >> .gitignore
   echo ".env.template" >> .gitignore
   echo ".supabase*" >> .gitignore
   echo ".railway*" >> .gitignore
   ```

3. **Remove already committed files**
   ```bash
   # Untrack files if already committed
   git rm --cached .env.local
   git rm --cached .env.template
   
   # Commit the gitignore changes
   git add .gitignore
   git commit -m "Add environment protection to gitignore"
   ```

4. **Verify protection**
   ```bash
   # Check git status
   git status --porcelain | grep -E "^\?\?.*\.env"
   # Should show .env.local as untracked
   ```

**Prevention**:
- Always run `./scripts/verify/verify-env.sh` before committing
- Check git status regularly for sensitive files
- Use the validation script's gitignore check

### Issue 3: Railway Domain Configuration Issues

**Symptoms**:
- Authentication redirects failing
- Site URL mismatches
- CORS errors

**Causes**:
- Incorrect site URL in Supabase
- Railway domain not properly configured
- SSL certificate issues

**Solutions**:

1. **Verify Railway domain**
   ```bash
   # Check Railway environment
   echo "RAILWAY_ENVIRONMENT: ${RAILWAY_ENVIRONMENT:-[not set]}"
   echo "SITE_URL: ${SITE_URL:-[not set]}"
   
   # Should show railway.app domain
   echo "$SITE_URL" | grep -q "railway\.app"
   ```

2. **Update Supabase site URL**
   - Go to Supabase Dashboard → Settings → Authentication
   - Set Site URL to: `https://eduquest-admin.railway.app`
   - Add redirect URL: `https://eduquest-admin.railway.app/auth/callback`

3. **Test SSL certificate**
   ```bash
   # Check SSL certificate
   curl -I https://eduquest-admin.railway.app
   
   # Look for: HTTP/2 200 OK
   # And: server: railway-app
   ```

**Prevention**:
- Always verify Railway domain matches Supabase configuration
- Use environment validation script to check domain configuration
- Test authentication after domain changes

## Supabase Connection Issues

### Issue 1: CLI Connection Fails

**Symptoms**:
- `supabase link` command fails
- `supabase status` shows errors
- Project not found

**Causes**:
- CLI not authenticated
- Wrong project reference
- Project not fully created

**Solutions**:

1. **Check CLI authentication**
   ```bash
   # Check authentication status
   supabase auth list
   
   # If not authenticated
   supabase login
   
   # Verify user
   supabase auth user
   ```

2. **Get correct project reference**
   ```bash
   # List projects
   supabase projects list
   
   # Find your project and copy the reference
   # Format: your-project-ref
   ```

3. **Link to project**
   ```bash
   # Link with correct reference
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Verify connection
   supabase status
   ```

4. **Wait for project creation**
   ```bash
   # Check project status
   supabase projects list
   
   # Should show: active, creating, or suspended
   # If creating, wait 5-10 minutes
   ```

**Prevention**:
- Always run `./scripts/verify/project-connection.sh` before other operations
- Keep project reference handy
- Monitor project creation status

### Issue 2: Database Connection Issues

**Symptoms**:
- Cannot connect to database
- Connection timeouts
- Authentication errors

**Causes**:
- Wrong connection strings
- Database not initialized
- Network issues

**Solutions**:

1. **Check connection strings**
   ```bash
   # Verify environment variables
   echo "SUPABASE_URL: $SUPABASE_URL"
   echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
   
   # Test URL accessibility
   curl -I $SUPABASE_URL
   ```

2. **Test database connection**
   ```bash
   # Use Supabase CLI to test
   supabase db ping
   
   # Or test with Node.js
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
   supabase.from('information_schema.tables').select('count').limit(1)
     .then(({ data, error }) => {
       if (error) console.error('Connection failed:', error);
       else console.log('Connection successful');
     });
   "
   ```

3. **Check database initialization**
   ```bash
   # Check if database is ready
   supabase db reset
   
   # Or check specific tables
   supabase db reset --schema public
   ```

**Prevention**:
- Always test connection after configuration changes
- Use the project connection verification script
- Monitor database status in Supabase dashboard

### Issue 3: Schema Migration Issues

**Symptoms**:
- Tables missing
- Schema not applied
- Migration errors

**Causes**:
- Migrations not run
- Wrong migration order
- Syntax errors in SQL

**Solutions**:

1. **Check migration status**
   ```bash
   # List migrations
   supabase migration list
   
   # Check applied migrations
   supabase db diff
   ```

2. **Run migrations**
   ```bash
   # Apply migrations
   supabase db push
   
   # Reset if needed (caution: this drops data)
   supabase db reset
   ```

3. **Validate SQL syntax**
   ```bash
   # Check SQL files for syntax errors
   psql -f migration_file.sql
   
   # Or use Supabase SQL editor
   # Run individual statements to test
   ```

**Prevention**:
- Test migrations in development first
- Use version control for SQL files
- Run migrations in sequence

## Authentication Problems

### Issue 1: Authentication Failing

**Symptoms**:
- Sign-up/sign-in errors
- Redirect loops
- Session issues

**Causes**:
- Wrong site URL
- PKCE not enabled
- Email provider not configured

**Solutions**:

1. **Check authentication configuration**
   ```bash
   # Run authentication test
   ./scripts/test-auth.sh
   
   # Check Supabase settings
   supabase auth settings list
   ```

2. **Verify site URL**
   ```bash
   # Check site URL configuration
   echo "SITE_URL: $SITE_URL"
   echo "Should be: https://eduquest-admin.railway.app"
   
   # Test redirect URL
   curl -I "$SITE_URL/auth/callback"
   ```

3. **Enable PKCE flow**
   ```bash
   # Check PKCE configuration
   supabase auth settings list
   
   # Enable PKCE if not enabled
   # Go to Supabase Dashboard → Settings → Authentication
   # Enable PKCE under Configuration
   ```

4. **Test email provider**
   ```bash
   # Check email provider status
   supabase auth providers list
   
   # Should show email provider as enabled
   ```

**Prevention**:
- Always run authentication tests after configuration changes
- Use the authentication test script regularly
- Verify site URL matches production domain

### Issue 2: User Creation Issues

**Symptoms**:
- Cannot create users
- Email validation errors
- Password requirements not met

**Causes**:
- Invalid email format
- Password too weak
- Email provider not working

**Solutions**:

1. **Test user creation manually**
   ```bash
   # Use Supabase CLI to create user
   supabase auth signup --email=test@example.com --password=test123456
   
   # Or use the test script
   ./scripts/test-auth.sh --no-cleanup
   ```

2. **Check email format**
   ```bash
   # Validate email format
   echo "test@example.com" | grep -E "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
   
   # Should return success
   ```

3. **Check password requirements**
   ```bash
   # Supabase requires:
   # - At least 6 characters
   # - No common passwords
   # - Proper character mix
   ```

4. **Test email delivery**
   ```bash
   # Check if emails are being sent
   # Look in Supabase Dashboard → Authentication → Emails
   # Check email logs for delivery issues
   ```

**Prevention**:
- Use the test script to verify user creation
- Check email provider settings
- Monitor email delivery logs

### Issue 3: Session Management Issues

**Symptoms**:
- Sessions not persisting
- Logout not working
- Session validation failing

**Causes**:
- Session timeout too short
- JWT issues
- Storage problems

**Solutions**:

1. **Check session configuration**
   ```bash
   # Check session settings
   supabase auth settings list
   
   # Look at session timeout and JWT settings
   ```

2. **Test session management**
   ```bash
   # Use test script to test sessions
   ./scripts/test-auth.sh
   
   # The script tests session creation and validation
   ```

3. **Clear session storage**
   ```bash
   # Clear browser cookies
   # Clear localStorage/sessionStorage
   # Test with fresh session
   ```

**Prevention**:
- Configure appropriate session timeouts
- Use the authentication test script regularly
- Monitor session activity logs

## Realtime Configuration Issues

### Issue 1: Realtime Not Working

**Symptoms**:
- No real-time updates
- Subscription errors
- Connection issues

**Causes**:
- Realtime service not enabled
- Tables not configured
- Permission issues

**Solutions**:

1. **Check Realtime service status**
   ```bash
   # Check if Realtime is enabled
   supabase realtime list
   
   # Should show enabled status
   ```

2. **Verify table configuration**
   ```bash
   # Check which tables are enabled
   # Go to Supabase Dashboard → Settings → Realtime
   # Should show: activity_logs, leaderboard_snapshots
   
   # Run Realtime verification
   ./scripts/verify/verify-realtime.sh
   ```

3. **Test Realtime subscription**
   ```bash
   # Test with simple subscription
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
   
   const subscription = supabase
     .channel('test-channel')
     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, payload => {
       console.log('Change received:', payload);
     })
     .subscribe();
     
   console.log('Subscription active');
   "
   ```

**Prevention**:
- Always run Realtime verification after configuration
- Test subscriptions in development
- Monitor Realtime activity logs

### Issue 2: Permission Issues

**Symptoms**:
- Realtime subscription errors
- Access denied messages
- Authentication failures

**Causes**:
- RLS policies blocking access
- Channel permissions not set
- User authentication issues

**Solutions**:

1. **Check RLS policies**
   ```bash
   # Check RLS status on tables
   supabase sql \""
   SELECT 
     tablename,
     rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public'
     AND tablename IN ('activity_logs', 'leaderboard_snapshots');
   \""
   
   # Should show rowsecurity = true
   ```

2. **Verify channel permissions**
   ```bash
   # Check channel configuration
   # Go to Supabase Dashboard → Realtime → Channels
   # Should show proper permissions
   ```

3. **Test authentication**
   ```bash
   # Run authentication tests
   ./scripts/test-auth.sh
   
   # Ensure user is properly authenticated
   ```

**Prevention**:
- Always test Realtime with authenticated users
- Verify RLS policies allow necessary operations
- Use proper authentication tokens

## Railway Deployment Issues

### Issue 1: Deployment Failing

**Symptoms**:
- Railway build fails
- Application not running
- Environment variables missing

**Causes**:
- Build errors
- Missing dependencies
- Wrong configuration

**Solutions**:

1. **Check Railway build logs**
   ```bash
   # View build logs
   railway logs
   
   # Or check Railway dashboard
   # Look for specific error messages
   ```

2. **Test build locally**
   ```bash
   # Test build process
   npm run build
   
   # Check for errors
   npm test
   ```

3. **Verify environment variables**
   ```bash
   # Check Railway variables
   railway variables list
   
   # Should show all required variables:
   # SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   ```

**Prevention**:
- Test build locally before deploying
- Check Railway configuration
- Monitor build logs

### Issue 2: Environment Variables Not Available

**Symptoms**:
- "undefined variable" errors
- Missing configuration
- Application crashes at startup

**Causes**:
- Variables not set in Railway
- Wrong variable names
- Scope issues

**Solutions**:

1. **Check Railway variables**
   ```bash
   # List Railway variables
   railway variables list
   
   # Verify all required variables are present
   railway variables get SUPABASE_URL
   railway variables get SUPABASE_ANON_KEY
   railway variables get SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Add missing variables**
   ```bash
   # Add missing variables to Railway
   railway variables set SUPABASE_URL "https://your-project-ref.supabase.co"
   railway variables set SUPABASE_ANON_KEY "your-anon-key"
   railway variables set SUPABASE_SERVICE_ROLE_KEY "your-service-key"
   ```

3. **Check variable scope**
   ```bash
   # Ensure variables are set to "Production" scope
   # Not "Deploy" or "Build" scope
   ```

**Prevention**:
- Always verify variables before deployment
- Use the environment validation script
- Check variable scopes

### Issue 3: Domain Issues

**Symptoms**:
- Wrong domain
- SSL certificate errors
- Redirect issues

**Causes**:
- Domain not configured
- SSL certificate expired
- DNS propagation issues

**Solutions**:

1. **Check domain configuration**
   ```bash
   # Verify Railway domain
   echo "Current domain: $(railway domain list)"
   
   # Should show: eduquest-admin.railway.app
   ```

2. **Test SSL certificate**
   ```bash
   # Check certificate status
   curl -I https://eduquest-admin.railway.app
   
   # Look for: HTTP/2 200 OK
   # And proper certificate chain
   ```

3. **Clear DNS cache**
   ```bash
   # Flush DNS cache
   ipconfig /flushdns
   
   # Or wait for DNS propagation
   ```

**Prevention**:
- Always verify domain configuration
- Monitor SSL certificate status
- Test domain before deployment

## Security Configuration Issues

### Issue 1: RLS Not Working

**Symptoms**:
- Access denied errors
- Queries failing
- Security policies not enforced

**Causes**:
- RLS not enabled
- Wrong policies
- Permission issues

**Solutions**:

1. **Check RLS status**
   ```bash
   # Verify RLS is enabled on tables
   ./scripts/verify/security-verification.sh
   
   # Check specific tables
   supabase sql \""
   SELECT 
     tablename,
     rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public'
     AND tablename IN ('activity_logs', 'leaderboard_snapshots');
   \""
   ```

2. **Enable RLS if needed**
   ```bash
   # Enable RLS on specific tables
   supabase sql \""
   ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
   \""
   ```

3. **Create basic policies**
   ```bash
   # Create basic policies for testing
   supabase sql \""
   CREATE POLICY "Enable read access for authenticated users"
   ON activity_logs
   FOR SELECT USING (auth.uid() IS NOT NULL);
   
   CREATE POLICY "Enable read access for authenticated users"
   ON leaderboard_snapshots
   FOR SELECT USING (auth.uid() IS NOT NULL);
   \""
   ```

**Prevention**:
- Always run security verification script
- Test RLS policies with different users
- Monitor access logs

### Issue 2: Authentication Security Issues

**Symptoms**:
- Unauthorized access
- Authentication bypass
- Security warnings

**Causes**:
- PKCE not enabled
- Weak authentication settings
- Insecure configurations

**Solutions**:

1. **Check authentication settings**
   ```bash
   # Run authentication test with security focus
   ./scripts/test-auth.sh
   
   # Check PKCE configuration
   supabase auth settings list
   ```

2. **Enable PKCE**
   ```bash
   # Enable PKCE in Supabase dashboard
   # Go to Settings → Authentication → Configuration
   # Enable PKCE flow
   ```

3. **Strengthen authentication**
   ```bash
   # Add additional security measures
   # Enable email confirmations
   # Set password requirements
   # Configure session timeouts
   ```

**Prevention**:
- Always test authentication security
- Use PKCE flow
- Monitor authentication logs

### Issue 3: Data Exposure Issues

**Symptoms**:
- Sensitive data visible
- Unauthorized data access
- Security breaches

**Causes**:
- Wrong RLS policies
- Insecure queries
- Misconfigurations

**Solutions**:

1. **Review RLS policies**
   ```bash
   # Check all policies
   supabase sql \""
   SELECT 
     tablename,
     policyname,
     permissive,
     roles,
     cmd,
     qual
   FROM pg_policies 
   WHERE schemaname = 'public'
     AND tablename IN ('activity_logs', 'leaderboard_snapshots');
   \""
   ```

2. **Test data access**
   ```bash
   # Test with different users
   # Use service role key for admin access
   # Use anon key for regular access
   ```

3. **Audit queries**
   ```bash
   # Check query logs
   # Monitor for suspicious activity
   # Review access patterns
   ```

**Prevention**:
- Regular security audits
- Proper RLS policy design
- Access monitoring

## Script Execution Issues

### Issue 1: Script Permission Errors

**Symptoms**:
- Permission denied errors
- Scripts not executable
- File access issues

**Causes**:
- Wrong file permissions
- Missing execute permissions
- Ownership issues

**Solutions**:

1. **Check file permissions**
   ```bash
   # Check script permissions
   ls -la scripts/
   
   # Should show: -rwxr-xr-x for executable scripts
   ```

2. **Set execute permissions**
   ```bash
   # Make scripts executable
   chmod +x scripts/*.sh
   
   # Or on Windows
   icacls scripts\*.sh /grant Everyone:RX
   ```

3. **Check ownership**
   ```bash
   # Check file ownership
   ls -la scripts/
   
   # Should show current user as owner
   ```

**Prevention**:
- Always check permissions before running scripts
- Use proper file permissions
- Test scripts in safe environment

### Issue 2: Script Dependencies Missing

**Symptoms**:
- Command not found errors
- Missing libraries
- Import errors

**Causes**:
- Missing dependencies
- Wrong paths
- Version conflicts

**Solutions**:

1. **Check dependencies**
   ```bash
   # Check required commands
   which supabase
   which node
   which npm
   
   # Should return paths to installed commands
   ```

2. **Install missing dependencies**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Install Node.js dependencies
   npm install
   
   # Install global dependencies
   npm install -g @supabase/supabase-js
   ```

3. **Check paths**
   ```bash
   # Verify PATH includes required directories
   echo $PATH | grep -E "(npm|node|supabase)"
   
   # Add to PATH if needed
   export PATH=$PATH:/path/to/bin
   ```

**Prevention**:
- Always check dependencies before running scripts
- Use dependency managers
- Test scripts in clean environment

### Issue 3: Script Execution Errors

**Symptoms**:
- Script crashes
- Unexpected behavior
- Error messages

**Causes**:
- Syntax errors
- Logic errors
- Environment issues

**Solutions**:

1. **Enable debug mode**
   ```bash
   # Enable debug logging
   export DEBUG=true
   
   # Run script with debug output
   ./scripts/verify/verify-env.sh
   ```

2. **Check script syntax**
   ```bash
   # Check bash syntax
   bash -n scripts/verify/verify-env.sh
   
   # Should return no output if syntax is correct
   ```

3. **Test individual functions**
   ```bash
   # Test specific functions
   source scripts/lib/logging.sh
   source scripts/lib/env-validation.sh
   
   log_info "Test message"
   validate_required
   ```

**Prevention**:
- Always test scripts in development
- Use debug mode for troubleshooting
- Review script logs regularly

## Performance Issues

### Issue 1: Slow Database Queries

**Symptoms**:
- Slow response times
- Query timeouts
- Performance degradation

**Causes**:
- Missing indexes
- Complex queries
- Database optimization issues

**Solutions**:

1. **Check query performance**
   ```bash
   # Enable query logging
   supabase sql \""
   SET log_statement = 'all';
   \""
   
   # Monitor slow queries
   supabase sql \""
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   \""
   ```

2. **Add indexes**
   ```bash
   # Add indexes for frequently queried columns
   supabase sql \""
   CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
   CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
   CREATE INDEX idx_leaderboard_snapshots_created_at ON leaderboard_snapshots(created_at);
   \""
   ```

3. **Optimize queries**
   ```bash
   # Use efficient query patterns
   # Avoid SELECT *
   # Use proper JOINs
   # Add WHERE clauses for filtering
   ```

**Prevention**:
- Monitor query performance regularly
- Use proper indexing
- Optimize query patterns

### Issue 2: Realtime Performance Issues

**Symptoms**:
- Slow updates
- Connection delays
- High latency

**Causes**:
- Too many subscriptions
- Large data payloads
- Network issues

**Solutions**:

1. **Monitor Realtime performance**
   ```bash
   # Check Realtime metrics
   supabase realtime stats
   
   # Monitor connection counts
   supabase realtime list
   ```

2. **Optimize subscriptions**
   ```bash
   # Use efficient subscription patterns
   # Filter data at source
   # Use debouncing for frequent updates
   # Cache when possible
   ```

3. **Test network performance**
   ```bash
   # Check connection speed
   ping eduquest-admin.railway.app
   
   # Test WebSocket connection
   curl -I https://YOUR_PROJECT_REF.supabase.co/realtime/v1
   ```

**Prevention**:
- Monitor Realtime metrics
- Optimize subscription patterns
- Test network performance regularly

## Common Error Messages

### Environment Validation Errors

**Error**: `Environment validation failed - missing or invalid required variables`

**Solution**:
```bash
# Check required variables
echo "SUPABASE_URL: ${SUPABASE_URL:-[missing]}"
echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:-[missing]}"
echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:-[missing]}"

# Update .env.local with correct values
```

**Prevention**:
- Always run environment validation first
- Use template file as reference
- Verify variable formats

### Authentication Errors

**Error**: `Authentication failed - invalid credentials`

**Solution**:
```bash
# Check authentication configuration
./scripts/test-auth.sh

# Verify site URL
echo "SITE_URL: $SITE_URL"
echo "Should be: https://eduquest-admin.railway.app"
```

**Prevention**:
- Run authentication tests regularly
- Verify site URL configuration
- Check email provider settings

### Connection Errors

**Error**: `Cannot connect to Supabase project`

**Solution**:
```bash
# Check project connection
./scripts/verify/project-connection.sh

# Verify CLI authentication
supabase auth list

# Check project status
supabase projects list
```

**Prevention**:
- Always verify connection before operations
- Use connection verification script
- Monitor project status

### Realtime Errors

**Error**: `Realtime subscription failed`

**Solution**:
```bash
# Check Realtime configuration
./scripts/verify/verify-realtime.sh

# Verify table configuration
# Supabase Dashboard → Settings → Realtime
```

**Prevention**:
- Run Realtime verification after setup
- Test subscriptions with test data
- Monitor Realtime activity

## Support and Additional Help

### Getting Help

1. **Check Documentation**
   - Review this troubleshooting guide
   - Check setup documentation
   - Review script references

2. **Run Diagnostic Scripts**
   ```bash
   # Comprehensive diagnostic
   ./scripts/verify/phase2-verification.sh
   
   # Environment diagnostic
   ./scripts/verify/verify-env.sh
   
   # Authentication diagnostic
   ./scripts/test-auth.sh
   ```

3. **Check Logs**
   ```bash
   # Check script logs
   tail -f logs/setup.log
   
   # Check Railway logs
   railway logs
   
   # Check Supabase logs
   # Supabase Dashboard → Settings → Database → Logs
   ```

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share solutions
- **Supabase Community**: Get help from Supabase experts
- **Railway Community**: Get help from Railway experts

### Professional Support

For critical issues:
- Contact project maintainers
- Consider professional support
- Engage with official support channels

## Contributing to This Guide

We welcome contributions to improve this troubleshooting guide:

1. **Report Issues**: Found a new issue? Report it via GitHub issues
2. **Solutions**: Have a solution? Submit a pull request
3. **Improvements**: Suggestions for improvement? Open a discussion

### Format for New Issues

When reporting new issues, please include:

- **Symptoms**: What error messages or behaviors are observed
- **Environment**: OS, tools versions, configuration
- **Steps to Reproduce**: How to reproduce the issue
- **Expected vs Actual**: What should happen vs what happens
- **Solutions**: Any solutions that work partially or completely

## Conclusion

This troubleshooting guide should help resolve most common issues encountered during the setup and operation of the EduQuest admin dashboard. Remember to:

1. **Start with the basics** - Check environment and connections first
2. **Use the right tools** - Leverage the provided scripts and utilities
3. **Test thoroughly** - Always verify changes before deploying
4. **Monitor regularly** - Keep an eye on logs and performance
5. **Document findings** - Share solutions with the community

For additional help, refer to the documentation or reach out to the community.