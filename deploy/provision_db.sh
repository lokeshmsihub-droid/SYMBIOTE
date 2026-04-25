#!/bin/bash
source "$(dirname "$0")/lib.sh"
source deploy/.env

log_info "🔗 Linking Supabase Project: $SUPABASE_PROJECT_ID"
export SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN
supabase login --token "$SUPABASE_ACCESS_TOKEN"
supabase link --project-ref "$SUPABASE_PROJECT_ID" --password "$DB_PASSWORD"

log_info "Testing DB connectivity..."
if supabase db pgdump --project-ref "$SUPABASE_PROJECT_ID" > /dev/null 2>&1; then
    log_success "Database Linked successfully."
else
    log_error "Supabase link failed. Check Project ID and Password."
fi
