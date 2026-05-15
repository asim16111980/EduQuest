#!/bin/bash

# Deployment Automation Script for EduQuest Admin Dashboard
# Purpose: Automates the deployment process to Railway with comprehensive validation
# Usage: ./deploy.sh [options]

set -e  # Exit on any error

# Source shared utilities with enhanced error handling
source "$(dirname "$0")/../lib/logging.sh"
source "$(dirname "$0")/../lib/retry-utils.sh"
source "$(dirname "$0")/../lib/env-validation.sh"
source "$(dirname "$0")/../lib/error-handling.sh"

# Configuration
DRY_RUN=${DRY_RUN:-false}
ENVIRONMENT=${ENVIRONMENT:-production}
DEPLOYMENT_TIMEOUT=${DEPLOYMENT_TIMEOUT:-600}  # 10 minutes
LOG_FILE=${LOG_FILE:-/tmp/eduquest-deployment-$(date +%Y%m%d_%H%M%S).log}
BACKUP_ENABLED=${BACKUP_ENABLED:-true}
FORCE_DEPLOY=${FORCE_DEPLOY:-false}
SKIP_VALIDATION=${SKIP_VALIDATION:-false}

# Initialize enhanced error handling for this script
ERROR_HANDLING_ENABLED=true
ERROR_TRACE_ENABLED=true
init_error_handling

# Function to display usage
usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Deployment Automation Script for EduQuest Admin Dashboard"
    echo ""
    echo "Options:"
    echo "  --dry-run              Perform dry run without actual deployment"
    echo "  --environment ENV      Target environment (default: production)"
    echo "  --force               Force deployment even if validation fails"
    echo "  --skip-validation      Skip pre-deployment validation"
    echo "  --timeout SECONDS      Deployment timeout in seconds (default: 600)"
    echo "  --no-backup           Disable backup before deployment"
    echo "  --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy to production"
    echo "  $0 --dry-run          # Test deployment without executing"
    echo "  $0 --environment staging  # Deploy to staging environment"
    echo "  $0 --force            # Force deployment despite validation issues"
    echo ""
    echo "This script performs the following steps:"
    echo "  1. Pre-deployment validation"
    echo "  2. Environment backup (optional)"
    echo "  3. Railway deployment"
    echo "  4. Post-deployment verification"
    echo "  5. Health check and monitoring"
    exit 1
}

# Function to validate deployment prerequisites
validate_deployment_prerequisites() {
    log_step "Validating deployment prerequisites"
    
    # Check if Railway CLI is installed
    if ! command -v railway > /dev/null 2>&1; then
        log_error "Railway CLI is not installed"
        echo -e "${COLOR_BLUE}SUGGESTION: Install Railway CLI: https://docs.railway.app/reference/cli${COLOR_NC}" >&2
        return 1
    fi
    
    # Check if Supabase CLI is installed
    if ! command -v supabase > /dev/null 2>&1; then
        log_error "Supabase CLI is not installed"
        echo -e "${COLOR_BLUE}SUGGESTION: Install Supabase CLI: https://supabase.com/docs/cli${COLOR_NC}" >&2
        return 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node > /dev/null 2>&1; then
        log_error "Node.js is not installed"
        echo -e "${COLOR_BLUE}SUGGESTION: Install Node.js: https://nodejs.org/${COLOR_NC}" >&2
        return 1
    fi
    
    # Check if required environment variables are set
    local required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
    if ! validate_environment "${required_vars[@]}"; then
        log_error "Missing required environment variables"
        return 1
    fi
    
    log_success "All deployment prerequisites validated"
    return 0
}

# Function to perform pre-deployment validation
pre_deployment_validation() {
    log_step "Performing pre-deployment validation"
    
    # Validate environment variables
    log_info "Validating environment configuration"
    if ! ./scripts/verify/verify-env.sh; then
        log_error "Environment validation failed"
        return 1
    fi
    
    # Test authentication configuration
    log_info "Testing authentication configuration"
    if ! ./scripts/test-auth.sh --no-cleanup; then
        log_error "Authentication test failed"
        return 1
    fi
    
    # Verify project connection
    log_info "Verifying project connection"
    if ! ./scripts/verify/project-connection.sh; then
        log_error "Project connection verification failed"
        return 1
    fi
    
    # Verify security configuration
    log_info "Verifying security configuration"
    if ! ./scripts/verify/security-verification.sh; then
        log_error "Security verification failed"
        return 1
    fi
    
    # Verify Realtime configuration
    log_info "Verifying Realtime configuration"
    if ! ./scripts/verify/verify-realtime.sh; then
        log_error "Realtime verification failed"
        return 1
    fi
    
    log_success "Pre-deployment validation completed"
    return 0
}

# Function to backup current environment
backup_environment() {
    if [[ "$BACKUP_ENABLED" != "true" ]]; then
        log_info "Backup disabled, skipping"
        return 0
    fi
    
    log_step "Backing up current environment"
    
    local backup_dir="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    log_info "Creating backup in: $backup_dir"
    
    # Backup environment variables
    if [[ -f ".env.local" ]]; then
        cp ".env.local" "$backup_dir/"
        log_info "Backed up .env.local"
    fi
    
    # Backup configuration files
    if [[ -d "docs" ]]; then
        cp -r "docs" "$backup_dir/"
        log_info "Backed up documentation"
    fi
    
    # Backup Railway variables
    railway variables list > "$backup_dir/railway-variables.txt" 2>/dev/null || true
    log_info "Backed up Railway variables"
    
    # Backup project status
    supabase projects list > "$backup_dir/project-status.txt" 2>/dev/null || true
    log_info "Backed up project status"
    
    log_success "Environment backup completed: $backup_dir"
    return 0
}

# Function to validate Railway configuration
validate_railway_configuration() {
    log_step "Validating Railway configuration"
    
    # Check Railway project status
    log_info "Checking Railway project status"
    railway status 2>/dev/null || {
        log_error "Railway project not found or not configured"
        echo -e "${COLOR_BLUE}SUGGESTION: Run 'railway login' and 'railway init' first${COLOR_NC}" >&2
        return 1
    }
    
    # Check Railway environment
    log_info "Checking Railway environment"
    railway environment list 2>/dev/null || {
        log_error "Railway environment not found"
        return 1
    }
    
    # Check required Railway variables
    log_info "Checking Railway environment variables"
    local railway_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
    for var in "${railway_vars[@]}"; do
        railway variables get "$var" > /dev/null 2>&1 || {
            log_error "Railway variable $var is not set"
            echo -e "${COLOR_BLUE}SUGGESTION: Set railway variables set $var <value>${COLOR_NC}" >&2
            return 1
        }
    done
    
    log_success "Railway configuration validated"
    return 0
}

# Function to perform deployment
perform_deployment() {
    log_step "Performing deployment to $ENVIRONMENT"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "DRY RUN: Skipping actual deployment"
        log_info "Would run: railway deploy --environment $ENVIRONMENT"
        return 0
    fi
    
    log_info "Starting deployment to $ENVIRONMENT environment..."
    
    # Set Railway environment if specified
    if [[ "$ENVIRONMENT" != "production" ]]; then
        railway environment select "$ENVIRONMENT" 2>/dev/null || {
            log_warn "Environment $ENVIRONMENT not found, using default"
        }
    fi
    
    # Perform deployment with timeout
    local deployment_pid=$$
    
    # Start deployment in background
    railway deploy --environment "$ENVIRONMENT" > "$LOG_FILE" 2>&1 &
    local deploy_pid=$!
    
    # Monitor deployment progress
    local elapsed=0
    while [[ $elapsed -lt $DEPLOYMENT_TIMEOUT ]]; do
        if ! kill -0 $deploy_pid 2>/dev/null; then
            # Process has finished
            local exit_code=$?
            if [[ $exit_code -eq 0 ]]; then
                log_success "Deployment completed successfully"
                return 0
            else
                log_error "Deployment failed with exit code $exit_code"
                return $exit_code
            fi
        fi
        
        sleep 5
        elapsed=$((elapsed + 5))
        log_info "Deployment in progress... ($elapsed/${DEPLOYMENT_TIMEOUT}s)"
    done
    
    # Timeout reached
    log_error "Deployment timeout after $DEPLOYMENT_TIMEOUT seconds"
    kill $deploy_pid 2>/dev/null || true
    return 1
}

# Function to perform post-deployment verification
post_deployment_verification() {
    log_step "Performing post-deployment verification"
    
    # Wait for deployment to stabilize
    log_info "Waiting for deployment to stabilize..."
    sleep 30
    
    # Test application accessibility
    log_info "Testing application accessibility"
    local app_url="https://eduquest-admin.railway.app"
    if curl -s -o /dev/null -w "%{http_code}" "$app_url" | grep -q "200\|301\|302"; then
        log_success "Application is accessible at: $app_url"
    else
        log_error "Application is not accessible"
        return 1
    fi
    
    # Test environment variables in production
    log_info "Testing environment variables in production"
    railway variables list | grep -E "SUPABASE_URL|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY" || {
        log_error "Environment variables not available in production"
        return 1
    }
    
    # Test Supabase connection
    log_info "Testing Supabase connection"
    if supabase status > /dev/null 2>&1; then
        log_success "Supabase connection is working"
    else
        log_error "Supabase connection failed"
        return 1
    fi
    
    # Test authentication in production
    log_info "Testing authentication in production"
    # Note: This would require production environment setup
    log_info "Authentication test skipped (requires production setup)"
    
    log_success "Post-deployment verification completed"
    return 0
}

# Function to monitor deployment health
monitor_deployment_health() {
    log_step "Monitoring deployment health"
    
    local health_checks=0
    local max_health_checks=3
    
    for ((i=1; i<=max_health_checks; i++)); do
        log_info "Health check $i/$max_health_checks"
        
        # Check Railway service health
        railway health 2>/dev/null || {
            log_warn "Health check failed"
        }
        
        # Check application response time
        local app_url="https://eduquest-admin.railway.app"
        local response_time=$(curl -o /dev/null -s -w '%{time_total}' "$app_url" 2>/dev/null || echo "0")
        
        if [[ "$response_time" != "0" ]]; then
            log_info "Application response time: ${response_time}s"
            
            if (( $(echo "$response_time < 5" | bc -l) )); then
                log_success "Application response time is acceptable"
            else
                log_warn "Application response time is slow: ${response_time}s"
            fi
        fi
        
        sleep 10
    done
    
    log_success "Health monitoring completed"
    return 0
}

# Function to generate deployment report
generate_deployment_report() {
    local report_file="./deployment-report-$(date +%Y%m%d_%H%M%S).txt"
    
    log_info "Generating deployment report: $report_file"
    
    cat > "$report_file" << EOF
EduQuest Admin Dashboard Deployment Report
==========================================

Generated: $(date)
Environment: $ENVIRONMENT
Deployment ID: $(uuidgen 2>/dev/null || echo "unknown")
Deployment Type: $([[ "$DRY_RUN" == "true" ]] && echo "DRY RUN" || echo "LIVE")

=== Deployment Summary ===
- Pre-deployment validation: $([[ -f ".deployment-success" ]] && echo "PASSED" || echo "FAILED")
- Environment backup: $([[ "$BACKUP_ENABLED" == "true" ]] && echo "COMPLETED" || echo "SKIPPED")
- Railway deployment: $([[ -f ".deployment-success" ]] && echo "SUCCESS" || echo "FAILED")
- Post-deployment verification: $([[ -f ".deployment-success" ]] && echo "PASSED" || echo "FAILED")
- Health monitoring: $([[ -f ".deployment-success" ]] && echo "COMPLETED" || echo "FAILED")

=== Environment Variables ===
SUPABASE_URL: ${SUPABASE_URL:0:20}...
SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}...
SUPABASE_SERVICE_ROLE_KEY: [REDACTED]

=== Deployment Logs ===
$(tail -50 "$LOG_FILE" 2>/dev/null || echo "No logs available")

=== Next Steps ===
1. Access the application at: https://eduquest-admin.railway.app
2. Verify all functionality is working
3. Monitor application logs
4. Check Railway dashboard for any issues

=== Contact Support ===
- Project maintainers: GitHub issues
- Railway support: https://docs.railway.app/support
- Supabase support: https://supabase.com/docs/support

EOF
    
    log_success "Deployment report generated: $report_file"
    cat "$report_file"
}

# Function to handle deployment failure
handle_deployment_failure() {
    local exit_code=$1
    local error_message=$2
    
    log_error "Deployment failed with exit code: $exit_code"
    log_error "Error: $error_message"
    
    # Generate failure report
    local failure_report="./deployment-failure-$(date +%Y%m%d_%H%M%S).txt"
    cat > "$failure_report" << EOF
EduQuest Admin Dashboard Deployment Failure Report
=================================================

Generated: $(date)
Exit Code: $exit_code
Error: $error_message

=== Failure Analysis ===
- Environment: $ENVIRONMENT
- Deployment Type: $([[ "$DRY_RUN" == "true" ]] && echo "DRY RUN" || echo "LIVE")
- Force Deployment: $([[ "$FORCE_DEPLOY" == "true" ]] && echo "YES" || echo "NO")

=== Recent Logs ===
$(tail -20 "$LOG_FILE" 2>/dev/null || echo "No logs available")

=== Troubleshooting Steps ===
1. Check deployment logs: $LOG_FILE
2. Verify Railway configuration: railway status
3. Check environment variables: railway variables list
4. Review troubleshooting guide: docs/troubleshooting.md
5. Contact support if issue persists

=== Rollback Instructions ===
# To rollback to previous version:
1. railway deploy --rollback
2. Or restore from backup: $(ls -d ./backups/* 2>/dev/null | tail -1 || echo "No backups available")

EOF
    
    log_error "Failure report generated: $failure_report"
    
    # Show error suggestions
    echo -e "${COLOR_BLUE}RECOVERY OPTIONS:${COLOR_NC}" >&2
    echo -e "${COLOR_BLUE}1. Check logs: tail -f $LOG_FILE${COLOR_NC}" >&2
    echo -e "${COLOR_BLUE}2. Railway status: railway status${COLOR_NC}" >&2
    echo -e "${COLOR_BLUE}3. Rollback: railway deploy --rollback${COLOR_NC}" >&2
    echo -e "${COLOR_BLUE}4. Restore backup: rsync -av $(ls -d ./backups/* 2>/dev/null | tail -1 || echo "/backup/path") ./${COLOR_NC}" >&2
    
    return $exit_code
}

# Main deployment function
main() {
    log_info "Starting EduQuest Admin Dashboard deployment"
    log_info "Environment: $ENVIRONMENT"
    log_info "Dry Run: $DRY_RUN"
    log_info "Force Deploy: $FORCE_DEPLOY"
    log_info "Timeout: $DEPLOYMENT_TIMEOUT seconds"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --force)
                FORCE_DEPLOY=true
                shift
                ;;
            --skip-validation)
                SKIP_VALIDATION=true
                shift
                ;;
            --timeout)
                DEPLOYMENT_TIMEOUT="$2"
                shift 2
                ;;
            --no-backup)
                BACKUP_ENABLED=false
                shift
                ;;
            --help)
                usage
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                ;;
        esac
    done
    
    # Display header
    echo "=================================================="
    echo "  EduQuest Admin Dashboard Deployment"
    echo "=================================================="
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Dry Run: $([[ "$DRY_RUN" == "true" ]] && echo "YES" || echo "NO")"
    echo "Force Deploy: $([[ "$FORCE_DEPLOY" == "true" ]] && echo "YES" || echo "NO")"
    echo "Timeout: $DEPLOYMENT_TIMEOUT seconds"
    echo ""
    
    # Initialize deployment tracking
    touch ".deployment-started"
    
    # Execute deployment steps with error handling
    local deployment_steps=(
        "validate_deployment_prerequisites"
        "validate_railway_configuration"
        "$([[ "$SKIP_VALIDATION" != "true" ]] && echo "pre_deployment_validation")"
        "backup_environment"
        "perform_deployment"
        "post_deployment_verification"
        "monitor_deployment_health"
    )
    
    for step in "${deployment_steps[@]}"; do
        if [[ -n "$step" ]]; then
            if ! $step; then
                handle_deployment_failure $? "Step '$step' failed"
                exit 1
            fi
        fi
    done
    
    # Mark deployment as successful
    touch ".deployment-success"
    
    # Generate final report
    generate_deployment_report
    
    echo ""
    echo "=================================================="
    echo "  Deployment completed successfully!"
    echo "=================================================="
    echo ""
    echo "🎉 Deployment Summary:"
    echo "   - Environment: $ENVIRONMENT"
    echo "   - Status: SUCCESS"
    echo "   - Application URL: https://eduquest-admin.railway.app"
    echo "   - Report: ./deployment-report-$(date +%Y%m%d_%H%M%S).txt"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Access the application at https://eduquest-admin.railway.app"
    echo "   2. Verify all functionality is working"
    echo "   3. Monitor application logs"
    echo "   4. Check Railway dashboard for any issues"
    echo ""
    echo "📚 Documentation:"
    echo "   - Setup Guide: docs/setup-guide.md"
    echo "   - Troubleshooting: docs/troubleshooting.md"
    echo "   - Deployment Checklist: docs/deployment-checklist.md"
    echo ""
    
    # Cleanup temporary files
    rm -f ".deployment-started" ".deployment-success"
    
    exit 0
}

# Run main function with all arguments
main "$@"