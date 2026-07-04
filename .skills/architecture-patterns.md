# Software Architecture Patterns

> Reference for building scalable, maintainable software architectures.

---

## 1. Module Pattern (Backend)

### File Structure

```
src/modules/
├── auth/
│   ├── auth.controller.ts    # HTTP handlers
│   ├── auth.service.ts       # Business logic
│   ├── auth.repository.ts    # Database queries
│   ├── auth.routes.ts        # Route definitions
│   ├── auth.validation.ts    # Zod schemas
│   └── auth.types.ts         # TypeScript types
├── users/
├── products/
├── orders/
├── cart/
├── reviews/
└── categories/
```

### Data Flow

```
Route → Controller → Service → Repository → Database
```

### Implementation

```typescript
// modules/products/product.types.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  brand_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand_id: string;
  stock: number;
}

export interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  brand?: string;
  sort: string;
  order: 'asc' | 'desc';
}
```

```typescript
// modules/products/product.repository.ts
import { supabaseAdmin } from '../../config/database';
import { Product, CreateProductDTO, ProductFilters } from './product.types';

export async function findMany(filters: ProductFilters): Promise<Product[]> {
  const { page, limit, search, category, brand, sort, order } = filters;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .range(offset, offset + limit - 1)
    .order(sort, { ascending: order === 'asc' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (category) {
    query = query.eq('category_id', category);
  }
  if (brand) {
    query = query.eq('brand_id', brand);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function findById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function create(data: CreateProductDTO): Promise<Product> {
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return product;
}

export async function update(id: string, data: Partial<CreateProductDTO>): Promise<Product> {
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return product;
}

export async function remove(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function count(filters: Omit<ProductFilters, 'page' | 'limit' | 'sort' | 'order'>): Promise<number> {
  let query = supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }
  if (filters.brand) {
    query = query.eq('brand_id', filters.brand);
  }

  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}
```

```typescript
// modules/products/product.service.ts
import * as productRepository from './product.repository';
import { ProductFilters, CreateProductDTO } from './product.types';
import { AppError } from '../../middleware/errorHandler';

export async function getProducts(filters: ProductFilters) {
  const [products, total] = await Promise.all([
    productRepository.findMany(filters),
    productRepository.count(filters),
  ]);

  return {
    products,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getProductById(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
}

export async function createProduct(data: CreateProductDTO) {
  return productRepository.create(data);
}

export async function updateProduct(id: string, data: Partial<CreateProductDTO>) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return productRepository.update(id, data);
}

export async function deleteProduct(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return productRepository.remove(id);
}
```

```typescript
// modules/products/product.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as productService from './product.service';

export async function getProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = req.query as any;
    const result = await productService.getProducts(filters);

    res.json({
      success: true,
      data: result.products,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await productService.getProductById(req.params.id);
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

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}
```

```typescript
// modules/products/product.routes.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { validate } from '../../middleware/validate';
import { createProductSchema, queryParamsSchema } from './product.validation';
import * as productController from './product.controller';

const router = Router();

router.get(
  '/',
  validate(queryParamsSchema),
  productController.getProducts
);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  authenticate,
  adminOnly,
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  adminOnly,
  productController.deleteProduct
);

export { router as productRoutes };
```

---

## 2. Feature-Based Architecture (Frontend)

### File Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GoogleLogin.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useRegister.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── authService.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── app/
    ├── App.tsx
    ├── routes.tsx
    └── providers.tsx
```

---

## 3. Separation of Concerns

### Frontend Layers

```
┌─────────────────────────────────────────────────┐
│  UI Layer (Components)                          │
│  - Renders UI based on props and state          │
│  - Handles user interactions                    │
│  - No business logic                            │
├─────────────────────────────────────────────────┤
│  State Layer (Context/Hooks)                    │
│  - Manages application state                    │
│  - Coordinates between components               │
│  - Handles side effects                         │
├─────────────────────────────────────────────────┤
│  Data Layer (Services/API)                      │
│  - Makes HTTP requests                          │
│  - Transforms data                              │
│  - Handles caching and validation               │
├─────────────────────────────────────────────────┤
│  Persistence Layer (LocalStorage, Cookies)      │
│  - Stores user preferences                      │
│  - Caches data                                  │
│  - Manages tokens                               │
└─────────────────────────────────────────────────┘
```

### Backend Layers

```
┌─────────────────────────────────────────────────┐
│  Route Layer                                    │
│  - Defines API endpoints                        │
│  - Applies middleware                            │
│  - Validates input                              │
├─────────────────────────────────────────────────┤
│  Controller Layer                               │
│  - Handles HTTP request/response                │
│  - Calls service methods                        │
│  - Formats responses                            │
├─────────────────────────────────────────────────┤
│  Service Layer                                  │
│  - Contains business logic                      │
│  - Orchestrates repository calls                │
│  - Handles transactions                         │
├─────────────────────────────────────────────────┤
│  Repository Layer                               │
│  - Handles database queries                     │
│  - Maps data to/from models                     │
│  - Manages connections                           │
└─────────────────────────────────────────────────┘
```

---

## 4. Dependency Injection in TypeScript

```typescript
// Simple DI Container
class Container {
  private services = new Map<string, any>();

  register<T>(name: string, implementation: T) {
    this.services.set(name, implementation);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service as T;
  }
}

// Usage
const container = new Container();

// Register services
container.register('userRepository', new UserRepository());
container.register('emailService', new EmailService());
container.register('userService', new UserService(
  container.resolve('userRepository'),
  container.resolve('emailService')
));

// Resolve dependencies
const userService = container.resolve<UserService>('userService');
```

---

## 5. Component Composition Patterns

```tsx
// Compound Components
function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div className="flex border-b">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      className={cn("px-4 py-2", activeTab === value && "border-b-2 border-primary-500")}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ value, children }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return <div className="py-4">{children}</div>;
};

// Usage
<Tabs defaultValue="description">
  <Tabs.List>
    <Tabs.Tab value="description">Descripción</Tabs.Tab>
    <Tabs.Tab value="specs">Especificaciones</Tabs.Tab>
    <Tabs.Tab value="reviews">Reseñas</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="description">
    <p>Product description...</p>
  </Tabs.Panel>
  <Tabs.Panel value="specs">
    <SpecificationsTable specs={specs} />
  </Tabs.Panel>
</Tabs>
```

---

## 6. API Design Patterns

```typescript
// RESTful Resource Pattern
// GET    /api/v1/products          - List products
// GET    /api/v1/products/:id      - Get product
// POST   /api/v1/products          - Create product
// PUT    /api/v1/products/:id      - Update product
// DELETE /api/v1/products/:id      - Delete product

// Nested Resources
// GET    /api/v1/products/:id/reviews    - List reviews for product
// POST   /api/v1/products/:id/reviews    - Create review for product

// Query Parameters for Filtering
// GET /api/v1/products?category=electronics&price_min=100&price_max=500

// Consistent Response Format
interface ApiResponse<T> {
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
```

---

## 7. State Management Patterns

### Local State

```tsx
// Simple state
const [count, setCount] = useState(0);

// Complex state with reducer
interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}
```

### Global State (Context)

```tsx
// AuthContext.tsx
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| Module Pattern | Backend feature organization |
| Feature-Based | Frontend feature organization |
| Separation of Concerns | Layered architecture |
| Dependency Injection | Loose coupling |
| Compound Components | Flexible UI composition |
| RESTful Resources | API design |
| Context + Reducer | Global state management |
