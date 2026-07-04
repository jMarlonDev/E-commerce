# UI/UX Patterns for E-Commerce

> Reference for building professional, accessible, and user-friendly e-commerce interfaces.

---

## 1. Responsive Design Patterns

### Mobile-First Grid

```tsx
// Product grid - responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Sidebar layout - stack on mobile, side-by-side on desktop
<div className="flex flex-col lg:flex-row gap-8">
  <aside className="w-full lg:w-64 shrink-0">
    <Filters />
  </aside>
  <main className="flex-1">
    <ProductGrid products={products} />
  </main>
</div>

// Sticky header
<header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
  <Navbar />
</header>

// Responsive typography
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">
  {product.name}
</h1>

// Responsive spacing
<section className="py-8 sm:py-12 lg:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
</section>
```

### Container Queries

```css
.product-card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .product-card-content {
    display: flex;
    gap: 1rem;
  }
}
```

---

## 2. Accessibility (ARIA)

### Semantic HTML

```tsx
// Good: Semantic elements
<nav aria-label="Navegación principal">
  <ul>
    <li><a href="/products">Productos</a></li>
    <li><a href="/categories">Categorías</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>{product.name}</h1>
    <section aria-label="Descripción">
      <p>{product.description}</p>
    </section>
  </article>
</main>

// Bad: Non-semantic
<div class="nav">
  <div class="nav-item">Productos</div>
</div>
```

### ARIA Labels

```tsx
// Button with no visible text
<button aria-label="Eliminar producto">
  <TrashIcon />
</button>

// Form input
<label htmlFor="email">Correo electrónico</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-error-500 text-sm">
    {errors.email.message}
  </p>
)}

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Agregar al carrito</h2>
</div>

// Loading state
<div aria-busy="true" aria-live="polite">
  <Spinner />
  <span className="sr-only">Cargando productos...</span>
</div>
```

### Keyboard Navigation

```tsx
// Focus management in modal
function Modal({ isOpen, onClose, children }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100"
          aria-label="Cerrar modal"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

// Skip to content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded"
>
  Saltar al contenido principal
</a>

<main id="main-content">
  {children}
</main>
```

---

## 3. Loading States

### Skeleton Loading

```tsx
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="aspect-square bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-6 bg-neutral-200 rounded w-1/3" />
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Inline loading
function Button({ isLoading, children, ...props }) {
  return (
    <button disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner className="w-4 h-4" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Page loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner className="w-8 h-8 text-primary-500 mx-auto mb-4" />
        <p className="text-neutral-600">Cargando...</p>
      </div>
    </div>
  );
}
```

### Progress Indicators

```tsx
// Upload progress
function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2.5">
      <div
        className="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
```

---

## 4. Empty States

```tsx
function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingCartIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        Tu carrito está vacío
      </h2>
      <p className="text-neutral-600 mb-6">
        Agrega productos para comenzar tu compra
      </p>
      <a
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
      >
        <ShoppingBagIcon className="w-5 h-5" />
        Explorar productos
      </a>
    </div>
  );
}

function EmptySearchResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <MagnifyingGlassIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        No se encontraron resultados
      </h2>
      <p className="text-neutral-600">
        No hay productos que coincidan con "{query}"
      </p>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="text-center py-16">
      <ClipboardDocumentListIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        Sin pedidos aún
      </h2>
      <p className="text-neutral-600 mb-6">
        Cuando realices un pedido, aparecerá aquí
      </p>
      <a
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
      >
        Comenzar a comprar
      </a>
    </div>
  );
}
```

---

## 5. Error States

```tsx
function ErrorMessage({ title, message, onRetry }: ErrorProps) {
  return (
    <div className="text-center py-16">
      <ExclamationTriangleIcon className="w-16 h-16 text-error-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        {title || 'Algo salió mal'}
      </h2>
      <p className="text-neutral-600 mb-6">
        {message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

// Error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          title="Error de aplicación"
          message="Algo salió mal. Por favor, recarga la página."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
```

---

## 6. Toast Notifications

```tsx
// Toast context
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-success-500" />,
    error: <XCircleIcon className="w-5 h-5 text-error-500" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-warning-500" />,
    info: <InformationCircleIcon className="w-5 h-5 text-primary-500" />,
  };

  return (
    <div className="flex items-start gap-3 bg-white rounded-lg shadow-lg border border-neutral-200 p-4 min-w-[300px] animate-slide-in">
      {icons[toast.type]}
      <div className="flex-1">
        <p className="font-medium text-neutral-900">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-neutral-600">{toast.message}</p>
        )}
      </div>
      <button onClick={onRemove} className="text-neutral-400 hover:text-neutral-600">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

// Usage
const { addToast } = useToast();

// Success
addToast({ type: 'success', title: 'Producto agregado al carrito' });

// Error
addToast({ type: 'error', title: 'Error', message: 'No se pudo agregar el producto' });
```

---

## 7. Modal Patterns

```tsx
function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-neutral-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}

// Product quick view modal
function ProductQuickView({ product, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} size="lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-2xl font-bold text-primary-500">
            ${product.price}
          </p>
          <p className="text-neutral-600">{product.description}</p>
          <Button className="w-full">Agregar al carrito</Button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## 8. Form Validation UX

```tsx
function FormField({ label, error, children, required }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Usage
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <FormField label="Nombre" error={errors.firstName?.message} required>
    <input
      {...register('firstName', { required: 'El nombre es requerido' })}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg border",
        errors.firstName ? "border-error-500" : "border-neutral-300"
      )}
    />
  </FormField>

  <FormField label="Correo electrónico" error={errors.email?.message} required>
    <input
      type="email"
      {...register('email', {
        required: 'El correo es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Correo electrónico inválido',
        },
      })}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg border",
        errors.email ? "border-error-500" : "border-neutral-300"
      )}
    />
  </FormField>

  <FormField label="Contraseña" error={errors.password?.message} required>
    <input
      type="password"
      {...register('password', {
        required: 'La contraseña es requerida',
        minLength: { value: 8, message: 'Mínimo 8 caracteres' },
      })}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg border",
        errors.password ? "border-error-500" : "border-neutral-300"
      )}
    />
  </FormField>

  <Button type="submit" isLoading={isSubmitting} className="w-full">
    Crear cuenta
  </Button>
</form>
```

---

## 9. Mobile-First Patterns

```tsx
// Bottom navigation for mobile
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-40">
  <div className="flex items-center justify-around py-2">
    <a href="/" className="flex flex-col items-center gap-1 text-neutral-600">
      <HomeIcon className="w-6 h-6" />
      <span className="text-xs">Inicio</span>
    </a>
    <a href="/products" className="flex flex-col items-center gap-1 text-neutral-600">
      <ShoppingBagIcon className="w-6 h-6" />
      <span className="text-xs">Productos</span>
    </a>
    <a href="/cart" className="flex flex-col items-center gap-1 text-neutral-600 relative">
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="text-xs">Carrito</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </a>
    <a href="/account" className="flex flex-col items-center gap-1 text-neutral-600">
      <UserIcon className="w-6 h-6" />
      <span className="text-xs">Cuenta</span>
    </a>
  </div>
</nav>

// Swipeable image gallery
function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Imagen ${index + 1}`}
              className="w-full h-auto shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-primary-500" : "bg-neutral-300"
            )}
            aria-label={`Imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 10. Spanish UI Conventions

```typescript
// Common Spanish UI text
const UI_TEXT = {
  // Navigation
  home: 'Inicio',
  products: 'Productos',
  categories: 'Categorías',
  cart: 'Carrito',
  account: 'Mi cuenta',
  orders: 'Mis pedidos',
  wishlist: 'Lista de deseos',
  logout: 'Cerrar sesión',

  // Product
  addToCart: 'Agregar al carrito',
  buyNow: 'Comprar ahora',
  viewDetails: 'Ver detalles',
  outOfStock: 'Agotado',
  inStock: 'En stock',
  reviews: 'Reseñas',
  relatedProducts: 'Productos relacionados',

  // Cart
  emptyCart: 'Tu carrito está vacío',
  subtotal: 'Subtotal',
  shipping: 'Envío',
  tax: 'Impuestos',
  total: 'Total',
  checkout: 'Ir a pagar',
  remove: 'Eliminar',
  quantity: 'Cantidad',

  // Checkout
  shippingInfo: 'Información de envío',
  paymentMethod: 'Método de pago',
  orderReview: 'Revisión del pedido',
  placeOrder: 'Realizar pedido',
  orderConfirmed: 'Pedido confirmado',

  // Auth
  login: 'Iniciar sesión',
  register: 'Crear cuenta',
  email: 'Correo electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmar contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  orContinueWith: 'O continúa con',

  // Common
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  search: 'Buscar',
  filter: 'Filtrar',
  sort: 'Ordenar',
  noResults: 'No se encontraron resultados',
  showMore: 'Ver más',
  showLess: 'Ver menos',
} as const;
```

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| Mobile-first grid | Responsive product layouts |
| Skeleton loading | Perceived performance |
| Empty states | Better UX when no data |
| Error boundaries | Graceful error handling |
| Toast notifications | Non-intrusive feedback |
| Keyboard navigation | Accessibility |
| ARIA labels | Screen reader support |
| Form validation UX | Clear error messages |
| Spanish UI text | Consistent localization |
