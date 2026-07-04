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

export interface ProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
