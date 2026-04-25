#!/bin/bash
source "$(dirname "$0")/lib.sh"

log_info "🚀 SYMBIOTE Master Deployment Initializing..."

# Tool verification
check_cmd "node"
check_cmd "java"
check_cmd "supabase"
check_cmd "wrangler"
check_cmd "curl"

# Env check
if [ ! -f "deploy/.env" ]; then
    log_warn "deploy/.env not found. Creating from example..."
    cp deploy/.env.example deploy/.env
    log_error "Please fill in deploy/.env secrets before re-running."
fi
source deploy/.env

log_info "--- Phase 1: Database ---"
bash deploy/provision_db.sh

log_info "--- Phase 2: Backend ---"
bash deploy/deploy_backend.sh

log_info "--- Phase 3: Frontend ---"
bash deploy/deploy_frontend.sh

log_success "Deployment commands triggered. System will be live in ~3-5 minutes."
