# SYMBIOTE — Azure Deployment Guide

## Architecture

```
Azure App Service (Java 17)  ←→  Azure Database for PostgreSQL (Flexible Server)
         ↑
    Frontend (Vite/React — deployed separately)
```

---

## Prerequisites

- Azure App Service (Linux, Java 17)
- Azure Database for PostgreSQL — Flexible Server
- Frontend deployed to Azure Static Web Apps or equivalent

---

## Required Environment Variables

Set these in **Azure App Service → Configuration → Application Settings**:

### Database
| Variable | Example | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://myserver.postgres.database.azure.com:5432/symbiote?sslmode=require` | PostgreSQL connection URL with SSL |
| `DB_USERNAME` | `symbioteadmin` | Database username |
| `DB_PASSWORD` | `(your password)` | Database password |

### Application URLs
| Variable | Example | Description |
|---|---|---|
| `APP_BASE_URL` | `https://symbiote-api.azurewebsites.net` | Backend base URL |
| `FRONTEND_URL` | `https://symbiote.azurestaticapps.net` | Frontend URL (used for CORS) |
| `WEBHOOK_BASE_URL` | `https://symbiote-api.azurewebsites.net/api/jira/webhook` | Jira webhook callback URL |

### Jira Integration
| Variable | Example | Description |
|---|---|---|
| `JIRA_BASE_URL` | `https://yourteam.atlassian.net` | Your Jira instance |
| `JIRA_EMAIL` | `admin@company.com` | Jira admin email |
| `JIRA_API_TOKEN` | `(from Atlassian)` | Jira API token |
| `JIRA_PROJECT_KEY` | `SYM` | Default Jira project key |
| `JIRA_WEBHOOK_SECRET` | `(your secret)` | Shared secret for webhook auth |

### Jira OAuth
| Variable | Example | Description |
|---|---|---|
| `JIRA_CLIENT_ID` | `(from Atlassian Developer Console)` | OAuth app client ID |
| `JIRA_CLIENT_SECRET` | `(from Atlassian Developer Console)` | OAuth app client secret |
| `JIRA_AUTH_URL` | `https://auth.atlassian.com` | Atlassian auth endpoint |
| `JIRA_API_BASE_URL` | `https://api.atlassian.com` | Atlassian API endpoint |
| `JIRA_REDIRECT_URI` | `https://symbiote-api.azurewebsites.net/api/jira/oauth/callback` | OAuth callback URL |

### Security
| Variable | Example | Description |
|---|---|---|
| `TOKEN_ENCRYPTION_KEY` | `(32-byte base64 key)` | AES encryption key for tokens |
| `JWT_SECRET` | `(min 32 chars)` | JWT signing secret |

### Server
| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server port (Azure sets this automatically) |

---

## Deployment Steps

### 1. Create PostgreSQL Database

```bash
az postgres flexible-server create \
  --resource-group symbiote-rg \
  --name symbiote-db \
  --admin-user symbioteadmin \
  --admin-password '<password>' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15

az postgres flexible-server db create \
  --resource-group symbiote-rg \
  --server-name symbiote-db \
  --database-name symbiote
```

### 2. Create App Service

```bash
az webapp create \
  --resource-group symbiote-rg \
  --plan symbiote-plan \
  --name symbiote-api \
  --runtime "JAVA:17-java17"
```

### 3. Configure Environment Variables

```bash
az webapp config appsettings set \
  --resource-group symbiote-rg \
  --name symbiote-api \
  --settings \
    DB_URL="jdbc:postgresql://symbiote-db.postgres.database.azure.com:5432/symbiote?sslmode=require" \
    DB_USERNAME="symbioteadmin" \
    DB_PASSWORD="<password>" \
    APP_BASE_URL="https://symbiote-api.azurewebsites.net" \
    FRONTEND_URL="https://symbiote.azurestaticapps.net" \
    WEBHOOK_BASE_URL="https://symbiote-api.azurewebsites.net/api/jira/webhook" \
    JIRA_BASE_URL="https://yourteam.atlassian.net" \
    JIRA_EMAIL="admin@company.com" \
    JIRA_API_TOKEN="<token>" \
    JIRA_PROJECT_KEY="SYM" \
    JIRA_WEBHOOK_SECRET="<secret>" \
    JIRA_CLIENT_ID="<client_id>" \
    JIRA_CLIENT_SECRET="<client_secret>" \
    JIRA_AUTH_URL="https://auth.atlassian.com" \
    JIRA_API_BASE_URL="https://api.atlassian.com" \
    JIRA_REDIRECT_URI="https://symbiote-api.azurewebsites.net/api/jira/oauth/callback" \
    TOKEN_ENCRYPTION_KEY="<32-byte-base64-key>" \
    JWT_SECRET="<min-32-char-secret>"
```

### 4. Configure Health Check

In Azure Portal → App Service → Health Check:
- Path: `/actuator/health`
- Expected status: `200`

### 5. Build and Deploy

```bash
# Build the JAR
./gradlew clean build -x test

# Deploy to Azure
az webapp deploy \
  --resource-group symbiote-rg \
  --name symbiote-api \
  --src-path build/libs/backend-0.0.1-SNAPSHOT.jar \
  --type jar
```

### 6. Configure Startup Command

In Azure Portal → App Service → Configuration → General Settings:
```
java -jar /home/site/wwwroot/app.jar
```

---

## Atlassian OAuth Setup

In the [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/):

1. Update the **Callback URL** to: `https://symbiote-api.azurewebsites.net/api/jira/oauth/callback`
2. Ensure the redirect URI matches `JIRA_REDIRECT_URI` exactly

---

## Verification Checklist

- [ ] App starts without errors in Azure logs
- [ ] `GET /actuator/health` returns `{"status":"UP"}` with db details
- [ ] Database tables are auto-created via Hibernate `ddl-auto=update`
- [ ] Login and JWT auth work correctly
- [ ] Jira OAuth flow completes with Azure domain redirect
- [ ] Webhook endpoint `POST /api/jira/webhook` is reachable
- [ ] CORS allows requests from `FRONTEND_URL`
- [ ] No localhost references in any response headers or redirects

---

## Troubleshooting

| Issue | Check |
|---|---|
| App won't start | Check logs: `az webapp log tail --name symbiote-api --resource-group symbiote-rg` |
| DB connection fails | Verify `DB_URL` has `?sslmode=require`, check firewall rules |
| OAuth redirect fails | Ensure `JIRA_REDIRECT_URI` matches Atlassian Developer Console callback |
| CORS errors | Verify `FRONTEND_URL` exactly matches the deployed frontend origin |
| Health check fails | Ensure `/actuator/health` is accessible (not behind auth) |
