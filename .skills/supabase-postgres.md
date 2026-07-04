# Supabase + PostgreSQL Best Practices

> Reference for database design, queries, and Supabase-specific patterns.

---

## 1. Connection Setup

```typescript
// config/database.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let supabase: SupabaseClient;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });
  }
  return supabase;
}

// For user-scoped operations (RLS applies)
export function getSupabaseForUser(accessToken: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
```

---

## 2. Query Patterns

### Basic CRUD

```typescript
// Create
const { data, error } = await supabase
  .from('products')
  .insert({ name: 'Laptop', price: 999.99, category_id: '...' })
  .select()
  .single();

// Read
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single();

// Update
const { data, error } = await supabase
  .from('products')
  .update({ price: 899.99 })
  .eq('id', productId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

### Filtering

```typescript
// Equals
.eq('status', 'active')

// Not equals
.neq('status', 'deleted')

// Greater than / Less than
.gt('price', 100)
.lt('price', 500)
.gte('price', 100)
.lte('price', 500)

// In
.in('status', ['active', 'pending'])

// Like
.ilike('name', '%laptop%')

// Is null
.is('deleted_at', null)

// Range
.range(0, 11) // First 12 items

// OR
.or('price.gt.100,price.lt.50')
```

### Ordering and Pagination

```typescript
// Order
.order('created_at', { ascending: false })
.order('price', { ascending: true })

// Pagination
const page = 1;
const limit = 12;
const from = (page - 1) * limit;
const to = from + limit - 1;

const { data, error, count } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });

// count is total rows matching filters
```

### Joins (Foreign Key Relations)

```typescript
// Single join
const { data } = await supabase
  .from('products')
  .select(`
    *,
    category:categories(id, name),
    brand:brands(id, name),
    images:product_images(id, url, alt)
  `)
  .eq('id', productId)
  .single();

// Nested join
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    user:users(id, first_name, last_name, email),
    items:order_items(
      *,
      product:products(id, name, price)
    )
  `)
  .eq('id', orderId)
  .single();
```

---

## 3. SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (self-referencing)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

---

## 4. Indexing Strategies

```sql
-- Primary lookup indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(is_active);

-- Composite indexes for common queries
CREATE INDEX idx_products_category_price ON products(category_id, price);
CREATE INDEX idx_products_category_created ON products(category_id, created_at DESC);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('spanish', name || ' ' || COALESCE(description, ''))
);

-- Order queries
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Cart queries
CREATE INDEX idx_cart_user ON cart_items(user_id);

-- Review queries
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Partial indexes for active records
CREATE INDEX idx_products_active ON products(created_at DESC)
  WHERE is_active = true;

CREATE INDEX idx_categories_active ON categories(name)
  WHERE is_active = true;
```

---

## 5. Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products: anyone can read, admins can manage
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders: users can view own, admins can view all
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Cart: users can manage own cart
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());
```

---

## 6. Full-Text Search

```typescript
// Search products with Spanish language support
const { data, error } = await supabase
  .from('products')
  .select('*')
  .textSearch('search', searchTerm, {
    type: 'websearch',
    config: 'spanish',
  });
```

```sql
-- Custom search function
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS SETOF products AS $$
  SELECT *
  FROM products
  WHERE
    to_tsvector('spanish', name || ' ' || COALESCE(description, ''))
    @@ plainto_tsquery('spanish', search_term)
    AND is_active = true
  ORDER BY ts_rank(
    to_tsvector('spanish', name || ' ' || COALESCE(description, '')),
    plainto_tsquery('spanish', search_term)
  ) DESC;
$$ LANGUAGE sql STABLE;
```

---

## 7. Realtime Subscriptions

```typescript
// Subscribe to order status changes
const channel = supabase
  .channel('order-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Order updated:', payload.new);
      handleOrderUpdate(payload.new);
    }
  )
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

---

## 8. Database Functions

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

---

## 9. Storage Buckets

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('products')
  .upload(`images/${productId}/${fileName}`, file, {
    contentType: 'image/jpeg',
    upsert: true,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('products')
  .getPublicUrl(`images/${productId}/${fileName}`);

// Delete image
await supabase.storage
  .from('products')
  .remove([`images/${productId}/${fileName}`]);
```

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policy
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );
```

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| `.eq()` | Exact match filtering |
| `.ilike()` | Partial text matching |
| `.textSearch()` | Full-text search |
| `.range()` | Pagination |
| `{ count: 'exact' }` | Get total count |
| `.select('*, ref(table)')` | Join related tables |
| RLS policies | Row-level security |
| Database functions | Auto-generated values |
