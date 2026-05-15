# EduQuest Admin Dashboard Setup Guide

**Date**: 2026-05-10  
**Project**: EduQuest Admin Dashboard  
**Environment**: Railway + Supabase
**Version**: 1.0

## Overview

This comprehensive setup guide provides step-by-step instructions for setting up the EduQuest admin dashboard infrastructure. The guide covers project creation, security configuration, Realtime setup, and deployment preparation.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Project Setup](#phase-1-project-setup)
3. [Phase 2: Foundational Configuration](#phase-2-foundational-configuration)
4. [Phase 3: Security Configuration](#phase-3-security-configuration)
5. [Phase 4: Realtime Setup](#phase-4-realtime-setup)
6. [Phase 5: Environment Configuration](#phase-5-environment-configuration)
7. [Phase 6: Verification & Testing](#phase-6-verification--testing)
8. [Phase 7: Deployment](#phase-7-deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts
- **Railway Account**: Active Railway account with project created
- **Supabase Account**: Active Supabase account
- **Git Repository**: Clean working directory

### Required Tools
- **Supabase CLI**: Installed and authenticated (`supabase login`)
- **Git**: Version control system
- **Node.js**: v18+ for development
- **Railway CLI**: For deployment (optional)

### Required Files
- `.env.local` with environment variables
- `.env.local.template` as reference
- `.gitignore` for secrets protection

## Phase 1: Project Setup

### 1.1 Create Railway Project

1. **Railway Dashboard Setup**
   ```bash
   # Create new Railway project
   railway init
   # Select appropriate template and configure
   ```

2. **Configure Railway Domain**
   - Set domain to: `eduquest-admin.railway.app`
   - Configure build and start commands
   - Set environment variables (see Phase 5)

### 1.2 Initialize Git Repository

```bash
# Initialize git repo
git init

# Add .gitignore
git add .gitignore
git commit -m "Initial commit: Add gitignore configuration"

# Link to remote repository
git remote add origin <your-repo-url>
git branch -M 001-db-bootstrap
git push -u origin 001-db-bootstrap
```

## Phase 2: Foundational Configuration

### 2.1 Environment Setup

1. **Create Environment Files**
   ```bash
   # Copy template to actual environment file
   cp .env.local.template .env.local
   
   # Edit .env.local with actual values
   # Get values from Supabase Dashboard -> Settings -> API
   ```

2. **Verify Environment Configuration**
   ```bash
   # Run environment validation
   ./scripts/verify/verify-env.sh
   
   # Expected: All checks pass
   ```

### 2.2 Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Supabase CLI (if not already installed)
npm install -g supabase
```

## Phase 3: Security Configuration

### 3.1 Supabase Project Creation

1. **Create Supabase Project**
   ```bash
   # Use Supabase dashboard or CLI
   # Dashboard: https://app.supabase.com -> New Project
   # CLI: supabase new --name eduquest-admin
   ```

2. **Configure Project Settings**
   - **Project Name**: eduquest-admin
   - **Region**: US East
   - **Database Password**: Generate strong password
   - **Organization**: Your organization

### 3.2 Authentication Configuration

1. **Site URL Configuration**
   - **Site URL**: `https://eduquest-admin.railway.app`
   - **Redirect URL**: `https://eduquest-admin.railway.app/auth/callback`

2. **Email Provider Setup**
   - Enable Email provider
   - Enable PKCE flow
   - Disable signups (admin-only access)

### 3.3 Run Security Setup Script

```bash
# Execute security configuration
./scripts/setup/security-config.sh

# This will:
# - Enable RLS globally
# - Create basic policies
# - Configure authentication
# - Set up security verification
```

## Phase 4: Realtime Setup

### 4.1 Enable Realtime Service

1. **Supabase Dashboard Configuration**
   - Go to Settings → Realtime
   - Enable Realtime service
   - Configure tables for broadcasting

### 4.2 Configure Realtime Tables

```bash
# Execute Realtime setup script
./scripts/setup/realtime-setup.sh

# This configures:
# - activity_logs table for Realtime
# - leaderboard_snapshots table for Realtime
# - Proper permissions and channels
```

### 4.3 Verify Realtime Configuration

```bash
# Check Realtime status
supabase realtime list

# Verify tables are configured
# Dashboard: Settings → Realtime → Tables
```

## Phase 5: Environment Configuration

### 5.1 Railway Environment Variables

Add these variables to Railway Dashboard → Variables:

```env
# Required Variables
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional Variables
SITE_URL=https://eduquest-admin.railway.app
AUTH_CALLBACK_URL=https://eduquest-admin.railway.app/auth/callback
```

### 5.2 Local Development Setup

1. **Update .env.local**
   ```bash
   # Edit .env.local with actual values
   # Ensure no secrets are committed
   ```

2. **Test Local Connection**
   ```bash
   # Test environment validation
   ./scripts/verify/verify-env.sh
   
   # Test authentication
   ./scripts/test-auth.sh
   ```

## Phase 6: Verification & Testing

### 6.1 Environment Validation

```bash
# Comprehensive environment validation
./scripts/verify/verify-env.sh

# Check:
# - All required variables present
# - Proper format validation
# - Gitignore protection
# - Railway domain configuration
```

### 6.2 Authentication Testing

```bash
# Test authentication flow
./scripts/test-auth.sh

# This tests:
# - User creation
# - Authentication
# - Session management
# - PKCE flow
```

### 6.3 Connection Verification

```bash
# Test CLI connection
supabase link --project-ref YOUR_PROJECT_REF
supabase status

# Test API connection
./scripts/verify/project-connection.sh
```

### 6.4 Security Verification

```bash
# Check security configuration
./scripts/verify/security-verification.sh

# Verify:
# - RLS is enabled
# - Policies are created
# - Authentication is working
```

### 6.5 Run Complete Verification Suite

```bash
# Run all verification scripts
./scripts/verify/verify-env.sh
./scripts/verify/project-connection.sh
./scripts/verify/security-verification.sh
./scripts/test-auth.sh
```

## Phase 7: Deployment

### 7.1 Pre-Deployment Checklist

Complete the deployment checklist:
```bash
# Review deployment checklist
cat docs/deployment-checklist.md

# Use checklist to verify all requirements
```

### 7.2 Deployment Script (Optional)

If using the deployment script:
```bash
# Run deployment script
./scripts/deploy.sh --dry-run  # Test deployment
./scripts/deploy.sh           # Actual deployment
```

### 7.3 Post-Deployment Verification

1. **Access Application**
   - Visit: `https://eduquest-admin.railway.app`
   - Verify all functionality works

2. **Test Production Environment**
   ```bash
   # Test with production variables
   ./scripts/test-auth.sh
   
   # Verify Realtime works
   # Test authentication flow
   ```

3. **Monitor Deployment**
   - Check Railway dashboard for errors
   - Monitor application logs
   - Verify database connections

## Verification Commands

### Quick Verification

```bash
# Quick status check
echo "=== Environment Status ==="
./scripts/verify/verify-env.sh

echo "=== Authentication Status ==="  
./scripts/test-auth.sh

echo "=== Project Connection ==="
supabase status

echo "=== Realtime Status ==="
supabase realtime list
```

### Detailed Verification

```bash
# Comprehensive verification suite
./scripts/verify/phase2-verification.sh

# This runs all verification steps in order
# and provides detailed reporting
```

## Troubleshooting

See [Troubleshooting Guide](./troubleshooting.md) for detailed solutions to common issues.

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **Railway Documentation**: https://docs.railway.app
- **Project Issues**: GitHub Issues
- **Contact**: Project maintainers

## Related Documentation

- [Quick Start Guide](../specs/001-db-bootstrap/quickstart.md)
- [Railway Environment Variables](./railway-env-vars.md)
- [Deployment Checklist](./deployment-checklist.md)
- [Project Setup Reference](./project-setup.md)
- [Troubleshooting Guide](./troubleshooting.md)