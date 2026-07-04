# React Performance Optimization Best Practices

> Reference for high-performance React applications based on Vercel patterns.

---

## 1. Eliminate Waterfalls

Waterfalls occur when sequential async operations block rendering unnecessarily.

### Async-Parallel: Run Independent Fetches Simultaneously

```tsx
// Bad: Sequential waterfall
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const comments = await fetchComments(id);

// Good: Parallel fetching
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
]);
```

### Async-Dependencies: Declare Data Dependencies Explicitly

```tsx
// Bad: Implicit dependency chain
async function UserProfile({ userId }) {
  const user = await fetchUser(userId);
  const orders = await fetchOrders(user.id); // depends on user

  // Good: Use startTransition or sequential with dependency
  const user = await fetchUser(userId);
  const orders = await fetchOrders(user.id); // clear dependency
}
```

### Async-Suspense-Boundaries: Isolate Loading States

```tsx
// Good: Granular suspense boundaries
function ProductPage({ id }) {
  return (
    <div>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={id} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={id} />
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts id={id} />
      </Suspense>
    </div>
  );
}
```

---

## 2. Bundle Optimization

### Dynamic Imports (Code Splitting)

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const CheckoutFlow = lazy(() => import('./pages/Checkout'));
const ProductGallery = lazy(() => import('./components/product/Gallery'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
      </Routes>
    </Suspense>
  );
}
```

### Defer Third-Party Scripts

```tsx
// Bad: Blocking third-party script
<script src="https://analytics.example.com/script.js" />

// Good: Load after interaction or on idle
useEffect(() => {
  const timer = setTimeout(() => {
    const script = document.createElement('script');
    script.src = 'https://analytics.example.com/script.js';
    script.async = true;
    document.body.appendChild(script);
  }, 3000);

  return () => clearTimeout(timer);
}, []);
```

---

## 3. Server Performance

### Cache Strategies

```tsx
// Next.js route handler with revalidation
export async function GET(request: Request) {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  return Response.json(await products.json());
}
```

### Deduplication

```tsx
// Deduplicate identical requests
const productCache = new Map<string, Promise<Product>>();

async function getProduct(id: string): Promise<Product> {
  if (!productCache.has(id)) {
    productCache.set(id, fetchProduct(id));
  }
  return productCache.get(id)!;
}
```

---

## 4. Client Data Fetching

### SWR Pattern

```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60000, // Dedup for 60s
  });

  if (isLoading) return <ProductGridSkeleton />;
  if (error) return <ErrorMessage />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Dedup Client Requests

```tsx
// Custom hook with deduplication
function useProduct(id: string) {
  return useSWR(`/api/products/${id}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnMount: true,
  });
}
```

---

## 5. Re-render Optimization

### React.memo for Pure Components

```tsx
const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <button onClick={() => onSelect(product.id)}>Seleccionar</button>
    </div>
  );
});
```

### useMemo for Expensive Calculations

```tsx
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) return false;
      }
      if (filters.brand && product.brand !== filters.brand) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useCallback for Stable References

```tsx
function ProductList({ products }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
```

### Derived State Pattern

```tsx
// Bad: Storing derived state
function Checkout({ items }) {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTax(newSubtotal * 0.16);
  }, [items]);
}

// Good: Derive during render
function Checkout({ items }) {
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return <div>Total: {formatPrice(total)}</div>;
}
```

---

## 6. Rendering Performance

### content-visibility for Virtual Lists

```tsx
function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

### Hoist Static JSX

```tsx
// Bad: JSX recreated every render
function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
      </div>
    </header>
  );
}

// Good: Constant JSX outside component
const HEADER_CONTENT = (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
    </div>
  </header>
);

function Header() {
  return HEADER_CONTENT;
}
```

---

## 7. JS Performance

### Batch DOM Reads/Writes

```tsx
// Bad: Interleaved reads/writes cause layout thrashing
function updateLayout(element, offset) {
  const height = element.offsetHeight; // Read
  element.style.height = `${height + offset}px`; // Write
  const width = element.offsetWidth; // Read
  element.style.width = `${width + offset}px`; // Write
}

// Good: Batch reads, then batch writes
function updateLayout(element, offset) {
  const height = element.offsetHeight;
  const width = element.offsetWidth;

  requestAnimationFrame(() => {
    element.style.height = `${height + offset}px`;
    element.style.width = `${width + offset}px`;
  });
}
```

### Index Maps for Key Prop

```tsx
// Bad: Using index as key
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// Good: Use stable unique identifier
{items.map((item) => (
  <Item key={item.id} item={item} />
))}
```

### Early Exit Pattern

```tsx
function ProductPage({ product, isLoading, error }) {
  if (isLoading) return <ProductSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!product) return <NotFound />;

  // Only render when data is ready
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

---

## Quick Reference Checklist

| Pattern | When to Use |
|---------|-------------|
| `React.memo` | Child receives same props frequently |
| `useMemo` | Expensive computation on every render |
| `useCallback` | Passing functions to memoized children |
| `Suspense` | Async data loading boundaries |
| `lazy()` | Route-based or heavy component code splitting |
| `content-visibility` | Long lists with off-screen items |
| Early exit | Reduce nesting and improve readability |
| Derived state | Compute values from props/state instead of syncing |
