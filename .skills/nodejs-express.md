# Express.js Server Patterns

> Reference for building production-ready Express.js servers with TypeScript.

---

## 1. Project Structure

```
src/
├── index.ts              # Entry point
├── app.ts                # Express app setup
├── config/
│   ├── env.ts            # Environment variables
│   ├── database.ts       # Supabase client
│   └── constants.ts      # App constants
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.validation.ts
│   ├── users/
│   ├── products/
│   └── orders/
├── middleware/
│   ├── errorHandler.ts
│   ├── auth.ts
│   ├── adminOnly.ts
│   ├── validate.ts
│   └── notFound.ts
└── shared/
    ├── utils/
    └── types/
```

---

## 2. App Setup

```typescript
// app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authRoutes } from './modules/auth/auth.routes';
import { productRoutes } from './modules/products/product.routes';
import { userRoutes } from './modules/users/user.routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
```

```typescript
// index.ts
import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  gracefulShutdown('unhandledRejection');
});
```

---

## 3. Middleware Patterns

### Error Handler

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
}
```

### Not Found

```typescript
// middleware/notFound.ts
import { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.originalUrl} not found` },
  });
}
```

### Auth Middleware

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Access token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
}
```

### Admin Only Middleware

```typescript
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
```

### Validation Middleware

```typescript
// middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
}
```

### Rate Limiting

```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts',
});
```

---

## 4. Request Validation with Zod

```typescript
// modules/products/product.validation.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(10).max(5000),
    price: z.number().positive(),
    category_id: z.string().uuid(),
    brand_id: z.string().uuid(),
    stock: z.number().int().min(0),
    images: z.array(z.string().url()).min(1).max(10),
  }),
});

export const queryParamsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    search: z.string().optional(),
    category: z.string().uuid().optional(),
    brand: z.string().uuid().optional(),
    sort: z.enum(['price', 'name', 'created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});
```

---

## 5. Controller Pattern

```typescript
// modules/products/product.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as productService from './product.service';
import { AppError } from '../../middleware/errorHandler';

export async function getProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page, limit, search, category, brand, sort, order } = req.query as any;

    const result = await productService.getProducts({
      page,
      limit,
      search,
      category,
      brand,
      sort,
      order,
    });

    res.json({
      success: true,
      data: result.products,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
```

---

## 6. Service Pattern

```typescript
// modules/products/product.service.ts
import * as productRepository from './product.repository';

interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  brand?: string;
  sort: string;
  order: string;
}

export async function getProducts(params: GetProductsParams) {
  const { page, limit, search, category, brand, sort, order } = params;
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    productRepository.findMany({ offset, limit, search, category, brand, sort, order }),
    productRepository.count({ search, category, brand }),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  return productRepository.findById(id);
}

export async function createProduct(data: any) {
  return productRepository.create(data);
}
```

---

## 7. API Response Pattern

```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Example usage in controller
res.json({
  success: true,
  data: products,
  meta: { page: 1, limit: 12, total: 100, totalPages: 9 },
} as ApiResponse<Product[]>);
```

---

## 8. Environment Variables

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export const env = envSchema.parse(process.env);
```
