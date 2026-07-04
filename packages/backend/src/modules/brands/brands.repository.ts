import { supabase } from "../../config/database.js";
import type { Brand, CreateBrandInput, UpdateBrandInput } from "./brands.types.js";

const TABLE = "brands";

function toBrand(row: Record<string, unknown>): Brand {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    logo_url: row.logo_url as string | null,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string,
  };
}

export const brandsRepository = {
  async findAll(options: { includeInactive?: boolean } = {}): Promise<Brand[]> {
    let query = supabase.from(TABLE).select("*");
    if (!options.includeInactive) {
      query = query.eq("is_active", true);
    }
    const { data, error } = await query.order("name", { ascending: true });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(toBrand);
  },

  async findById(id: string): Promise<Brand | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toBrand(data as Record<string, unknown>) : null;
  },

  async findBySlug(slug: string): Promise<Brand | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? toBrand(data as Record<string, unknown>) : null;
  },

  async create(input: CreateBrandInput): Promise<Brand> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return toBrand(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateBrandInput): Promise<Brand> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return toBrand(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
