import { ApiError } from "../../shared/utils/ApiError.js";
import { productsRepository } from "./products.repository.js";
import type { CreateProductInput, UpdateProductInput, ProductFilters } from "./products.types.js";

export const productsService = {
  async findAll(filters: ProductFilters = {}) {
    return productsRepository.findAll(filters);
  },

  async findById(id: string) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return product;
  },

  async findBySlug(slug: string) {
    const product = await productsRepository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return product;
  },

  async findFeatured(limit = 8) {
    return productsRepository.findFeatured(limit);
  },

  async create(input: CreateProductInput) {
    const existing = await productsRepository.findBySlug(input.slug);
    if (existing) {
      throw ApiError.conflict("Product with this slug already exists");
    }

    if (input.sku) {
      const products = await productsRepository.findAll({ search: input.sku, is_active: true });
      const skuExists = products.products.some((p) => p.sku === input.sku);
      if (skuExists) {
        throw ApiError.conflict("Product with this SKU already exists");
      }
    }

    return productsRepository.create(input);
  },

  async update(id: string, input: UpdateProductInput) {
    const existing = await productsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Product not found");
    }

    if (input.slug) {
      const slugConflict = await productsRepository.findBySlug(input.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw ApiError.conflict("Product with this slug already exists");
      }
    }

    return productsRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await productsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Product not found");
    }
    await productsRepository.delete(id);
  },
};
