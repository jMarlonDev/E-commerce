# Database Schema Documentation

## Overview

PostgreSQL database managed via Supabase.

## Tables

### users
User accounts with authentication data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Bcrypt password hash |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| phone | VARCHAR(20) | Phone number |
| avatar_url | TEXT | Profile picture URL |
| role | VARCHAR(20) | 'customer' or 'admin' |
| is_active | BOOLEAN | Account active status |
| google_id | VARCHAR(255) | Google OAuth ID |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

### categories
Product categories with self-referencing for subcategories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Category name |
| slug | VARCHAR(100) | URL slug |
| description | TEXT | Category description |
| image_url | TEXT | Category image |
| parent_id | UUID | Parent category (self-ref) |
| is_active | BOOLEAN | Active status |
| sort_order | INTEGER | Display order |

### products
Product catalog.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Product name |
| slug | VARCHAR(255) | URL slug |
| description | TEXT | Full description |
| short_description | VARCHAR(500) | Short description |
| price | DECIMAL(10,2) | Current price |
| compare_price | DECIMAL(10,2) | Original price (for discounts) |
| cost_price | DECIMAL(10,2) | Cost price (admin) |
| sku | VARCHAR(100) | Stock keeping unit |
| stock_quantity | INTEGER | Current stock |
| category_id | UUID | Category reference |
| brand_id | UUID | Brand reference |
| is_active | BOOLEAN | Active status |
| is_featured | BOOLEAN | Featured status |
| average_rating | DECIMAL(3,2) | Average review rating |
| review_count | INTEGER | Total reviews |

### orders
Customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_number | VARCHAR(50) | Unique order number |
| user_id | UUID | Customer reference |
| status | VARCHAR(30) | pending/processing/shipped/delivered/cancelled |
| subtotal | DECIMAL(10,2) | Subtotal |
| shipping_cost | DECIMAL(10,2) | Shipping cost |
| tax | DECIMAL(10,2) | Tax amount |
| total | DECIMAL(10,2) | Total |
| payment_method | VARCHAR(50) | Payment method |
| payment_status | VARCHAR(30) | pending/paid/failed/refunded |

## Relationships

```
users ─┬── user_addresses (1:N)
       ├── orders (1:N)
       ├── cart_items (1:N)
       ├── reviews (1:N)
       └── wishlists (1:N)

categories ─┬── products (1:N)
            └── categories (self-ref)

brands ──── products (1:N)

products ─┬── product_images (1:N)
          ├── product_variants (1:N)
          ├── product_specifications (1:N)
          └── reviews (1:N)

orders ──── order_items (1:N)
```

## Migrations

All migrations are in `packages/backend/src/database/migrations/`.

To run migrations:
1. Go to Supabase SQL Editor
2. Run schema.sql
3. Run seeds.sql for sample data
