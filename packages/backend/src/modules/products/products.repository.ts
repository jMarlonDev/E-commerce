import { supabase } from "../../config/database.js";
import { paginate, paginationMeta } from "../../shared/utils/paginate.js";
import type { Product, CreateProductInput, UpdateProductInput, ProductFilters } from "./products.types.js";

const TABLE = "products";

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    short_description: row.short_description as string | null,
    price: row.price as number,
    compare_price: row.compare_price as number | null,
    cost_price: row.cost_price as number | null,
    sku: row.sku as string | null,
    barcode: row.barcode as string | null,
    stock_quantity: row.stock_quantity as number,
    low_stock_threshold: row.low_stock_threshold as number,
    weight: row.weight as number | null,
    category_id: row.category_id as string | null,
    brand_id: row.brand_id as string | null,
    is_active: row.is_active as boolean,
    is_featured: row.is_featured as boolean,
    average_rating: row.average_rating as number,
    review_count: row.review_count as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export const productsRepository = {
  async findAll(filters: ProductFilters = {}) {
    const { page, limit, offset } = paginate(filters.page, filters.limit);

    let query = supabase.from(TABLE).select("*", { count: "exact" });

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    if (filters.brand_id) {
      query = query.eq("brand_id", filters.brand_id);
    }

    if (filters.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }

    if (filters.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    } else {
      query = query.eq("is_active", true);
    }

    const sortField = filters.sort || "created_at";
    const sortOrder = filters.order === "asc";
    query = query.order(sortField, { ascending: sortOrder });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      products: (data as Record<string, unknown>[]).map(toProduct),
      meta: paginationMeta(count || 0, page, limit),
    };
  },

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toProduct(data as Record<string, unknown>) : null;
  },

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toProduct(data as Record<string, unknown>) : null;
  },

  async findFeatured(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(toProduct);
  },

  async create(input: CreateProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return toProduct(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toProduct(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
