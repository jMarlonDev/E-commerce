import { ApiError } from "../../shared/utils/ApiError.js";
import { brandsRepository } from "./brands.repository.js";
import type { CreateBrandInput, UpdateBrandInput } from "./brands.types.js";

export const brandsService = {
  async findAll(includeInactive = false) {
    return brandsRepository.findAll({ includeInactive });
  },

  async findById(id: string) {
    const brand = await brandsRepository.findById(id);
    if (!brand) {
      throw ApiError.notFound("Brand not found");
    }
    return brand;
  },

  async findBySlug(slug: string) {
    const brand = await brandsRepository.findBySlug(slug);
    if (!brand) {
      throw ApiError.notFound("Brand not found");
    }
    return brand;
  },

  async create(input: CreateBrandInput) {
    const existing = await brandsRepository.findBySlug(input.slug);
    if (existing) {
      throw ApiError.conflict("Brand with this slug already exists");
    }
    return brandsRepository.create(input);
  },

  async update(id: string, input: UpdateBrandInput) {
    const existing = await brandsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Brand not found");
    }

    if (input.slug) {
      const slugConflict = await brandsRepository.findBySlug(input.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw ApiError.conflict("Brand with this slug already exists");
      }
    }

    return brandsRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await brandsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Brand not found");
    }
    await brandsRepository.delete(id);
  },
};
