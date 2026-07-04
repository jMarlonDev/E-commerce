import { supabase } from "../../config/database.js";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "./categories.types.js";

const TABLE = "categories";

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    image_url: row.image_url as string | null,
    parent_id: row.parent_id as string | null,
    is_active: row.is_active as boolean,
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
  };
}

export const categoriesRepository = {
  async findAll(options: { includeInactive?: boolean } = {}): Promise<Category[]> {
    let query = supabase.from(TABLE).select("*");
    if (!options.includeInactive) {
      query = query.eq("is_active", true);
    }
    const { data, error } = await query.order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(toCategory);
  },

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toCategory(data as Record<string, unknown>) : null;
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toCategory(data as Record<string, unknown>) : null;
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return toCategory(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toCategory(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
