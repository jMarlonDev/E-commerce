export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: number | null;
  category_id: string | null;
  brand_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  weight?: number;
  category_id?: string;
  brand_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  price?: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  weight?: number;
  category_id?: string;
  brand_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_active?: boolean;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
