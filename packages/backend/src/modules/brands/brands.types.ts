export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  logo_url?: string;
  is_active?: boolean;
}

export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  logo_url?: string;
  is_active?: boolean;
}
