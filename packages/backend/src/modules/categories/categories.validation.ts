import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
  image_url: z.string().url("Invalid URL").optional(),
  parent_id: z.string().uuid("Invalid category ID").optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  image_url: z.string().url("Invalid URL").optional().nullable(),
  parent_id: z.string().uuid("Invalid category ID").optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});
