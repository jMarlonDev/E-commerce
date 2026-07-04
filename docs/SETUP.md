# Setup Guide

## Prerequisites

- Node.js 22+
- pnpm 9+
- Supabase account
- Google Cloud Console account

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment files
cp packages/frontend/.env.example packages/frontend/.env
cp packages/backend/.env.example packages/backend/.env

# 3. Configure your .env files with real credentials (see below)

# 4. Start development
pnpm dev:all
```

## Supabase Setup

1. Create account at https://supabase.com
2. Create a new project
3. Go to Project Settings → API
4. Copy "Project URL" and "service_role" key
5. Add to `packages/backend/.env`:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```
6. Go to SQL Editor
7. Run `packages/backend/src/database/schema.sql`
8. Run `packages/backend/src/database/seeds.sql`

## Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create new project
3. Go to APIs & Services → OAuth consent screen
4. Configure consent screen (External, app name, scopes: email, profile)
5. Go to APIs & Services → Credentials
6. Create OAuth client ID (Web application)
7. Add authorized redirect URI: `http://localhost:5173/auth/google/callback`
8. Copy Client ID and Client Secret
9. Add to `.env` files:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## JWT Secrets

Generate secure secrets:
```bash
openssl rand -base64 64
```

Add to `packages/backend/.env`:
```
JWT_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-secret
```

## Development Commands

```bash
pnpm dev:all          # Start both frontend and backend
pnpm dev              # Frontend only (port 5173)
pnpm dev:backend      # Backend only (port 3000)
pnpm build            # Build both
pnpm lint             # Lint all
pnpm typecheck        # Type check all
```

## API Endpoints

All API routes start with `/api/v1`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login user |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/products | List products |
| GET | /api/v1/products/:id | Get product |
| GET | /api/v1/categories | List categories |
| GET | /api/v1/brands | List brands |
| GET | /api/v1/cart | Get cart |
| POST | /api/v1/cart | Add to cart |
| PUT | /api/v1/cart/:id | Update cart item |
| DELETE | /api/v1/cart/:id | Remove from cart |
| POST | /api/v1/orders | Create order |
| GET | /api/v1/orders | List orders |
| GET | /api/v1/orders/:id | Get order |
