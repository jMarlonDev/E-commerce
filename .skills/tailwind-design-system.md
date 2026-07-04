# Tailwind CSS 4 Design System Patterns

> Reference for building consistent, scalable UIs with Tailwind CSS 4.

---

## 1. Semantic Token Layer

### @theme Configuration

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-secondary-50: #fdf4ff;
  --color-secondary-500: #d946ef;
  --color-secondary-700: #a21caf;

  --color-success-50: #ecfdf5;
  --color-success-500: #10b981;
  --color-success-700: #047857;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-700: #b91c1c;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;

  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
  --spacing-128: 32rem;

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

---

## 2. Component Recipes

### Form Elements

```tsx
// Input
<input
  className={cn(
    "w-full px-4 py-2.5 rounded-lg",
    "bg-white border border-neutral-300",
    "text-neutral-900 placeholder:text-neutral-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    "disabled:bg-neutral-100 disabled:cursor-not-allowed",
    "transition-colors duration-200"
  )}
/>

// Select
<select
  className={cn(
    "w-full px-4 py-2.5 rounded-lg appearance-none",
    "bg-white border border-neutral-300",
    "text-neutral-900",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    "bg-[url('data:image/svg+xml,...')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5rem]"
  )}
/>

// Textarea
<textarea
  className={cn(
    "w-full px-4 py-2.5 rounded-lg resize-none",
    "bg-white border border-neutral-300",
    "text-neutral-900 placeholder:text-neutral-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
  )}
  rows={4}
/>

// Checkbox
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className={cn(
      "w-4 h-4 rounded border-neutral-300",
      "text-primary-500 focus:ring-primary-500"
    )}
  />
  <span className="text-sm text-neutral-700">Aceptar términos</span>
</label>
```

### Buttons

```tsx
// Primary Button
<button
  className={cn(
    "inline-flex items-center justify-center gap-2",
    "px-6 py-2.5 rounded-full",
    "bg-primary-500 text-white font-medium",
    "hover:bg-primary-600 active:bg-primary-700",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    "disabled:bg-neutral-300 disabled:cursor-not-allowed",
    "transition-all duration-200"
  )}
>
  Agregar al carrito
</button>

// Secondary Button
<button
  className={cn(
    "inline-flex items-center justify-center gap-2",
    "px-6 py-2.5 rounded-full",
    "bg-white text-neutral-700 font-medium border border-neutral-300",
    "hover:bg-neutral-50 active:bg-neutral-100",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    "transition-all duration-200"
  )}
>
  Ver detalles
</button>

// Ghost Button
<button
  className={cn(
    "inline-flex items-center justify-center gap-2",
    "px-4 py-2 rounded-lg",
    "text-neutral-600 font-medium",
    "hover:bg-neutral-100 active:bg-neutral-200",
    "transition-colors duration-200"
  )}
>
  Cancelar
</button>

// Icon Button
<button
  className={cn(
    "inline-flex items-center justify-center",
    "w-10 h-10 rounded-full",
    "text-neutral-500",
    "hover:bg-neutral-100 hover:text-neutral-700",
    "transition-colors duration-200"
  )}
  aria-label="Eliminar"
>
  <TrashIcon className="w-5 h-5" />
</button>
```

### Data Table

```tsx
<div className="overflow-hidden rounded-lg border border-neutral-200">
  <table className="min-w-full divide-y divide-neutral-200">
    <thead className="bg-neutral-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Producto
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Precio
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Stock
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-neutral-200">
      {products.map((product) => (
        <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {product.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            ${product.price}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
            {product.stock}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Navigation

```tsx
// Navbar
<nav className="bg-white shadow-sm border-b border-neutral-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
        <a href="/" className="text-xl font-bold text-primary-600">Tienda</a>
        <div className="hidden md:flex items-center gap-6">
          <a href="/products" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            Productos
          </a>
          <a href="/categories" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            Categorías
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-neutral-500 hover:text-neutral-700">
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Modal

```tsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

---

## 3. Responsive Patterns

```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Responsive container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Responsive typography
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">

// Responsive spacing
<section className="py-8 sm:py-12 lg:py-16">
```

---

## 4. Dark Mode

```css
/* Add to @theme if needed */
@variant dark (&:where(.dark, .dark *));
```

```tsx
// Component with dark mode
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
  <h1 className="text-neutral-900 dark:text-white">Título</h1>
  <p className="text-neutral-600 dark:text-neutral-400">Descripción</p>
</div>

// Card with dark mode
<div className={cn(
  "bg-white dark:bg-neutral-800",
  "border border-neutral-200 dark:border-neutral-700",
  "rounded-lg shadow-sm"
)}>
  content
</div>
```

---

## 5. Animation Patterns

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-in: slide-in 0.3s ease-out;
  --animate-scale-in: scale-in 0.2s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-in {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}
```

```tsx
// Animated card
<div className="animate-fade-in">
  <ProductCard product={product} />
</div>

// Hover transitions
<button className="transition-all duration-200 hover:scale-105 active:scale-95">

// Skeleton loading animation
<div className="animate-pulse bg-neutral-200 rounded h-4 w-full" />
```

---

## 6. Utility Composition with cn()

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage: conditional classes
<button
  className={cn(
    "px-4 py-2 rounded-lg font-medium transition-colors",
    isActive
      ? "bg-primary-500 text-white"
      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
  )}
/>

// Usage: variant pattern
interface BadgeProps {
  variant?: "primary" | "success" | "error" | "warning";
}

const badgeVariants = {
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  error: "bg-error-100 text-error-700",
  warning: "bg-warning-100 text-warning-700",
};

function Badge({ variant = "primary", children }: BadgeProps) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", badgeVariants[variant])}>
      {children}
    </span>
  );
}
```
