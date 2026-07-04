import { supabase } from "../../config/database.js";
import type { CreateUserInput, UserResponse } from "../auth/auth.types.js";

const TABLE = "users";

export interface UserRow extends UserResponse {
  password_hash: string | null;
  is_active: boolean;
}

function toUserResponse(row: Record<string, unknown>): UserResponse {
  return {
    id: row.id as string,
    email: row.email as string,
    first_name: row.first_name as string,
    last_name: row.last_name as string,
    phone: row.phone as string | null,
    avatar_url: row.avatar_url as string | null,
    role: row.role as string,
    created_at: row.created_at as string,
  };
}

export const usersRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as UserRow | null;
  },

  async findByGoogleId(googleId: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("google_id", googleId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as UserRow | null;
  },

  async findById(id: string): Promise<UserRow> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as UserRow;
  },

  async create(userData: CreateUserInput & { password_hash: string }): Promise<UserResponse> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        email: userData.email,
        password_hash: userData.password_hash,
        first_name: userData.first_name,
        last_name: userData.last_name,
      })
      .select()
      .single();

    if (error) throw error;
    return toUserResponse(data as Record<string, unknown>);
  },

  async createFromGoogle(userData: {
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    google_id: string;
  }): Promise<UserResponse> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
        google_id: userData.google_id,
      })
      .select()
      .single();

    if (error) throw error;
    return toUserResponse(data as Record<string, unknown>);
  },

  async update(id: string, updates: Record<string, string | null>): Promise<UserRow> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as UserRow;
  },
};
