# Clean Code Principles for TypeScript

> Practical guide to writing maintainable, readable TypeScript code.

---

## 1. Meaningful Naming

### Variables and Functions

```typescript
// Bad
const d = new Date();
const x = users.filter(u => u.a > 18);
function calc(a: number, b: number) { return a * b; }

// Good
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
function calculateTotalPrice(quantity: number, unitPrice: number) {
  return quantity * unitPrice;
}
```

### Boolean Variables

```typescript
// Bad
const isActive = true;
const hasItems = false;

// Good: Use is, has, can, should prefixes
const isUserActive = true;
const hasItemsInCart = false;
const canEditPost = true;
const shouldRedirect = false;
```

### Constants

```typescript
// Bad
const MAX = 100;
const URL = 'https://api.example.com';

// Good
const MAX_RETRY_COUNT = 100;
const API_BASE_URL = 'https://api.example.com';
const TAX_RATE = 0.16;
```

---

## 2. Small Functions

```typescript
// Bad: Function does too many things
function processOrder(order: Order) {
  // Validate order
  if (!order.items.length) throw new Error('No items');
  if (order.total <= 0) throw new Error('Invalid total');

  // Calculate discounts
  let discount = 0;
  if (order.coupon) {
    if (order.coupon.type === 'percentage') {
      discount = order.total * (order.coupon.value / 100);
    } else {
      discount = order.coupon.value;
    }
  }

  // Apply tax
  const tax = (order.total - discount) * 0.16;

  // Create order record
  const orderRecord = {
    ...order,
    discount,
    tax,
    finalTotal: order.total - discount + tax,
  };

  // Save to database
  db.orders.create(orderRecord);

  // Send confirmation email
  sendEmail(order.userEmail, 'Order confirmed', orderRecord);

  // Update inventory
  order.items.forEach(item => {
    db.products.updateStock(item.productId, -item.quantity);
  });
}

// Good: Small, focused functions
function validateOrder(order: Order): void {
  if (!order.items.length) throw new AppError(400, 'Order must have items');
  if (order.total <= 0) throw new AppError(400, 'Invalid order total');
}

function calculateDiscount(total: number, coupon?: Coupon): number {
  if (!coupon) return 0;
  if (coupon.type === 'percentage') {
    return total * (coupon.value / 100);
  }
  return coupon.value;
}

function calculateTax(subtotal: number, discount: number): number {
  return (subtotal - discount) * TAX_RATE;
}

function calculateOrderTotal(order: Order, discount: number, tax: number) {
  return order.total - discount + tax;
}

async function processOrder(order: Order): Promise<OrderResult> {
  validateOrder(order);

  const discount = calculateDiscount(order.total, order.coupon);
  const tax = calculateTax(order.total, discount);
  const finalTotal = calculateOrderTotal(order, discount, tax);

  const orderRecord = await createOrderRecord(order, discount, tax, finalTotal);
  await updateInventory(order.items);
  await sendOrderConfirmation(order.userEmail, orderRecord);

  return orderRecord;
}
```

---

## 3. Single Level of Abstraction

```typescript
// Bad: Mixed abstraction levels
function processUserRegistration(data: any) {
  const email = data.email.toLowerCase().trim();
  const hashedPassword = bcrypt.hashSync(data.password, 10);
  const user = db.users.create({ email, password: hashedPassword });
  const token = jwt.sign({ userId: user.id }, SECRET);
  sendWelcomeEmail(user.email);
  return { user, token };
}

// Good: Same abstraction level
function processUserRegistration(data: RegisterData): Promise<AuthResult> {
  const normalizedData = normalizeRegistrationData(data);
  const hashedPassword = hashPassword(normalizedData.password);
  const user = createUser(normalizedData, hashedPassword);
  const tokens = generateAuthTokens(user);
  sendWelcomeEmail(user.email);
  return { user, tokens };
}

function normalizeRegistrationData(data: RegisterData) {
  return {
    email: data.email.toLowerCase().trim(),
    password: data.password,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
  };
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function generateAuthTokens(user: User) {
  return {
    accessToken: jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    ),
    refreshToken: jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    ),
  };
}
```

---

## 4. DRY (Don't Repeat Yourself)

### Extract Common Logic

```typescript
// Bad: Repeated validation
function createProduct(data: any) {
  if (!data.name) throw new Error('Name is required');
  if (data.name.length < 3) throw new Error('Name too short');
  if (data.price <= 0) throw new Error('Invalid price');
  // ...
}

function updateProduct(id: string, data: any) {
  if (!data.name) throw new Error('Name is required');
  if (data.name.length < 3) throw new Error('Name too short');
  if (data.price <= 0) throw new Error('Invalid price');
  // ...
}

// Good: Shared validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(10).optional(),
});

function validateProductData(data: unknown) {
  return productSchema.parse(data);
}

function createProduct(data: unknown) {
  const validated = validateProductData(data);
  return db.products.create(validated);
}

function updateProduct(id: string, data: unknown) {
  const validated = validateProductData(data);
  return db.products.update(id, validated);
}
```

### Extract Repeated UI Patterns

```typescript
// Bad: Repeated card structure
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <img src={product.image} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-primary-500 font-bold">${product.price}</p>
      </div>
    </div>
  );
}

function CategoryCard({ category }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <img src={category.image} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900">{category.name}</h3>
        <p className="text-neutral-500">{category.productCount} productos</p>
      </div>
    </div>
  );
}

// Good: Shared Card component
function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Image src={product.image} alt={product.name} />
      <Card.Content>
        <Card.Title>{product.name}</Card.Title>
        <Card.Description className="text-primary-500 font-bold">
          ${product.price}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}
```

---

## 5. SOLID Principles

### Single Responsibility

```typescript
// Bad: Class does too many things
class UserService {
  createUser(data: any) { /* ... */ }
  sendEmail(email: string) { /* ... */ }
  generateReport(users: User[]) { /* ... */ }
  validateData(data: any) { /* ... */ }
}

// Good: Each class has one responsibility
class UserValidator {
  validate(data: unknown): CreateUserDTO { /* ... */ }
}

class UserRepository {
  create(data: CreateUserDTO): Promise<User> { /* ... */ }
  findById(id: string): Promise<User | null> { /* ... */ }
}

class EmailService {
  sendWelcomeEmail(email: string): Promise<void> { /* ... */ }
}

class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailService
  ) {}

  async createUser(data: unknown): Promise<User> {
    const validated = this.validator.validate(data);
    const user = await this.repository.create(validated);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

### Open/Closed Principle

```typescript
// Bad: Must modify existing code to add new discount types
function calculateDiscount(order: Order, coupon: Coupon): number {
  if (coupon.type === 'percentage') {
    return order.total * (coupon.value / 100);
  }
  if (coupon.type === 'fixed') {
    return coupon.value;
  }
  if (coupon.type === 'buy_x_get_y') {
    // New logic
  }
  return 0;
}

// Good: Open for extension, closed for modification
interface DiscountStrategy {
  calculate(order: Order, coupon: Coupon): number;
}

class PercentageDiscount implements DiscountStrategy {
  calculate(order: Order, coupon: Coupon): number {
    return order.total * (coupon.value / 100);
  }
}

class FixedDiscount implements DiscountStrategy {
  calculate(order: Order, coupon: Coupon): number {
    return coupon.value;
  }
}

class BuyXGetYDiscount implements DiscountStrategy {
  calculate(order: Order, coupon: Coupon): number {
    // New discount logic
    return 0;
  }
}

const discountStrategies: Record<string, DiscountStrategy> = {
  percentage: new PercentageDiscount(),
  fixed: new FixedDiscount(),
  buy_x_get_y: new BuyXGetYDiscount(),
};

function calculateDiscount(order: Order, coupon: Coupon): number {
  const strategy = discountStrategies[coupon.type];
  return strategy ? strategy.calculate(order, coupon) : 0;
}
```

---

## 6. KISS (Keep It Simple)

```typescript
// Bad: Overengineered
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function pipe<A, B>(f1: (a: A) => B): (a: A) => B;
function pipe<A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C;
function pipe(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}

// Good: Simple and clear
async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await db.products.findById(id);
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}
```

---

## 7. Error Handling

```typescript
// Bad: Swallowing errors
async function getUser(id: string) {
  try {
    return await db.users.findById(id);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Good: Proper error handling
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

async function getUser(id: string): Promise<User> {
  const user = await db.users.findById(id);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
}

// In controller
async function getUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUser(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
```

---

## 8. Comments Policy

```typescript
// Bad: Unnecessary comments
// Get the user
const user = await getUser(id);

// Check if user exists
if (!user) {
  throw new Error('Not found');
}

// Good: Self-documenting code
const user = await getUserById(userId);

if (!user) {
  throw new AppError(404, 'User not found');
}

// Good: Explain WHY, not WHAT
// Tax rate is 16% per Mexican tax law (IVA)
const TAX_RATE = 0.16;

// Retry connection because Supabase may be cold starting
await connectWithRetry(maxRetries = 3);
```

---

## Quick Reference

| Principle | Application |
|-----------|-------------|
| Meaningful names | Use descriptive variable/function names |
| Small functions | Functions < 30 lines, one responsibility |
| Single abstraction | Keep code at same abstraction level |
| DRY | Extract repeated logic |
| SOLID | Single responsibility, open/closed |
| KISS | Choose simple solutions |
| Error handling | Throw specific errors, handle at boundaries |
| Comments | Explain WHY, not WHAT |
