import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format"),
  logo_url: z.string().url("Invalid URL").optional(),
  is_active: z.boolean().optional(),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  logo_url: z.string().url("Invalid URL").optional().nullable(),
  is_active: z.boolean().optional(),
});
