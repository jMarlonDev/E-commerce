# Express + JWT + OAuth2 Patterns

> Complete guide for JWT authentication, token management, and secure API patterns.

---

## 1. JWT Generation and Verification

### Token Generation

```typescript
// utils/tokens.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function generateTokens(user: TokenPayload) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user.userId),
  };
}
```

### Token Verification

```typescript
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}

export function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload | null;
}
```

---

## 2. Token Refresh Flow

```typescript
// modules/auth/auth.service.ts
import { verifyRefreshToken, generateAccessToken } from '../../utils/tokens';
import { supabaseAdmin } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export async function refreshAccessToken(refreshToken: string) {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const { data: tokenRecord } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('user_id', decoded.userId)
      .single();

    if (!tokenRecord) {
      throw new AppError(401, 'Invalid refresh token');
    }

    // Check if token is expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('token', refreshToken);

      throw new AppError(401, 'Refresh token expired');
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, 'Invalid refresh token');
  }
}
```

---

## 3. Middleware Chain

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Access token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
}

// middleware/adminOnly.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    throw new AppError(403, 'Admin access required');
  }
  next();
}

// middleware/optionalAuth.ts
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
  } catch {
    // Token invalid, continue without user
  }

  next();
}
```

### Usage in Routes

```typescript
// Protected route (requires auth)
router.get('/profile', authenticate, getProfile);

// Admin-only route
router.get('/admin/users', authenticate, adminOnly, getUsers);

// Optional auth (user context if available)
router.get('/products', optionalAuth, getProducts);
```

---

## 4. Role-Based Access Control

```typescript
// middleware/authorize.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

type Role = 'customer' | 'admin' | 'super_admin';

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      throw new AppError(401, 'Authentication required');
    }

    if (!roles.includes(req.userRole as Role)) {
      throw new AppError(403, 'Insufficient permissions');
    }

    next();
  };
}

// Usage
router.get('/admin/products', authenticate, authorize('admin', 'super_admin'), getProducts);
router.get('/orders', authenticate, authorize('customer', 'admin'), getOrders);
```

---

## 5. Secure Token Storage

### HttpOnly Cookies

```typescript
// utils/cookies.ts
import { Response } from 'express';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, COOKIE_OPTIONS);
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', { path: '/' });
}
```

### Authorization Header (Recommended)

```typescript
// Frontend: Store in memory, not localStorage
function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
  };

  const refreshAccessToken = async () => {
    const response = await api.post('/auth/refresh', { refreshToken });
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  };

  // Add token to requests
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [accessToken]);

  // Handle 401 responses
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch {
            setAccessToken(null);
            setRefreshToken(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 6. CORS Configuration

```typescript
// app.ts
import cors from 'cors';
import { env } from './config/env';

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
}));
```

---

## 7. Token Revocation

```typescript
// modules/auth/auth.service.ts
export async function revokeRefreshToken(token: string) {
  await supabaseAdmin
    .from('refresh_tokens')
    .delete()
    .eq('token', token);
}

export async function revokeAllUserTokens(userId: string) {
  await supabaseAdmin
    .from('refresh_tokens')
    .delete()
    .eq('user_id', userId);
}

// Logout
export async function logout(refreshToken: string) {
  await revokeRefreshToken(refreshToken);
}
```

```typescript
// Auth route
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await logout(refreshToken);
  }

  clearRefreshTokenCookie(res);

  res.json({ success: true, message: 'Logged out successfully' });
});
```

---

## 8. Complete Auth Routes

```typescript
// modules/auth/auth.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import {
  register,
  login,
  googleCallback,
  refreshToken,
  logout,
  getProfile,
} from './auth.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public routes
router.post(
  '/register',
  authLimiter,
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ]),
  register
);

router.post(
  '/login',
  authLimiter,
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  login
);

router.post('/google', authLimiter, googleCallback);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticate, getProfile);

export { router as authRoutes };
```

---

## Quick Reference

| Pattern | Purpose |
|---------|---------|
| `authenticate` | Verify JWT, attach user to request |
| `adminOnly` | Require admin role |
| `authorize(...roles)` | Require specific roles |
| `optionalAuth` | Attach user if token present |
| `authLimiter` | Rate limit auth endpoints |
| `generateTokens` | Create access + refresh tokens |
| `refreshAccessToken` | Get new access token |
| `revokeRefreshToken` | Invalidate refresh token |
