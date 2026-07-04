-- ============================================
-- E-Commerce Database Schema
-- PostgreSQL / Supabase
-- ============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_active BOOLEAN DEFAULT true,
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- USER ADDRESSES
-- ============================================
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'Home',
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Mexico',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- CATEGORIES (self-referencing for subcategories)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- BRANDS
-- ============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  weight DECIMAL(8, 2),
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- PRODUCT VARIANTS (colors, sizes)
-- ============================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('color', 'size')),
  value VARCHAR(100) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- PRODUCT SPECIFICATIONS
-- ============================================
CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0
);
-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  title VARCHAR(255),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- CART ITEMS
-- ============================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);
-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    )
  ),
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(30) DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'refunded')
  ),
  shipping_street VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  variant_name VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL
);
-- ============================================
-- WISHLISTS
-- ============================================
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
-- ============================================
-- COUPONS
-- ============================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10, 2) NOT NULL,
  minimum_purchase DECIMAL(10, 2) DEFAULT 0,
  maximum_discount DECIMAL(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- BANNERS
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  image_url TEXT NOT NULL,
  link_url TEXT,
  position VARCHAR(50) DEFAULT 'hero',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- STORE SETTINGS
-- ============================================
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);