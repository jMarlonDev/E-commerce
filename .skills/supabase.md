# Supabase General Patterns

> Reference for Supabase project setup, configuration, and best practices.

---

## 1. Project Setup

### Create Project

1. Go to https://supabase.com
2. Sign up with GitHub or email
3. Click "New Project"
4. Enter project name, database password, region
5. Wait for project to initialize

### Get Credentials

1. Go to Project Settings → API
2. Copy **Project URL** (used in frontend)
3. Copy **service_role** key (used in backend, keep secret!)
4. Copy **anon** key (used in frontend)

---

## 2. Environment Variables

```env
# Frontend (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

---

## 3. Client Initialization

### Frontend (React)

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Backend (Node.js)

```typescript
// config/database.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// For admin operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// For user-scoped operations (RLS applies)
export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
```

---

## 4. Auth Integration

### Email/Password Auth

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'Juan',
      last_name: 'Pérez',
    },
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

### Google OAuth

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Auth State Listener

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## 5. Database Schema Design

### Naming Conventions

```sql
-- Tables: snake_case, plural
CREATE TABLE user_addresses (...)   -- NOT UserAddress
CREATE TABLE order_items (...)      -- NOT OrderItem

-- Columns: snake_case
CREATE TABLE products (
  id UUID PRIMARY KEY,              -- NOT product_id
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes: idx_table_column
CREATE INDEX idx_products_category ON products(category_id);

-- Foreign keys: fk_table_reference
ALTER TABLE products ADD CONSTRAINT fk_products_category
  FOREIGN KEY (category_id) REFERENCES categories(id);
```

### Common Patterns

```sql
-- Soft delete
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMPTZ;
CREATE INDEX idx_products_not_deleted ON products(id) WHERE deleted_at IS NULL;

-- Audit trail
ALTER TABLE products ADD COLUMN created_by UUID REFERENCES users(id);
ALTER TABLE products ADD COLUMN updated_by UUID REFERENCES users(id);

-- JSONB for flexible data
ALTER TABLE products ADD COLUMN metadata JSONB DEFAULT '{}';

-- Array columns
ALTER TABLE products ADD COLUMN tags TEXT[] DEFAULT '{}';
```

---

## 6. Edge Functions

### Create Function

```typescript
// supabase/functions/process-order/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { orderId } = await req.json();

  // Process order logic
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'confirmed' })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Call from Frontend

```typescript
const { data, error } = await supabase.functions.invoke('process-order', {
  body: { orderId: '...' },
});
```

---

## 7. Realtime

### Subscribe to Changes

```typescript
// Listen for new orders
const channel = supabase
  .channel('new-orders')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('New order:', payload.new);
    }
  )
  .subscribe();

// Listen for specific record changes
const channel = supabase
  .channel('order-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`,
    },
    (payload) => {
      console.log('Order updated:', payload.new);
    }
  )
  .subscribe();

// Broadcast (client-to-client)
const channel = supabase.channel('room1');

channel.on('broadcast', { event: 'cursor-move' }, (payload) => {
  console.log('Cursor moved:', payload);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.send({
      type: 'broadcast',
      event: 'cursor-move',
      payload: { x: 100, y: 200 },
    });
  }
});
```

### Presence (Online Status)

```typescript
const channel = supabase.channel('online-users', {
  config: { presence: { key: userId } },
});

channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  console.log('Online users:', state);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ user_id: userId, online_at: new Date().toISOString() });
  }
});
```

---

## 8. File Storage

### Upload Files

```typescript
// Upload image
const file = event.target.files[0];
const filePath = `products/${Date.now()}-${file.name}`;

const { data, error } = await supabase.storage
  .from('images')
  .upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl(filePath);
```

### Storage Policies

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 9. Dashboard Usage

### Useful Dashboard Features

- **Table Editor**: Visual database management
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users, sessions
- **Storage**: Manage files and buckets
- **Edge Functions**: Deploy and test functions
- **Logs**: View API and auth logs
- **API Docs**: Auto-generated from schema

### Monitoring Queries

```sql
-- Active users in last 24 hours
SELECT COUNT(DISTINCT user_id) as active_users
FROM orders
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Popular products
SELECT p.name, COUNT(oi.id) as order_count
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY order_count DESC
LIMIT 10;

-- Revenue by category
SELECT c.name, SUM(oi.total_price) as revenue
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY c.id, c.name
ORDER BY revenue DESC;
```

---

## Quick Reference

| Task | Command/Pattern |
|------|-----------------|
| Create client | `createClient(url, key)` |
| Sign up | `supabase.auth.signUp({email, password})` |
| Sign in | `supabase.auth.signInWithPassword({email, password})` |
| Query data | `supabase.from('table').select('*')` |
| Insert data | `supabase.from('table').insert({...})` |
| Update data | `supabase.from('table').update({...}).eq('id', id)` |
| Delete data | `supabase.from('table').delete().eq('id', id)` |
| Upload file | `supabase.storage.from('bucket').upload(path, file)` |
| Subscribe | `supabase.channel('name').on('postgres_changes', {...}).subscribe()` |
