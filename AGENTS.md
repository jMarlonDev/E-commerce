# AGENTS.md - E-Commerce Project Specification

> **Version:** 1.0.0  
> **Last Updated:** 2026-07-02  
> **Status:** Active Development

This document is the **single source of truth** for the entire E-Commerce project. All development must follow this specification.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Engineering Principles](#3-engineering-principles)
4. [Coding Standards](#4-coding-standards)
5. [Project Structure](#5-project-structure)
6. [Architecture Patterns](#6-architecture-patterns)
7. [Database Schema](#7-database-schema)
8. [Authentication Flow](#8-authentication-flow)
9. [API Conventions](#9-api-conventions)
10. [External Services Setup](#10-external-services-setup)
11. [UI/UX Conventions](#11-uiux-conventions)
12. [Development Workflow](#12-development-workflow)
13. [Implementation Milestones](#13-implementation-milestones)
14. [Agent Rules](#14-agent-rules)

---

## 1. Project Overview

### Description

A modern, scalable, and maintainable Full Stack E-Commerce application built with React, Node.js, and PostgreSQL. The application features a public storefront, user accounts, a persistent shopping cart, a simulated checkout process, and a comprehensive admin dashboard.

### Goals

- Clean, modular, and maintainable architecture
- Professional-grade code quality
- 100% responsive design
- Complete Spanish UI with English source code
- Simulated payment processing (no real payment gateways)

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Library |
| TypeScript | 5.8.x | Type Safety |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| React Router | 7.x | Routing |
| Axios | 1.9.x | HTTP Client |
| clsx + tailwind-merge | Latest | className utilities |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | Runtime |
| Express | 5.x | Web Framework |
| TypeScript | 5.8.x | Type Safety |
| tsx | Latest | Development Runtime |
| Supabase Client | 2.x | Database Client |
| bcryptjs | 3.x | Password Hashing |
| jsonwebtoken | 9.x | JWT Auth |
| zod | 3.x | Validation |

### Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary Database |
| Supabase | Database Hosting + Auth |

### External Services

| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL hosting, Auth |
| Google Cloud Console | OAuth 2.0 |
| Cloudinary | Image Storage |

---

## 3. Engineering Principles

### Mandatory Principles

1. **KISS** (Keep It Simple, Stupid)
   - Avoid unnecessary complexity
   - Choose the simplest solution that works

2. **SOLID** (where appropriate)
   - Single Responsibility: Each function/class does one thing
   - Open/Closed: Extend without modifying
   - Dependency Injection: Use for testability

3. **DRY** (Don't Repeat Yourself)
   - Extract shared logic into utilities
   - Use components for repeated UI patterns
   - Create shared types and constants

4. **Separation of Concerns**
   - Frontend: UI only, no business logic
   - Backend: Business logic, no UI
   - Database: Data only, no business rules

5. **Clean Code**
   - Meaningful names
   - Small functions (< 30 lines)
   - Single level of abstraction
   - No magic numbers/strings

### Guidelines

- Avoid unnecessary abstractions
- Avoid overengineering
- Implement only what is needed
- Prefer composition over inheritance
- Favor explicit code over clever code

---

## 4. Coding Standards

### Language Rules

| Element | Language |
|---------|----------|
| Variables | English |
| Functions | English |
| Classes | English |
| Components | English |
| Files | English |
| Folders | English |
| Database tables | English |
| Database columns | English |
| API endpoints | English |
| Comments | English |
| UI text | **Spanish only** |

### Naming Conventions

**Frontend (React/TypeScript):**
```
Components:     PascalCase    (UserProfile.tsx)
Functions:      camelCase     (getUserData)
Variables:      camelCase     (userName)
Constants:      UPPER_SNAKE   (API_BASE_URL)
Files:          PascalCase    (UserProfile.tsx)
Hooks:          camelCase     (useAuth)
Context:        PascalCase    (AuthContext)
Types/Interfaces: PascalCase  (UserData)
CSS classes:    kebab-case    (user-profile)
```

**Backend (Node.js/TypeScript):**
```
Controllers:    camelCase     (usersController)
Services:       camelCase     (usersService)
Repositories:   camelCase     (usersRepository)
Routes:         camelCase     (usersRoutes)
Tables:         snake_case    (user_addresses)
Columns:        snake_case    (created_at)
Files:          kebab-case    (users.controller.ts)
Functions:      camelCase     (getUserById)
Variables:      camelCase     (userId)
Constants:      UPPER_SNAKE   (MAX_RETRY_COUNT)
```

### File Structure Rules

- One component per file
- One export per file (when possible)
- Co-locate related files (test next to source)
- Group by feature, not by type

---

## 5. Project Structure

### Root

```
E-commerce/
├── AGENTS.md                 # This file
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # pnpm workspace config
├── .npmrc                    # pnpm config
├── .gitignore
├── .skills/                  # AI agent skills
├── packages/
│   ├── frontend/             # React + Vite + TS + Tailwind
│   └── backend/              # Express + TS + Supabase
├── docs/                     # Documentation
└── scripts/                  # Utility scripts
```

### Frontend Structure

```
packages/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
│   └── images/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Tailwind imports
│   ├── api/                  # API layer
│   │   ├── axiosClient.ts
│   │   ├── endpoints/
│   │   └── interceptors/
│   ├── assets/               # Static assets
│   ├── components/           # UI Components
│   │   ├── ui/               # Primitive components
│   │   ├── layout/           # Layout components
│   │   ├── common/           # Shared components
│   │   ├── home/             # Home page components
│   │   ├── product/          # Product components
│   │   ├── cart/             # Cart components
│   │   ├── checkout/         # Checkout components
│   │   └── admin/            # Admin components
│   ├── hooks/                # Custom hooks
│   ├── context/              # React Context
│   ├── pages/                # Route pages
│   │   ├── public/
│   │   ├── user/
│   │   └── admin/
│   ├── routes/               # Route definitions
│   ├── services/             # Business logic
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilities
│   └── config/               # Configuration
```

### Backend Structure

```
packages/backend/
├── package.json
├── tsconfig.json
├── nodemon.json
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── config/               # Configuration
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── constants.ts
│   ├── modules/              # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── brands/
│   │   ├── orders/
│   │   ├── cart/
│   │   ├── reviews/
│   │   ├── coupons/
│   │   ├── banners/
│   │   └── stats/
│   ├── middleware/            # Global middleware
│   │   ├── errorHandler.ts
│   │   ├── auth.ts
│   │   ├── adminOnly.ts
│   │   ├── validate.ts
│   │   └── notFound.ts
│   ├── shared/               # Shared utilities
│   │   ├── utils/
│   │   └── types/
│   └── database/             # Database files
│       ├── schema.sql
│       ├── seeds.sql
│       └── migrations/
```

---

## 6. Architecture Patterns

### Backend: Module Pattern

Each module follows this structure:

```
module/
├── module.controller.ts    # HTTP handlers
├── module.service.ts       # Business logic
├── module.repository.ts    # Database queries
├── module.routes.ts        # Route definitions
├── module.validation.ts    # Zod schemas
└── module.types.ts         # TypeScript types
```

**Data Flow:**
```
Route → Controller → Service → Repository → Database
```

### Frontend: Component Pattern

**Component Structure:**
```tsx
// ComponentName.tsx
import { cn } from "@/utils/cn";

interface ComponentNameProps {
  className?: string;
  // other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* content */}
    </div>
  );
}
```

### State Management

- **Global State:** React Context (Auth, Cart, Toast)
- **Server State:** API calls in hooks
- **Local State:** useState/useReducer

---

## 7. Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| users | User accounts |
| user_addresses | User shipping addresses |
| categories | Product categories (self-referencing) |
| brands | Product brands |
| products | Product catalog |
| product_images | Product images |
| product_variants | Product variants (color, size) |
| product_specifications | Product specs |
| reviews | Product reviews |
| cart_items | Shopping cart items |
| orders | Customer orders |
| order_items | Order line items |
| wishlists | User wishlists |
| coupons | Discount coupons |
| banners | Homepage banners |
| store_settings | Store configuration |

### Key Relationships

```
users ─┬── user_addresses (1:N)
       ├── orders (1:N)
       ├── cart_items (1:N)
       ├── reviews (1:N)
       └── wishlists (1:N)

categories ─┬── products (1:N)
            └── categories (self-ref, parent_id)

brands ──── products (1:N)

products ─┬── product_images (1:N)
          ├── product_variants (1:N)
          ├── product_specifications (1:N)
          ├── order_items (1:N)
          └── reviews (1:N)

orders ──── order_items (1:N)
```

---

## 8. Authentication Flow

### Registration Flow

1. User submits: email, password, first_name, last_name
2. Backend validates input with Zod
3. Backend checks if email exists
4. Backend hashes password with bcryptjs
5. Backend creates user in database
6. Backend generates JWT access token
7. Backend generates JWT refresh token
8. Backend returns tokens to frontend
9. Frontend stores tokens in memory
10. Frontend redirects to home

### Login Flow

1. User submits: email, password
2. Backend validates input
3. Backend finds user by email
4. Backend compares password with bcryptjs
5. Backend generates JWT access token
6. Backend generates JWT refresh token
7. Backend returns tokens to frontend
8. Frontend stores tokens in memory
9. Frontend redirects to home

### Google OAuth Flow

1. User clicks "Login with Google"
2. Frontend redirects to Google OAuth consent screen
3. User grants permission
4. Google redirects back with authorization code
5. Frontend sends code to backend
6. Backend exchanges code for tokens with Google
7. Backend fetches user info from Google
8. Backend creates or finds user by google_id
9. Backend generates JWT access token
10. Backend generates JWT refresh token
11. Backend returns tokens to frontend

### Token Refresh Flow

1. Frontend detects 401 response
2. Frontend sends refresh token to backend
3. Backend verifies refresh token
4. Backend generates new access token
5. Backend returns new access token
6. Frontend retries original request

---

## 9. API Conventions

### Base URL

```
/api/v1
```

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read resources | GET /api/v1/products |
| POST | Create resources | POST /api/v1/products |
| PUT | Update resources (full) | PUT /api/v1/products/:id |
| PATCH | Update resources (partial) | PATCH /api/v1/products/:id |
| DELETE | Delete resources | DELETE /api/v1/products/:id |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": {
      "email": ["Email is required"]
    }
  }
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

### Authentication

All protected routes require:
```
Authorization: Bearer <access_token>
```

### Pagination

Query parameters:
```
?page=1&limit=12&search=keyword&sort=price&order=asc
```

---

## 10. External Services Setup

### 10.1 Supabase

#### Why Supabase?
- Managed PostgreSQL hosting
- Built-in authentication
- Real-time subscriptions
- Row Level Security (RLS)
- Dashboard for database management

#### Setup Steps

1. **Create Account**
   - Go to https://supabase.com
   - Sign up with GitHub or email
   - Create a new project

2. **Get Credentials**
   - Go to Project Settings → API
   - Copy "Project URL"
   - Copy "service_role" key (keep secret!)

3. **Configure Database**
   - Go to SQL Editor
   - Run `packages/backend/src/database/schema.sql`
   - Run `packages/backend/src/database/seeds.sql`

4. **Environment Variables**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

### 10.2 Google OAuth

#### Why Google OAuth?
- Trusted authentication provider
- Reduces password management
- Improves user experience

#### Setup Steps

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com

2. **Create Project**
   - Click "Select a project" → "New Project"
   - Name: "ecommerce-auth"
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Select "External" user type
   - Fill in app name: "E-Commerce Store"
   - Add scopes: email, profile
   - Add test users (for development)

4. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "E-Commerce Web Client"
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/google/callback`
   - Copy "Client ID" and "Client Secret"

5. **Environment Variables**
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 10.3 JWT Configuration

#### Why JWT?
- Stateless authentication
- Scalable
- Works across services

#### Setup

Generate secure secrets:
```bash
openssl rand -base64 64
```

**Environment Variables:**
```
JWT_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 10.4 Cloudinary (Optional - for image uploads)

#### Why Cloudinary?
- Image optimization
- CDN delivery
- Transformations on-the-fly

#### Setup Steps

1. **Create Account**
   - Go to https://cloudinary.com
   - Sign up

2. **Get Credentials**
   - Go to Dashboard
   - Copy "Cloud name", "API Key", "API Secret"

3. **Environment Variables**
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

---

## 11. UI/UX Conventions

### Language

- All UI text: **Spanish**
- All source code: **English**

### Color Palette (Pastel Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Light | #E0F2FE | Backgrounds |
| Primary | #0EA5E9 | Buttons, links |
| Primary Dark | #0369A1 | Hover states |
| Secondary Light | #FDF4FF | Accent backgrounds |
| Secondary | #D946EF | Highlights |
| Accent Light | #ECFDF5 | Success backgrounds |
| Accent | #10B981 | Success states |
| Neutral Light | #F8FAFC | Page background |
| Neutral | #64748B | Text secondary |
| Neutral Dark | #1E293B | Text primary |
| Error | #EF4444 | Errors |
| Warning | #F59E0B | Warnings |

### Typography

```css
Font Family: Inter, system-ui, sans-serif
Headings: 600-700 weight
Body: 400 weight
```

### Spacing Scale

Use Tailwind's default spacing scale (0.25rem increments).

### Border Radius

- Small elements: rounded-md (0.375rem)
- Cards: rounded-lg (0.5rem)
- Modals: rounded-xl (0.75rem)
- Buttons: rounded-full (pill shape for CTAs)

### Shadows

- Cards: shadow-sm (subtle)
- Hover states: shadow-md (medium)
- Modals: shadow-xl (prominent)

### Responsive Breakpoints

```
sm: 640px    (Mobile landscape)
md: 768px    (Tablet)
lg: 1024px   (Desktop)
xl: 1280px   (Large desktop)
2xl: 1536px  (Extra large)
```

---

## 12. Development Workflow

### Branch Strategy

```
main          # Production-ready code
├── develop   # Development branch
├── feature/* # Feature branches
├── fix/*     # Bug fix branches
└── release/* # Release preparation
```

### Commit Convention

```
type(scope): description

feat(auth): add Google OAuth login
fix(cart): resolve quantity update issue
docs(readme): update setup instructions
style(ui): improve button hover states
refactor(api): extract validation middleware
test(auth): add login endpoint tests
```

### Development Process

1. Pull latest from develop
2. Create feature branch
3. Implement feature
4. Write tests
5. Run lint and typecheck
6. Create pull request
7. Code review
8. Merge to develop

### Required Checks

Before any commit:
```bash
pnpm lint
pnpm typecheck
```

---

## 13. Implementation Milestones

### M1: Project Setup ✓

- [x] Initialize monorepo with pnpm
- [x] Configure frontend (Vite + React + TS + Tailwind)
- [x] Configure backend (Express + TS)
- [x] Create database schema
- [x] Set up Supabase project
- [x] Configure environment variables

### M2: Authentication System

- [ ] User registration (email/password)
- [ ] User login
- [ ] JWT token generation
- [ ] Token refresh mechanism
- [ ] Google OAuth integration
- [ ] Protected route middleware
- [ ] Auth context (frontend)
- [ ] Login/Register pages

### M3: Product Catalog

- [ ] Product CRUD (admin)
- [ ] Product listing with pagination
- [ ] Product search
- [ ] Category filtering
- [ ] Brand filtering
- [ ] Price range filter
- [ ] Product cards
- [ ] Product grid layout

### M4: Product Details

- [ ] Product detail page
- [ ] Image gallery
- [ ] Product specifications
- [ ] Variant selection (color/size)
- [ ] Stock display
- [ ] Add to cart button
- [ ] Buy now button
- [ ] Related products

### M5: Shopping Cart

- [ ] Add to cart
- [ ] Remove from cart
- [ ] Update quantity
- [ ] Cart persistence (localStorage + backend)
- [ ] Subtotal calculation
- [ ] Shipping calculation (simulated)
- [ ] Tax calculation (simulated)
- [ ] Cart page UI

### M6: Checkout Flow

- [ ] Step 1: Shipping information
- [ ] Step 2: Order review
- [ ] Step 3: Payment simulation
- [ ] Payment methods (card, transfer, cash)
- [ ] Order creation
- [ ] Order confirmation page
- [ ] Order number generation

### M7: User Dashboard

- [ ] Profile page
- [ ] Edit personal information
- [ ] Saved addresses
- [ ] Order history
- [ ] Order details
- [ ] Wishlist

### M8: Admin Dashboard

- [ ] Dashboard statistics
- [ ] Sales charts (Chart.js/Recharts)
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Customer management
- [ ] Inventory alerts
- [ ] Category management
- [ ] Brand management

### M9: Advanced Features

- [ ] Coupon system
- [ ] Banner management
- [ ] Reviews and ratings
- [ ] Search autocomplete
- [ ] Infinite scroll
- [ ] Image upload (Cloudinary)

### M10: Polish & Optimization

- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Responsive testing
- [ ] Accessibility audit

---

## 14. Agent Rules

### Mandatory Rules

1. **Language**
   - All code MUST be in English
   - All UI text MUST be in Spanish
   - No Spanish in code, no English in UI

2. **Architecture**
   - Follow the module pattern for backend
   - Follow the component pattern for frontend
   - Never skip layers (Controller → Service → Repository)

3. **Code Quality**
   - Never use `any` type
   - Always handle errors
   - Always validate input
   - Never leave TODO comments (implement or remove)

4. **Security**
   - Never commit secrets
   - Always hash passwords
   - Always validate and sanitize input
   - Use parameterized queries
   - Implement rate limiting

5. **Performance**
   - Use pagination for lists
   - Implement lazy loading
   - Optimize database queries
   - Use proper indexing

6. **Git**
   - Never commit directly to main
   - Use meaningful commit messages
   - Keep commits focused

### Before Any Change

1. Read existing code patterns
2. Understand the context
3. Follow existing conventions
4. Verify with lint/typecheck

### When Creating New Files

1. Follow the naming conventions
2. Add proper imports
3. Export appropriately
4. Add TypeScript types

### When Modifying Existing Code

1. Preserve existing style
2. Don't break existing functionality
3. Update related tests
4. Update documentation if needed

---

## Quick Reference Commands

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev:all          # Both frontend and backend
pnpm dev              # Frontend only
pnpm dev:backend      # Backend only

# Quality checks
pnpm lint
pnpm typecheck
pnpm build

# Database
# Run schema.sql in Supabase SQL Editor
# Run seeds.sql for sample data
```

---

*This document is the authoritative source for all development decisions. When in doubt, refer to this file.*
