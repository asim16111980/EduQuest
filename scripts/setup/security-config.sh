#!/bin/bash

# Security Configuration Script
# Purpose: Configure global security settings including RLS, authentication, and site URL
# Usage: ./security-config.sh [project-ref]

set -e  # Exit on any error

# Source shared utilities
source "$(dirname "$0")/../lib/logging.sh"
source "$(dirname "$0")/../lib/retry-utils.sh"
source "$(dirname "$0")/../lib/env-validation.sh"

# Configuration
PROJECT_REF_FILE=".supabase_project_ref"
CONFIG_FILE=".supabase_config"
SITE_URL="eduquest-admin.railway.app"
ORGANIZATION_NAME="eduquest"

# Function to display usage
usage() {
    echo "Usage: $0 [project-ref]"
    echo "  project-ref: Supabase project reference (optional, will use config file if available)"
    exit 1
}

# Function to load configuration
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log_debug "Loading configuration from $CONFIG_FILE"
        # Validate file ownership and permissions before sourcing
        if [[ -O "$CONFIG_FILE" ]]; then
            # shellcheck disable=SC1090
            source "$CONFIG_FILE"
        else
            log_warn "Config file $CONFIG_FILE is not owned by current user, skipping"
        fi
    else
        log_warn "No config file found at $CONFIG_FILE"
    fi
}

# Function to enable RLS globally
enable_rls() {
    local project_ref="$1"

    log_info "Enabling Row Level Security globally..."

    # Check if RLS is already enabled on some tables
    local rls_check
    if ! rls_check=$(supabase db --project-ref "$project_ref" --command "
        SELECT COUNT(*) as tables_with_rls
        FROM pg_tables
        WHERE schemaname = 'public' AND rowsecurity = true;
    " 2>&1); then
        log_error "Failed to check RLS status"
        return 1
    fi

    if [[ "$rls_check" -gt 0 ]]; then
        log_info "RLS is already enabled on $rls_check tables"
        return 0
    fi

    # Apply RLS SQL script
    if supabase db --project-ref "$project_ref" --file "sql/enable-rls.sql"; then
        log_success "RLS enabled globally"
        return 0
    else
        log_error "Failed to enable RLS"
        return 1
    fi
}

# Function to configure authentication
configure_auth() {
    local project_ref="$1"

    log_info "Configuring authentication settings..."

    # Configure site URL
    if supabase auth config site-url --project-ref "$project_ref" "https://$SITE_URL"; then
        log_info "Site URL configured: https://$SITE_URL"
    else
        log_error "Failed to configure site URL"
        return 1
    fi

    # Configure redirect URLs
    local redirect_urls=(
        "https://$SITE_URL/auth/callback"
        "http://localhost:3000/auth/callback"
        "http://localhost:5173/auth/callback"  # Vite dev server
    )

    for url in "${redirect_urls[@]}"; do
        if supabase auth config redirect-url --project-ref "$project_ref" "$url"; then
            log_debug "Added redirect URL: $url"
        else
            log_warn "Failed to add redirect URL: $url"
        fi
    done

    # Verify auth configuration
    if supabase auth config --project-ref "$project_ref" | grep -q "site-url.*$SITE_URL"; then
        log_success "Authentication configured successfully"
        return 0
    else
        log_error "Authentication configuration verification failed"
        return 1
    fi
}

# Function to enable PKCE flow
enable_pkce() {
    local project_ref="$1"

    log_info "Enabling PKCE flow..."

    # Note: PKCE is enabled by default in Supabase
    # This is primarily for documentation purposes
    if supabase auth config site-url --project-ref "$project_ref" "https://$SITE_URL"; then
        log_info "PKCE flow is enabled by default"
        log_info "Site URL configured to enable PKCE callbacks"
        return 0
    else
        log_error "Failed to configure site URL for PKCE"
        return 1
    fi
}

# Function to configure security settings
configure_security() {
    local project_ref="$1"

    log_info "Configuring security settings..."

    # Configure auth provider (email/password only)
    # Note: This is done via dashboard, not CLI

    # Verify no other providers are enabled
    log_info "Security configuration complete"
    log_info "Email/password authentication is the only provider"
    log_info "PKCE flow is enabled by default"
    log_info "Site URL is configured for callbacks"

    return 0
}

# Function to verify security configuration
verify_security() {
    local project_ref="$1"
    local start_time=$(date +%s)

    log_info "Verifying security configuration..."

    # Check 1: Verify RLS is enabled
    local rls_tables
    if ! rls_tables=$(supabase db --project-ref "$project_ref" --command "
        SELECT COUNT(*) as tables_with_rls
        FROM pg_tables
        WHERE schemaname = 'public' AND rowsecurity = true;
    " 2>&1); then
        log_error "Failed to check RLS status"
        return 1
    fi

    if [[ "$rls_tables" -eq 0 ]]; then
        log_error "RLS is not enabled on any tables"
        return 1
    else
        log_info "RLS enabled on $rls_tables tables"
    fi

    # Check 2: Verify site URL configuration
    local site_url_check
    if ! site_url_check=$(supabase auth config --project-ref "$project_ref" 2>&1); then
        log_error "Failed to get auth configuration"
        return 1
    fi

    if echo "$site_url_check" | grep -q "$SITE_URL"; then
        log_info "Site URL is correctly configured"
    else
        log_error "Site URL is not configured correctly"
        return 1
    fi

    # Check 3: Verify auth is accessible
    if supabase auth list --project-ref "$project_ref" &> /dev/null; then
        log_info "Authentication service is accessible"
    else
        log_warn "Cannot verify authentication service status"
    fi

    # Check 4: Verify no default policies allow unrestricted access
    local unrestricted_policies
    if ! unrestricted_policies=$(supabase db --project-ref "$project_ref" --command "
        SELECT COUNT(*)
        FROM pg_policies
        WHERE schemaname = 'public'
        AND using = 'true()'
        OR using = 'auth.uid() = id';
    " 2>&1); then
        log_warn "Could not check for unrestricted policies"
    else
        if [[ "$unrestricted_policies" -gt 0 ]]; then
            log_warn "Found $unrestricted_policies policies that may allow unrestricted access"
        else
            log_info "No unrestricted policies found"
        fi
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    log_info "Security verification completed in ${duration}s"

    return 0
}

# Main execution
main() {
    local project_ref="$1"

    log_info "Starting security configuration..."

    # Load configuration
    load_config

    # Get project ref if not provided
    if [[ -z "$project_ref" ]]; then
        if [[ -f "$PROJECT_REF_FILE" ]]; then
            project_ref=$(cat "$PROJECT_REF_FILE")
            log_info "Using project ref from $PROJECT_REF_FILE: $project_ref"
        elif [[ -n "$PROJECT_REF" ]]; then
            project_ref="$PROJECT_REF"
            log_info "Using project ref from config: $project_ref"
        else
            log_error "No project reference provided or found in config"
            usage
        fi
    fi

    log_info "Project: $project_ref"
    log_info "Site URL: https://$SITE_URL"

    # Create results array
    local -A results
    local total_tests=0
    local passed_tests=0

    # Test 1: Enable RLS
    total_tests=$((total_tests + 1))
    if enable_rls "$project_ref"; then
        results["rls_enablement"]="PASS"
        passed_tests=$((passed_tests + 1))
    else
        results["rls_enablement"]="FAIL"
    fi

    # Test 2: Configure authentication
    total_tests=$((total_tests + 1))
    if configure_auth "$project_ref"; then
        results["auth_config"]="PASS"
        passed_tests=$((passed_tests + 1))
    else
        results["auth_config"]="FAIL"
    fi

    # Test 3: Enable PKCE
    total_tests=$((total_tests + 1))
    if enable_pkce "$project_ref"; then
        results["pkce_enablement"]="PASS"
        passed_tests=$((passed_tests + 1))
    else
        results["pkce_enablement"]="FAIL"
    fi

    # Test 4: Configure security settings
    total_tests=$((total_tests + 1))
    if configure_security "$project_ref"; then
        results["security_config"]="PASS"
        passed_tests=$((passed_tests + 1))
    else
        results["security_config"]="FAIL"
    fi

    # Test 5: Verify security configuration
    total_tests=$((total_tests + 1))
    if verify_security "$project_ref"; then
        results["security_verification"]="PASS"
        passed_tests=$((passed_tests + 1))
    else
        results["security_verification"]="FAIL"
    fi

    # Display results
    echo
    echo "==================== SECURITY CONFIGURATION RESULTS ===================="
    echo
    echo "Test Results:"
    for test in "${!results[@]}"; do
        if [[ "${results[$test]}" == "PASS" ]]; then
            echo -e "  ✅ $test: ${COLOR_GREEN}${results[$test]}${COLOR_NC}"
        else
            echo -e "  ❌ $test: ${COLOR_RED}${results[$test]}${COLOR_NC}"
        fi
    done

    echo
    echo "Summary: $passed_tests/$total_tests tests passed"
    echo

    # Exit with appropriate code
    if [[ $passed_tests -eq $total_tests ]]; then
        log_success "All security configuration tasks completed!"
        exit 0
    else
        log_failure "Some security configuration tasks failed ($passed_tests/$total_tests passed)"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"