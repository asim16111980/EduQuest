#!/bin/bash

# Logging infrastructure for setup operations
# Usage: source logging.sh

# Log levels
LOG_LEVEL=${LOG_LEVEL:-INFO}  # DEBUG, INFO, WARN, ERROR
LOG_FILE=${LOG_FILE:-/tmp/eduquest-setup.log}
TIMESTAMP_FORMAT="%Y-%m-%d %H:%M:%S"

# Colors for terminal output
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_NC='\033[0m' # No Color

# Initialize log file
init_logging() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "=== EduQuest Setup Log - $(date) ===" > "$LOG_FILE"
}

# Logging functions with level filtering
log_with_level() {
    local level="$1"
    local color="$2"
    local message="$3"
    local timestamp=$(date +"$TIMESTAMP_FORMAT")

    # Check if this level should be logged
    if [[ "$level" == "DEBUG" && "$LOG_LEVEL" != "DEBUG" ]]; then
        return
    fi

    # Log to file
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"

    # Log to terminal with color
    if [[ "$LOG_LEVEL" == "ERROR" ]] || \
       [[ "$LOG_LEVEL" == "WARN" && "$level" != "DEBUG" ]] || \
       [[ "$LOG_LEVEL" == "INFO" && "$level" != "DEBUG" && "$level" != "WARN" ]] || \
       [[ "$LOG_LEVEL" == "DEBUG" ]]; then
        echo -e "${color}[${timestamp}] [$level] ${message}${COLOR_NC}" >&2
    fi
}

# Public logging functions
log_debug() {
    log_with_level "DEBUG" "$COLOR_BLUE" "$1"
}

log_info() {
    log_with_level "INFO" "$COLOR_GREEN" "$1"
}

log_warn() {
    log_with_level "WARN" "$COLOR_YELLOW" "$1"
}

log_error() {
    log_with_level "ERROR" "$COLOR_RED" "$1"
}

# Specialized logging functions
log_step() {
    log_info "=== STEP: $1 ==="
}

log_success() {
    log_info "✓ SUCCESS: $1"
}

log_failure() {
    log_error "✗ FAILED: $1"
}

# Initialize logging when sourced
init_logging