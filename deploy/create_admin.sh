#!/bin/bash

# Default values
API_URL=${1:-"http://localhost:8080/api"}
ADMIN_EMAIL=${2:-"admin@symbiote.ai"}
ADMIN_PASSWORD=${3:-"admin123"}
ADMIN_NAME=${4:-"System Admin"}

echo "-----------------------------------------------"
echo "SYMBIOTE — Admin Creation Script"
echo "Target API: $API_URL"
echo "Admin Email: $ADMIN_EMAIL"
echo "Admin Name: $ADMIN_NAME"
echo "-----------------------------------------------"

curl -X POST "$API_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d "{
       \"email\": \"$ADMIN_EMAIL\",
       \"password\": \"$ADMIN_PASSWORD\",
       \"name\": \"$ADMIN_NAME\",
       \"role\": \"ADMIN\",
       \"department\": \"IT\",
       \"status\": \"ACTIVE\"
     }"

echo -e "\n-----------------------------------------------"
echo "Done."
