import axiosClient from "../axiosClient";
import type { ApiResponse } from "@/types/api";
import type { Product, ProductFilters } from "@/types/product";
import type { Category, Brand } from "@/types/category";

function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}

export const productsApi = {
  async getAll(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const query = buildQueryString(filters);
    const response = await axiosClient.get<ApiResponse<Product[]>>(`/products${query}`);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    const response = await axiosClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    const response = await axiosClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data;
  },

  async getFeatured(limit = 8): Promise<ApiResponse<Product[]>> {
    const response = await axiosClient.get<ApiResponse<Product[]>>(`/products/featured?limit=${limit}`);
    return response.data;
  },
};

export const categoriesApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const response = await axiosClient.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    const response = await axiosClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },
};

export const brandsApi = {
  async getAll(): Promise<ApiResponse<Brand[]>> {
    const response = await axiosClient.get<ApiResponse<Brand[]>>("/brands");
    return response.data;
  },
};
