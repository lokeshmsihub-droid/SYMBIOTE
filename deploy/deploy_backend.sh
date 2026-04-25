#!/bin/bash
source "$(dirname "$0")/lib.sh"
source deploy/.env

log_info "🔨 Building Spring Boot Production Artifact..."
JAVA_HOME=$(/usr/libexec/java_home -v 17) ./gradlew bootJar -x test

log_info "🚀 Triggering Render Blueprint Deploy..."
RESPONSE=$(curl -s -X POST "https://api.render.com/v1/blueprints" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"repo\": \"$(git remote get-url origin)\",
    \"name\": \"symbiote-prod\",
    \"branch\": \"main\"
  }")

if [[ $RESPONSE == *"id"* ]]; then
    log_success "Render deploy triggered via Blueprint API."
else
    log_error "Render error: $RESPONSE"
fi
