import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
  short_description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
  compare_price: z.number().positive().optional(),
  cost_price: z.number().positive().optional(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  category_id: z.string().uuid("Invalid category ID").optional(),
  brand_id: z.string().uuid("Invalid brand ID").optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  short_description: z.string().max(500).optional().nullable(),
  price: z.number().positive().optional(),
  compare_price: z.number().positive().optional().nullable(),
  cost_price: z.number().positive().optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  barcode: z.string().max(100).optional().nullable(),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(0).optional(),
  weight: z.number().positive().optional().nullable(),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  brand_id: z.string().uuid("Invalid brand ID").optional().nullable(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});
