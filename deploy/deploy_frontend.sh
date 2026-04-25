#!/bin/bash
source "$(dirname "$0")/lib.sh"
source deploy/.env

log_info "⚛️ Building Frontend..."
cd client
npm install
npm run build
cd ..

log_info "☁️ Deploying to Cloudflare Pages..."
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID \
  wrangler pages deploy client/dist --project-name "symbiote" --branch "main"

log_success "Cloudflare deployment complete."
