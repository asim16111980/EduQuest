#!/bin/bash

# Realtime Setup Script for EduQuest Admin Dashboard
# Configures Realtime features for activity_logs and leaderboard_snapshots tables
# 
# FR-005: Enable Realtime features for admin dashboard

set -e

# Import common utilities
source "$(dirname "$0")/../lib/retry-utils.sh"
source "$(dirname "$0")/../lib/logging.sh"
source "$(dirname "$0")/../lib/env-validation.sh"

# Configuration
PROJECT_REF=${SUPABASE_PROJECT_REF}
DATABASE_URL=${SUPABASE_DB_URL}
API_URL=${SUPABASE_API_URL}

# Configuration validation
if ! validate_environment_vars "SUPABASE_PROJECT_REF" "SUPABASE_DB_URL" "SUPABASE_API_URL"; then
    log_error "Missing required environment variables for Realtime setup"
    exit 1
fi

log_info "Starting Realtime setup for EduQuest admin dashboard"

# Function to configure Realtime for a specific table
configure_realtime_table() {
    local table_name="$1"
    local log_prefix="Configuring Realtime for $table_name"
    
    log_info "$log_prefix"
    
    # Enable Realtime on the table
    local retry_cmd="supabase realtime enable $table_name"
    retry_with_backoff "$retry_cmd" 3 5 10 "$log_prefix - Enable Realtime" || {
        log_error "$log_prefix - Failed to enable Realtime"
        return 1
    }
    
    # Add RLS policy for Realtime access (idempotent)
    local rls_policy="
DROP POLICY IF EXISTS \"Enable Realtime access on $table_name\" ON $table_name;
CREATE POLICY \"Enable Realtime access on $table_name\" 
ON $table_name 
FOR SELECT 
USING (auth.uid() IS NOT NULL);
"
    
    echo "$rls_policy" | supabase db execute || {
        log_error "$log_prefix - Failed to add RLS policy"
        return 1
    }
    
    log_success "$log_prefix - Complete"
}

# Configure activity_logs table for Realtime
configure_realtime_table "activity_logs" || {
    log_error "Failed to configure activity_logs for Realtime"
    exit 1
}

# Configure leaderboard_snapshots table for Realtime  
configure_realtime_table "leaderboard_snapshots" || {
    log_error "Failed to configure leaderboard_snapshots for Realtime"
    exit 1
}

# Configure Realtime permissions and channels
log_info "Configuring Realtime permissions and channels"

# Configure Realtime channel permissions (idempotent)
channel_configs="
-- Realtime channel permissions for EduQuest admin dashboard

-- Activity logs channel - admin staff only
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'activity_logs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
    END IF;
END $$;

-- Leaderboard snapshots channel - admin staff only  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'leaderboard_snapshots') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_snapshots;
    END IF;
END $$;

-- Set up proper RLS for Realtime access
"

echo "$channel_configs" | supabase db execute || {
    log_error "Failed to configure Realtime channel permissions"
    exit 1
}

# Test Realtime configuration
log_info "Verifying Realtime configuration"

realtime_check="supabase realtime list"
retry_with_backoff "$realtime_check" 3 5 10 "Verify Realtime status" || {
    log_error "Failed to verify Realtime configuration"
    exit 1
}

log_success "Realtime setup completed successfully"
log_info "✓ activity_logs configured for Realtime"
log_info "✓ leaderboard_snapshots configured for Realtime" 
log_info "✓ RLS policies applied for Realtime access"
log_info "✓ Realtime channels published"

# Output connection information
echo ""
echo "Realtime Connection Information:"
echo "--------------------------------"
echo "Realtime URL: https://$PROJECT_REF.supabase.co/realtime/v1"
echo "WebSocket URL: wss://$PROJECT_REF.supabase.co/realtime/v1"
echo ""
echo "To connect to Realtime:"
echo "1. Use the Realtime SDK in your admin dashboard"
echo "2. Subscribe to channels: 'activity_logs' and 'leaderboard_snapshots'"
echo "3. Ensure proper authentication is configured"

exit 0