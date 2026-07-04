-- ============================================
-- E-Commerce Seed Data
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@ecommerce.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'admin');

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', 1),
('Clothing', 'clothing', 'Fashion and apparel', 2),
('Home & Garden', 'home-garden', 'Home and garden products', 3),
('Sports', 'sports', 'Sports and outdoor equipment', 4),
('Books', 'books', 'Books and literature', 5);

-- Brands
INSERT INTO brands (name, slug) VALUES
('TechBrand', 'techbrand'),
('FashionCo', 'fashionco'),
('HomeStyle', 'homestyle'),
('SportMax', 'sportmax');

-- Products
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, brand_id, is_featured) VALUES
('Wireless Headphones', 'wireless-headphones', 'Premium wireless headphones with noise cancellation', 'High-quality wireless headphones', 89.99, 129.99, 'ELEC-001', 50, (SELECT id FROM categories WHERE slug = 'electronics'), (SELECT id FROM brands WHERE slug = 'techbrand'), true),
('Smart Watch', 'smart-watch', 'Feature-rich smartwatch with health tracking', 'Track your health and fitness', 199.99, 249.99, 'ELEC-002', 30, (SELECT id FROM categories WHERE slug = 'electronics'), (SELECT id FROM brands WHERE slug = 'techbrand'), true),
('Cotton T-Shirt', 'cotton-t-shirt', 'Comfortable 100% cotton t-shirt', 'Soft and breathable cotton', 29.99, 39.99, 'CLO-001', 100, (SELECT id FROM categories WHERE slug = 'clothing'), (SELECT id FROM brands WHERE slug = 'fashionco'), false),
('Running Shoes', 'running-shoes', 'Lightweight running shoes for daily training', 'Comfortable running shoes', 79.99, 99.99, 'SPO-001', 40, (SELECT id FROM categories WHERE slug = 'sports'), (SELECT id FROM brands WHERE slug = 'sportmax'), true),
('Coffee Maker', 'coffee-maker', 'Automatic coffee maker with timer', 'Brew perfect coffee every morning', 49.99, 69.99, 'HOM-001', 25, (SELECT id FROM categories WHERE slug = 'home-garden'), (SELECT id FROM brands WHERE slug = 'homestyle'), false);

-- Product Images
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug = 'wireless-headphones'), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Wireless Headphones', 0, true),
((SELECT id FROM products WHERE slug = 'smart-watch'), 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Smart Watch', 0, true),
((SELECT id FROM products WHERE slug = 'cotton-t-shirt'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Cotton T-Shirt', 0, true),
((SELECT id FROM products WHERE slug = 'running-shoes'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Running Shoes', 0, true),
((SELECT id FROM products WHERE slug = 'coffee-maker'), 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Coffee Maker', 0, true);

-- Coupons
INSERT INTO coupons (code, type, value, minimum_purchase, usage_limit, starts_at, expires_at) VALUES
('WELCOME10', 'percentage', 10.00, 50.00, 100, NOW(), NOW() + INTERVAL '30 days'),
('SAVE20', 'fixed', 20.00, 100.00, 50, NOW(), NOW() + INTERVAL '60 days');

-- Banners
INSERT INTO banners (title, subtitle, image_url, position, sort_order) VALUES
('Summer Sale', 'Up to 50% off on selected items', 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200', 'hero', 1),
('New Arrivals', 'Check out our latest collection', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', 'hero', 2);

-- Store Settings
INSERT INTO store_settings (key, value) VALUES
('store_name', 'E-Commerce Store'),
('store_email', 'contact@ecommerce.com'),
('store_phone', '+52 55 1234 5678'),
('shipping_cost', '9.99'),
('free_shipping_threshold', '100.00'),
('tax_rate', '0.16');
