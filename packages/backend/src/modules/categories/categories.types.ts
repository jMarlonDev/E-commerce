export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
}
