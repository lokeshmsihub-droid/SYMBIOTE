# SYMBIOTE — Production Deployment Guide

## Architecture

```
User → Cloudflare Pages (React/Vite) → Render API (Spring Boot) → Supabase (PostgreSQL) ↔ Jira Cloud
```

| Component | Service | Plan | Cost |
|---|---|---|---|
| Frontend | Cloudflare Pages | Free | $0/mo |
| Backend | Render Web Service | Starter | $7/mo |
| Database | Supabase PostgreSQL | Free | $0/mo |
| Jira | Atlassian Cloud | Your plan | — |

---

## Prerequisites

| Tool | Install | Purpose |
|---|---|---|
| Supabase CLI | `brew install supabase/tap/supabase` | DB provisioning |
| Wrangler CLI | `npm install -g wrangler` | Cloudflare deployment |
| Docker | `brew install --cask docker` | Local testing |
| Git | Required | Render deploys from GitHub |

---

## Step 1: Create Supabase Database

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. **Region**: `us-west-1` (closest to Render Oregon)
3. **Name**: `symbiote-prod`
4. **Password**: Generate a strong password — save it!
5. After creation, go to **Settings → Database**
6. Copy the **Connection Pooling** URI (port `6543`) — NOT the direct connection

```
DB_URL=jdbc:postgresql://aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
DB_USERNAME=postgres.<your-project-ref>
DB_PASSWORD=<your-password>
```

> ⚠️ Use port `6543` (pgbouncer pooler), NOT `5432`. Render instances restart frequently and will exhaust Supabase's 15-connection limit.

---

## Step 2: Generate Secrets

```bash
# Webhook secret
openssl rand -hex 32

# AES encryption key (32 bytes, base64)
openssl rand -base64 32

# JWT secret (48 bytes, base64)
openssl rand -base64 48
```

---

## Step 3: Deploy Backend to Render

### Option A: Blueprint (Recommended)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New → Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates the service
5. Go to the service → **Environment** → set all `sync: false` variables

### Option B: Manual

1. **New → Web Service** → connect GitHub repo
2. **Environment**: Docker
3. **Region**: Oregon
4. **Plan**: Starter ($7/mo)
5. **Health Check Path**: `/actuator/health`
6. Set environment variables (see table below)

### Environment Variables (Render Dashboard)

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:postgresql://aws-0-...pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true` |
| `DB_USERNAME` | `postgres.<project-ref>` |
| `DB_PASSWORD` | *(from Supabase)* |
| `APP_BASE_URL` | `https://symbiote-api.onrender.com` |
| `FRONTEND_URL` | `https://symbiote.pages.dev` |
| `WEBHOOK_BASE_URL` | `https://symbiote-api.onrender.com/api/jira/webhook` |
| `JIRA_BASE_URL` | `https://yourteam.atlassian.net` |
| `JIRA_EMAIL` | *(your Jira admin email)* |
| `JIRA_API_TOKEN` | *(from Atlassian API tokens page)* |
| `JIRA_PROJECT_KEY` | `KAN` |
| `JIRA_WEBHOOK_SECRET` | *(from openssl rand -hex 32)* |
| `JIRA_CLIENT_ID` | *(from Atlassian Dev Console)* |
| `JIRA_CLIENT_SECRET` | *(from Atlassian Dev Console)* |
| `JIRA_AUTH_URL` | `https://auth.atlassian.com` |
| `JIRA_API_BASE_URL` | `https://api.atlassian.com` |
| `JIRA_REDIRECT_URI` | `https://symbiote-api.onrender.com/api/jira/oauth/callback` |
| `TOKEN_ENCRYPTION_KEY` | *(from openssl rand -base64 32)* |
| `JWT_SECRET` | *(from openssl rand -base64 48)* |
| `PORT` | `8080` |

---

## Step 4: Deploy Frontend to Cloudflare Pages

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Create Pages project
wrangler pages project create symbiote --production-branch main

# 3. Build
cd client
npm install
npm run build

# 4. Deploy
wrangler pages deploy dist --project-name symbiote
```

### Set Environment Variable (for future builds)

In Cloudflare Dashboard → Pages → symbiote → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://symbiote-api.onrender.com/api` |

---

## Step 5: Configure Jira

### Update OAuth Callback URL

In [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/):

```
Callback URL: https://symbiote-api.onrender.com/api/jira/oauth/callback
```

### Create Webhook (Jira Admin → Webhooks)

```
URL: https://symbiote-api.onrender.com/api/jira/webhook
Events: Issue Created, Issue Updated, Issue Deleted
```

> The webhook uses `X-SYMBIOTE-SECRET` header for authentication. If using Jira Automation rules to call the webhook, include this header.

---

## Step 6: Verify Deployment

```bash
# Health check
curl https://symbiote-api.onrender.com/actuator/health

# CORS preflight
curl -H "Origin: https://symbiote.pages.dev" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://symbiote-api.onrender.com/api/auth/me

# Test login
curl -X POST https://symbiote-api.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com","password":"yourpass"}'
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| CORS errors | `FRONTEND_URL` doesn't match exactly | Include `https://`, no trailing slash |
| 502 on Render | JVM cold start or OOM | Wait 30s for health check; check Render logs |
| DB connection fails | Wrong port or username | Use port `6543`, username `postgres.<ref>` |
| OAuth redirect fails | `JIRA_REDIRECT_URI` mismatch | Must exactly match Atlassian Dev Console |
| Frontend 404 on refresh | Missing `_redirects` file | Verify `client/public/_redirects` exists |
| Scheduled jobs don't run | Missing `@EnableScheduling` | ✅ Fixed in this deployment |
| `Could not resolve placeholder` | Missing env var in Render | Check all variables are set in Render dashboard |

---

## Cloudflare Security Settings

In Cloudflare Dashboard → your site:

1. **SSL/TLS**: Full (strict)
2. **Caching**: Standard
3. **Rate Limiting** (recommended):
   - `/api/events` — 100 req/min
   - `/api/jira/webhook` — 60 req/min
   - `/api/auth/login` — 10 req/min

---

## Post-Deployment Checklist

- [ ] Health check returns `{"status":"UP"}`
- [ ] Frontend loads at Cloudflare URL
- [ ] Login/register works end-to-end
- [ ] CORS allows frontend → backend requests
- [ ] Jira OAuth flow completes
- [ ] Webhook endpoint is reachable
- [ ] Database tables auto-created in Supabase
- [ ] Rotate ALL secrets from `.env` (committed to git history)
