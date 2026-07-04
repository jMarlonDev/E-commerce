import { ApiError } from "../../shared/utils/ApiError.js";
import { categoriesRepository } from "./categories.repository.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.types.js";

export const categoriesService = {
  async findAll(includeInactive = false) {
    return categoriesRepository.findAll({ includeInactive });
  },

  async findById(id: string) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw ApiError.notFound("Category not found");
    }
    return category;
  },

  async findBySlug(slug: string) {
    const category = await categoriesRepository.findBySlug(slug);
    if (!category) {
      throw ApiError.notFound("Category not found");
    }
    return category;
  },

  async create(input: CreateCategoryInput) {
    const existing = await categoriesRepository.findBySlug(input.slug);
    if (existing) {
      throw ApiError.conflict("Category with this slug already exists");
    }

    if (input.parent_id) {
      const parent = await categoriesRepository.findById(input.parent_id);
      if (!parent) {
        throw ApiError.badRequest("Parent category not found");
      }
    }

    return categoriesRepository.create(input);
  },

  async update(id: string, input: UpdateCategoryInput) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Category not found");
    }

    if (input.slug) {
      const slugConflict = await categoriesRepository.findBySlug(input.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw ApiError.conflict("Category with this slug already exists");
      }
    }

    if (input.parent_id) {
      if (input.parent_id === id) {
        throw ApiError.badRequest("Category cannot be its own parent");
      }
      const parent = await categoriesRepository.findById(input.parent_id);
      if (!parent) {
        throw ApiError.badRequest("Parent category not found");
      }
    }

    return categoriesRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Category not found");
    }
    await categoriesRepository.delete(id);
  },
};
