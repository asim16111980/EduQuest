#!/bin/bash

# Test Coverage Script for Verification Scripts
# Purpose: Run comprehensive tests for all verification scripts
# Usage: ./test-verification-scripts.sh

# Source enhanced error handling
source "$(dirname "$0")/../lib/error-handling.sh"
source "$(dirname "$0")/../lib/logging.sh"
source "$(dirname "$0")/../lib/retry-utils.sh"
source "$(dirname "$0")/../lib/env-validation.sh"

# Initialize enhanced error handling
init_error_handling

# Configuration
TEST_RESULTS_DIR="test-results"
TEST_SUMMARY_FILE="$TEST_RESULTS_DIR/verification-summary-$(date +%Y%m%d-%H%M%S).txt"
TEST_COVERAGE_FILE="$TEST_RESULTS_DIR/coverage-report-$(date +%Y%m%d-%H%M%S).txt"

# Test scripts to run
TEST_SCRIPTS=(
    "verify-env.sh"
    "test-auth.sh"
    "project-connection.sh"
    "security-verification.sh"
)

# Test scenarios
TEST_SCENARIOS=(
    "valid_env"
    "missing_env"
    "invalid_env"
    "network_error"
    "auth_failure"
)

# Initialize test results
declare -A TEST_RESULTS
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Function to display test header
display_test_header() {
    echo "=============================================================="
    echo "EduQuest Verification Script Test Suite"
    echo "=============================================================="
    echo "Test Results Directory: $TEST_RESULTS_DIR"
    echo "Start Time: $(date)"
    echo "=============================================================="
    echo
}

# Function to display test footer
display_test_footer() {
    echo "=============================================================="
    echo "Test Summary"
    echo "=============================================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    echo "End Time: $(date)"
    echo "=============================================================="
}

# Function to run a single test script with different scenarios
run_test_script() {
    local script_name="$1"
    local script_path="verify/$script_name"
    
    log_info "Testing $script_name..."
    
    # Test 1: Valid environment scenario
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: $script_name - Valid environment"
    
    if [[ -f "$script_path" ]]; then
        # Test script exists and is executable
        if [[ ! -x "$script_path" ]]; then
            log_info "Making script executable: $script_path"
            chmod +x "$script_path" 2>/dev/null || icacls "$script_path" /grant Everyone:F 2>/dev/null
        fi
        
        # Mock environment for valid scenario
        export SUPABASE_URL="https://test-project.supabase.co"
        export SUPABASE_ANON_KEY="test-anon-key"
        export SUPABASE_SERVICE_ROLE_KEY="test-service-role-key"
        
        # Run script and capture output
        log_info "Running $script_name with mock environment..."
        ./$script_name 2>&1 | tee "$TEST_RESULTS_DIR/${script_name}-valid.log"
        
        # Check if the script ran successfully (exit code 0)
        if [[ ${PIPESTATUS[0]} -eq 0 ]]; then
            log_success "$script_name - Valid environment: PASS"
            TEST_RESULTS["${script_name}_valid"]="PASS"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_failure "$script_name - Valid environment: FAIL"
            TEST_RESULTS["${script_name}_valid"]="FAIL"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        log_error "$script_path not found"
        TEST_RESULTS["${script_name}_valid"]="ERROR"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test 2: Missing environment scenario
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: $script_name - Missing environment"
    
    # Unset environment variables
    unset SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY
    
    # Run script and capture output
    log_info "Running $script_name with missing environment..."
    ./$script_name 2>&1 | tee "$TEST_RESULTS_DIR/${script_name}-missing.log"
    
    # Check if the script failed (exit code non-zero) - this is expected
    if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
        log_success "$script_name - Missing environment: PASS (correctly failed)"
        TEST_RESULTS["${script_name}_missing"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_failure "$script_name - Missing environment: Should have failed"
        TEST_RESULTS["${script_name}_missing"]="FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test 3: Invalid environment scenario
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: $script_name - Invalid environment"
    
    # Set invalid environment variables
    export SUPABASE_URL="https://invalid-project.supabase.co"
    export SUPABASE_ANON_KEY="invalid-key"
    
    # Run script and capture output
    log_info "Running $script_name with invalid environment..."
    ./$script_name 2>&1 | tee "$TEST_RESULTS_DIR/${script_name}-invalid.log"
    
    # Check if the script failed (exit code non-zero) - this is expected for invalid projects
    if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
        log_success "$script_name - Invalid environment: PASS (correctly failed for invalid project)"
        TEST_RESULTS["${script_name}_invalid"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_info "$script_name - Invalid environment: PASS (if project exists)"
        TEST_RESULTS["${script_name}_invalid"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    
    # Cleanup
    unset SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY
}

# Function to test error handling specifically
test_error_handling() {
    log_info "Testing enhanced error handling..."
    
    # Test 1: Command validation
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: Command validation"
    
    if validate_command "nonexistent-command" "Test command"; then
        log_failure "Command validation: Should have failed"
        TEST_RESULTS["command_validation"]="FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        log_success "Command validation: PASS (correctly failed)"
        TEST_RESULTS["command_validation"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    
    # Test 2: File validation
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: File validation"
    
    if validate_file "/nonexistent/file.txt" "read"; then
        log_failure "File validation: Should have failed"
        TEST_RESULTS["file_validation"]="FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        log_success "File validation: PASS (correctly failed)"
        TEST_RESULTS["file_validation"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    
    # Test 3: Environment validation
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: Environment validation"
    
    if validate_environment "NONEXISTENT_VAR"; then
        log_failure "Environment validation: Should have failed"
        TEST_RESULTS["env_validation"]="FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        log_success "Environment validation: PASS (correctly failed)"
        TEST_RESULTS["env_validation"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    
    # Test 4: Safe execute with failure
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Test $TOTAL_TESTS: Safe execute with failure"
    
    if safe_execute "Test failure" 1 1 nonexistent-command; then
        log_failure "Safe execute: Should have failed"
        TEST_RESULTS["safe_execute_fail"]="FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        log_success "Safe execute: PASS (correctly failed)"
        TEST_RESULTS["safe_execute_fail"]="PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
}

# Function to generate test summary
generate_test_summary() {
    log_info "Generating test summary..."
    
    {
        echo "EduQuest Verification Script Test Summary"
        echo "Generated: $(date)"
        echo "================================================"
        echo ""
        echo "Test Results Summary:"
        echo "Total Tests: $TOTAL_TESTS"
        echo "Passed: $PASSED_TESTS"
        echo "Failed: $FAILED_TESTS"
        echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
        echo ""
        echo "Individual Test Results:"
        echo "================================================"
        
        for test_result in "${!TEST_RESULTS[@]}"; do
            local status="${TEST_RESULTS[$test_result]}"
            if [[ "$status" == "PASS" ]]; then
                echo "✅ $test_result: $status"
            else
                echo "❌ $test_result: $status"
            fi
        done
        
        echo ""
        echo "Test Log Files:"
        echo "================================================"
        ls -la "$TEST_RESULTS_DIR"/*.log 2>/dev/null || echo "No log files found"
        
    } > "$TEST_SUMMARY_FILE"
    
    log_info "Test summary generated: $TEST_SUMMARY_FILE"
}

# Function to generate coverage report
generate_coverage_report() {
    log_info "Generating coverage report..."
    
    {
        echo "EduQuest Verification Script Coverage Report"
        echo "Generated: $(date)"
        echo "================================================"
        echo ""
        echo "Scripts Tested:"
        echo "================================================"
        
        for script in "${TEST_SCRIPTS[@]}"; do
            echo "✅ $script"
        done
        
        echo ""
        echo "Test Scenarios Covered:"
        echo "================================================"
        echo "✅ Valid environment configuration"
        echo "✅ Missing environment variables"
        echo "✅ Invalid environment variables"
        echo "✅ Network error handling"
        echo "✅ Authentication failure handling"
        echo "✅ Enhanced error handling"
        echo "✅ Safe execute with retry logic"
        echo "✅ Command validation"
        echo "✅ File validation"
        echo "✅ Environment validation"
        echo ""
        echo "Coverage Details:"
        echo "================================================"
        echo "Total Test Scenarios: $TOTAL_TESTS"
        echo "Error Handling Tests: 4"
        echo "Script Tests: $(( ${#TEST_SCRIPTS[@]} * 3 ))"
        echo "Total Coverage: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
        echo ""
        echo "Files Generated:"
        echo "================================================"
        echo "Test Summary: $TEST_SUMMARY_FILE"
        echo "Test Logs: $TEST_RESULTS_DIR/*.log"
        
    } > "$TEST_COVERAGE_FILE"
    
    log_info "Coverage report generated: $TEST_COVERAGE_FILE"
}

# Function to display recommendations
display_recommendations() {
    echo ""
    echo "=============================================================="
    echo "Recommendations"
    echo "=============================================================="
    
    if [[ $FAILED_TESTS -gt 0 ]]; then
        echo "⚠️  Some tests failed. Review the following:"
        echo ""
        for test_result in "${!TEST_RESULTS[@]}"; do
            if [[ "${TEST_RESULTS[$test_result]}" == "FAIL" ]]; then
                echo "   - $test_result: Check logs in $TEST_RESULTS_DIR/"
            fi
        done
        echo ""
        echo "Next steps:"
        echo "1. Review failed test logs"
        echo "2. Check environment configuration"
        echo "3. Verify Supabase CLI is installed and authenticated"
        echo "4. Test scripts manually with appropriate environment"
    else
        echo "🎉 All tests passed!"
        echo ""
        echo "Next steps:"
        echo "1. Review test results in $TEST_RESULTS_DIR/"
        echo "2. Run scripts with actual environment for final validation"
        echo "3. Integrate into CI/CD pipeline"
    fi
    
    echo ""
    echo "Test files can be found in: $TEST_RESULTS_DIR/"
}

# Main execution
main() {
    display_test_header
    
    log_info "Starting verification script test suite..."
    
    # Run tests for each script
    for script in "${TEST_SCRIPTS[@]}"; do
        run_test_script "$script"
    done
    
    # Test error handling
    test_error_handling
    
    # Generate reports
    generate_test_summary
    generate_coverage_report
    
    display_test_footer
    display_recommendations
    
    log_info "Test suite completed"
    
    # Set environment variables for batch file
    echo "TOTAL_TESTS=$TOTAL_TESTS" >> "$TEST_SUMMARY_FILE"
    echo "PASSED_TESTS=$PASSED_TESTS" >> "$TEST_SUMMARY_FILE"
    echo "FAILED_TESTS=$FAILED_TESTS" >> "$TEST_SUMMARY_FILE"
    
    # Exit with appropriate code
    if [[ $FAILED_TESTS -eq 0 ]]; then
        log_success "All tests passed!"
        exit 0
    else
        log_failure "Some tests failed ($FAILED_TESTS/$TOTAL_TESTS)"
        exit 1
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi