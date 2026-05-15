#!/bin/bash

# Enhanced Error Handling Library
# Usage: source error-handling.sh

# Error handling configuration
ERROR_HANDLING_ENABLED=${ERROR_HANDLING_ENABLED:-true}
ERROR_REPORTING_FILE=${ERROR_REPORTING_FILE:-/tmp/eduquest-errors.log}
ERROR_TRACE_ENABLED=${ERROR_TRACE_ENABLED:-true}
ERROR_MAX_RETRIES=${ERROR_MAX_RETRIES:-3}
ERROR_BACKOFF_DELAY=${ERROR_BACKOFF_DELAY:-2}

# Initialize error handling
init_error_handling() {
    if [[ "$ERROR_HANDLING_ENABLED" == "true" ]]; then
        mkdir -p "$(dirname "$ERROR_REPORTING_FILE")"
        
        # Create error log header
        if [[ ! -s "$ERROR_REPORTING_FILE" ]]; then
            echo "=== EduQuest Error Handling Log - $(date) ===" > "$ERROR_REPORTING_FILE"
        fi
        
        # Set error trap
        trap 'handle_error $? "$BASH_COMMAND" "$BASH_SOURCE:$LINENO"' ERR
        trap 'handle_interrupt' INT
        trap 'handle_exit' EXIT
        
        log_debug "Error handling initialized"
    fi
}

# Handle errors with enhanced reporting
handle_error() {
    local exit_code=$1
    local command=$2
    local location=$3
    
    if [[ "$ERROR_HANDLING_ENABLED" != "true" ]]; then
        return $exit_code
    fi
    
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local error_message="ERROR: Exit code $exit_code at $location"
    local command_info="Command: $command"
    
    # Log to error file
    echo "[$timestamp] $error_message" >> "$ERROR_REPORTING_FILE"
    echo "[$timestamp] $command_info" >> "$ERROR_REPORTING_FILE"
    
    # Add stack trace if enabled
    if [[ "$ERROR_TRACE_ENABLED" == "true" ]]; then
        echo "[$timestamp] Stack Trace:" >> "$ERROR_REPORTING_FILE"
        local frame=0
        while caller $frame; do
            local caller_info=$(caller $frame)
            echo "[$timestamp]  Frame $frame: $caller_info" >> "$ERROR_REPORTING_FILE"
            ((frame++))
        done
        echo "[$timestamp]" >> "$ERROR_REPORTING_FILE"
    fi
    
    # Log to console with color
    echo -e "${COLOR_RED}[${timestamp}] ${error_message}${COLOR_NC}" >&2
    echo -e "${COLOR_YELLOW}[${timestamp}] ${command_info}${COLOR_NC}" >&2
    
    # Provide context-aware suggestions
    provide_error_suggestions "$exit_code" "$command" "$location"
    
    # Return the original exit code
    return $exit_code
}

# Handle interrupt signals
handle_interrupt() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local message="INTERRUPT: Script interrupted by user"
    
    echo "[$timestamp] $message" >> "$ERROR_REPORTING_FILE"
    echo -e "${COLOR_YELLOW}[${timestamp}] $message${COLOR_NC}" >&2
    
    # Clean up interrupt-specific resources
    cleanup_interrupt_resources
    
    exit 130
}

# Handle normal exit
handle_exit() {
    local exit_code=$?
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    # Only log if it was an error exit
    if [[ $exit_code -ne 0 ]]; then
        local message="EXIT: Script exited with error code $exit_code"
        echo "[$timestamp] $message" >> "$ERROR_REPORTING_FILE"
    fi
    
    # Clean up resources
    cleanup_resources
}

# Provide error-specific suggestions
provide_error_suggestions() {
    local exit_code=$1
    local command=$2
    local location=$3
    
    case $exit_code in
        127)
            echo -e "${COLOR_BLUE}SUGGESTION: Command not found. Check if the required tool is installed and in PATH.${COLOR_NC}" >&2
            ;;
        126)
            echo -e "${COLOR_BLUE}SUGGESTION: Permission denied. Check file permissions and execute access.${COLOR_NC}" >&2
            ;;
        1)
            echo -e "${COLOR_BLUE}SUGGESTION: General error. Check command syntax and required arguments.${COLOR_NC}" >&2
            ;;
        2)
            echo -e "${COLOR_BLUE}SUGGESTION: Misuse of shell builtins. Check command usage.${COLOR_NC}" >&2
            ;;
        3)
            echo -e "${COLOR_BLUE}SUGGESTION: No such file or directory. Verify file paths and existence.${COLOR_NC}" >&2
            ;;
        *)
            echo -e "${COLOR_BLUE}SUGGESTION: Error code $exit_code. Check command documentation and logs.${COLOR_NC}" >&2
            ;;
    esac
    
    # Provide script-specific suggestions
    case "$location" in
        *verify-env.sh*)
            echo -e "${COLOR_BLUE}SUGGESTION: Run './scripts/verify/verify-env.sh' for environment validation.${COLOR_NC}" >&2
            ;;
        *test-auth.sh*)
            echo -e "${COLOR_BLUE}SUGGESTION: Check environment variables and Supabase configuration.${COLOR_NC}" >&2
            ;;
        *project-connection.sh*)
            echo -e "${COLOR_BLUE}SUGGESTION: Verify Supabase CLI authentication and project reference.${COLOR_NC}" >&2
            ;;
        *security-verification.sh*)
            echo -e "${COLOR_BLUE}SUGGESTION: Check RLS policies and authentication settings.${COLOR_NC}" >&2
            ;;
        *realtime-setup.sh*)
            echo -e "${COLOR_BLUE}SUGGESTION: Verify Realtime service is enabled in Supabase dashboard.${COLOR_NC}" >&2
            ;;
    esac
}

# Safe execution with error handling
safe_execute() {
    local description="$1"
    local max_retries="${2:-$ERROR_MAX_RETRIES}"
    local backoff_delay="${3:-$ERROR_BACKOFF_DELAY}"
    shift 3
    
    local attempt=1
    local delay=$backoff_delay
    
    log_info "Starting: $description"
    log_debug "Max retries: $max_retries, Backoff delay: ${backoff_delay}s"
    
    while [[ $attempt -le $max_retries ]]; do
        if "$@"; then
            log_info "Success: $description (attempt $attempt/$max_retries)"
            return 0
        else
            local exit_code=$?
            log_error "Failed: $description (attempt $attempt/$max_retries, exit code: $exit_code)"
            
            if [[ $attempt -eq $max_retries ]]; then
                log_error "Max retries reached for: $description"
                return $exit_code
            fi
            
            log_debug "Waiting ${delay}s before retry..."
            sleep $delay
            delay=$((delay * 2))  # Exponential backoff
            attempt=$((attempt + 1))
        fi
    done
    
    log_error "Should not reach here: $description"
    return 1
}

# Command validation before execution
validate_command() {
    local command="$1"
    local description="$2"
    
    # Check if command exists
    if ! command -v "$command" >/dev/null 2>&1; then
        log_error "Command '$command' not found"
        echo -e "${COLOR_BLUE}SUGGESTION: Install required tool: $command${COLOR_NC}" >&2
        return 127
    fi
    
    # Check if command is executable
    if [[ ! -x "$(command -v "$command")" ]]; then
        log_error "Command '$command' is not executable"
        echo -e "${COLOR_BLUE}SUGGESTION: Check file permissions for $(command -v "$command")${COLOR_NC}" >&2
        return 126
    fi
    
    log_debug "Command '$command' validation passed"
    return 0
}

# File validation before operations
validate_file() {
    local file="$1"
    local operation="$2"  # read, write, execute
    
    case "$operation" in
        "read")
            if [[ ! -f "$file" ]]; then
                log_error "File '$file' does not exist"
                echo -e "${COLOR_BLUE}SUGGESTION: Create file '$file' or check path.${COLOR_NC}" >&2
                return 1
            fi
            if [[ ! -r "$file" ]]; then
                log_error "File '$file' is not readable"
                echo -e "${COLOR_BLUE}SUGGESTION: Check read permissions for '$file'.${COLOR_NC}" >&2
                return 1
            fi
            ;;
        "write")
            if [[ ! -f "$file" ]]; then
                log_warn "File '$file' does not exist, will be created"
            fi
            local dir=$(dirname "$file")
            if [[ ! -w "$dir" ]]; then
                log_error "Directory '$dir' is not writable"
                echo -e "${COLOR_BLUE}SUGGESTION: Check write permissions for '$dir'.${COLOR_NC}" >&2
                return 1
            fi
            ;;
        "execute")
            if [[ ! -f "$file" ]]; then
                log_error "File '$file' does not exist"
                echo -e "${COLOR_BLUE}SUGGESTION: Create file '$file' or check path.${COLOR_NC}" >&2
                return 1
            fi
            if [[ ! -x "$file" ]]; then
                log_error "File '$file' is not executable"
                echo -e "${COLOR_BLUE}SUGGESTION: Run: chmod +x '$file'${COLOR_NC}" >&2
                return 1
            fi
            ;;
        *)
            log_error "Unknown operation: $operation"
            return 1
            ;;
    esac
    
    log_debug "File '$file' validation passed for $operation"
    return 0
}

# Environment validation
validate_environment() {
    local required_vars=("$@")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        return 1
    fi
    
    return 0
}

# Cleanup resources
cleanup_resources() {
    log_debug "Cleaning up resources"
    
    # Remove temporary files
    local temp_files=()
    for file in "${temp_files[@]}"; do
        if [[ -f "$file" ]]; then
            rm -f "$file"
            log_debug "Removed temporary file: $file"
        fi
    done
    
    # Close any open connections
    # Add specific cleanup here as needed
    
    log_debug "Resource cleanup completed"
}

# Cleanup interrupt-specific resources
cleanup_interrupt_resources() {
    log_debug "Cleaning up interrupt-specific resources"
    
    # Kill any background processes
    local pids=$(jobs -p)
    if [[ -n "$pids" ]]; then
        log_info "Cleaning up background processes"
        kill $pids 2>/dev/null || true
    fi
    
    # Remove temporary files that might be left
    local interrupt_temp_files=()
    for file in "${interrupt_temp_files[@]}"; do
        if [[ -f "$file" ]]; then
            rm -f "$file"
            log_debug "Removed interrupt temp file: $file"
        fi
    done
}

# Error recovery functions
recover_from_error() {
    local error_type="$1"
    local error_context="$2"
    
    log_info "Attempting recovery from $error_type error"
    
    case "$error_type" in
        "network")
            # Network recovery logic
            log_info "Attempting network recovery..."
            sleep 5
            ;;
        "database")
            # Database recovery logic
            log_info "Attempting database recovery..."
            # Reset database connection
            ;;
        "authentication")
            # Authentication recovery logic
            log_info "Attempting authentication recovery..."
            # Re-authenticate
            ;;
        *)
            log_warn "No specific recovery for $error_type"
            ;;
    esac
}

# Error reporting and analysis
analyze_errors() {
    local analysis_file="/tmp/error-analysis-$(date +%Y%m%d_%H%M%S).txt"
    
    log_info "Analyzing error logs..."
    
    if [[ ! -s "$ERROR_REPORTING_FILE" ]]; then
        log_info "No error logs to analyze"
        return 0
    fi
    
    # Count errors by type
    echo "=== Error Analysis Report ===" > "$analysis_file"
    echo "Generated: $(date)" >> "$analysis_file"
    echo "" >> "$analysis_file"
    
    # Count total errors
    local total_errors=$(grep -c "ERROR:" "$ERROR_REPORTING_FILE" || echo 0)
    echo "Total Errors: $total_errors" >> "$analysis_file"
    
    # Count errors by location
    echo "" >> "$analysis_file"
    echo "Errors by Location:" >> "$analysis_file"
    grep "ERROR:" "$ERROR_REPORTING_FILE" | grep -oE "at .*:" | sort | uniq -c | sort -nr >> "$analysis_file"
    
    # Count errors by command
    echo "" >> "$analysis_file"
    echo "Errors by Command:" >> "$analysis_file"
    grep "Command:" "$ERROR_REPORTING_FILE" | sort | uniq -c | sort -nr >> "$analysis_file"
    
    # Recent errors
    echo "" >> "$analysis_file"
    echo "Recent Errors (last 10):" >> "$analysis_file"
    tail -n 50 "$ERROR_REPORTING_FILE" | grep "ERROR:" | tail -n 10 >> "$analysis_file"
    
    log_info "Error analysis complete: $analysis_file"
    cat "$analysis_file"
}

# Initialize error handling when sourced
init_error_handling