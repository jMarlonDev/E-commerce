# Google OAuth 2.0 Implementation

> Complete guide for implementing Google OAuth in an E-Commerce application.

---

## 1. Google Cloud Console Setup

### Step 1: Create Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" dropdown
3. Click "New Project"
4. Enter name: `ecommerce-auth`
5. Click "Create"

### Step 2: Configure OAuth Consent Screen

1. Go to APIs & Services → OAuth consent screen
2. Select "External" user type
3. Click "Create"
4. Fill in:
   - App name: `E-Commerce Store`
   - User support email: your email
   - Developer contact: your email
5. Click "Save and Continue"
6. Add scopes: `email`, `profile`, `openid`
7. Click "Save and Continue"
8. Add test users (for development)
9. Click "Save and Continue"

### Step 3: Create OAuth Credentials

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: `E-Commerce Web Client`
5. Authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

---

## 2. OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Google OAuth Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐             │
│  │  User    │      │ Frontend │      │ Backend  │             │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘             │
│       │                  │                  │                    │
│       │  1. Click       │                  │                    │
│       │  "Login Google" │                  │                    │
│       │ ──────────────> │                  │                    │
│       │                  │                  │                    │
│       │                  │  2. Redirect to  │                    │
│       │                  │  Google Auth     │                    │
│       │ <─────────────── │                  │                    │
│       │                  │                  │                    │
│       │  3. User logs   │                  │                    │
│       │  in & consents  │                  │                    │
│       │ ──────────────> │                  │                    │
│       │                  │                  │                    │
│       │                  │  4. Google       │                    │
│       │                  │  redirects with  │                    │
│       │                  │  auth code       │                    │
│       │ <─────────────── │                  │                    │
│       │                  │                  │                    │
│       │                  │  5. Send auth    │                    │
│       │                  │  code to backend │                    │
│       │                  │ ────────────────> │                    │
│       │                  │                  │                    │
│       │                  │                  │  6. Exchange code  │
│       │                  │                  │  for tokens        │
│       │                  │                  │ ────────────────>  │
│       │                  │                  │                    │
│       │                  │                  │  7. Get user info  │
│       │                  │                  │ ────────────────>  │
│       │                  │                  │                    │
│       │                  │  8. Return JWT   │                    │
│       │                  │ <──────────────── │                    │
│       │                  │                  │                    │
│       │  9. Store JWT   │                  │                    │
│       │  & redirect     │                  │                    │
│       │ <─────────────── │                  │                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Implementation

### Google Login Button

```tsx
// components/auth/GoogleLogin.tsx
import { supabase } from '@/lib/supabase';

export function GoogleLogin() {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continuar con Google
    </button>
  );
}
```

### Auth Callback Handler

```tsx
// pages/auth/Callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-neutral-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}
```

---

## 4. Backend Token Verification

```typescript
// modules/auth/auth.service.ts
import { OAuth2Client } from 'google-auth-library';
import { env } from '../../config/env';
import { supabaseAdmin } from '../../config/database';
import jwt from 'jsonwebtoken';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Invalid Google token');
  }

  return {
    googleId: payload.sub,
    email: payload.email!,
    firstName: payload.given_name || '',
    lastName: payload.family_name || '',
    avatar: payload.picture,
  };
}

export async function findOrCreateGoogleUser(googleData: {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}) {
  // Check if user exists by google_id
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('google_id', googleData.googleId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Check if user exists by email
  const { data: emailUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', googleData.email)
    .single();

  if (emailUser) {
    // Link Google account to existing user
    const { data: updatedUser } = await supabaseAdmin
      .from('users')
      .update({ google_id: googleData.googleId })
      .eq('id', emailUser.id)
      .select()
      .single();

    return updatedUser;
  }

  // Create new user
  const { data: newUser } = await supabaseAdmin
    .from('users')
    .insert({
      email: googleData.email,
      first_name: googleData.firstName,
      last_name: googleData.lastName,
      avatar_url: googleData.avatar,
      google_id: googleData.googleId,
      role: 'customer',
    })
    .select()
    .single();

  return newUser;
}

export function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
}
```

---

## 5. Backend Route Handler

```typescript
// modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AppError } from '../../middleware/errorHandler';

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new AppError(400, 'ID token is required');
    }

    // Verify Google token
    const googleData = await authService.verifyGoogleToken(idToken);

    // Find or create user
    const user = await authService.findOrCreateGoogleUser(googleData);

    // Generate JWT tokens
    const tokens = authService.generateTokens(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
}
```

```typescript
// modules/auth/auth.routes.ts
import { Router } from 'express';
import { googleCallback } from './auth.controller';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/google', authLimiter, googleCallback);

export { router as authRoutes };
```

---

## 6. Environment Variables

```env
# Backend
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## 7. Error Handling

```typescript
// Common Google OAuth errors and handling
const GOOGLE_ERRORS = {
  TOKEN_EXPIRED: 'Token has expired. Please sign in again.',
  INVALID_TOKEN: 'Invalid authentication token. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  USER_CANCELLED: 'Sign in was cancelled.',
};

export function handleGoogleAuthError(error: any) {
  if (error.message.includes('token_expired')) {
    throw new AppError(401, GOOGLE_ERRORS.TOKEN_EXPIRED);
  }

  if (error.message.includes('invalid_token')) {
    throw new AppError(401, GOOGLE_ERRORS.INVALID_TOKEN);
  }

  throw new AppError(500, 'Authentication failed. Please try again.');
}
```

---

## Quick Reference

| Step | Action |
|------|--------|
| 1 | Create Google Cloud project |
| 2 | Configure OAuth consent screen |
| 3 | Create OAuth credentials |
| 4 | Add redirect URIs |
| 5 | Store Client ID/Secret in env |
| 6 | Implement frontend login button |
| 7 | Handle auth callback |
| 8 | Verify token on backend |
| 9 | Find or create user |
| 10 | Generate JWT tokens |
