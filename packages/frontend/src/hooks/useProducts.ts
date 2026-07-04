import { useState, useEffect, useCallback, useRef } from "react";
import { productsApi } from "@/api/endpoints/products";
import type { Product, ProductFilters } from "@/types/product";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseProductsResult {
  products: Product[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string;
  refetch: () => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const currentFilters = filtersRef.current;

    async function fetchProducts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await productsApi.getAll(currentFilters);
        if (!cancelled) {
          if (response.success && response.data) {
            setProducts(response.data);
            setMeta(response.meta || null);
          } else {
            setError(response.error?.message || "Error al cargar productos");
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Error al cargar productos";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.category_id, filters.brand_id, filters.min_price, filters.max_price, filters.sort, filters.order, filters.page, filters.limit, refreshKey]);

  return { products, meta, isLoading, error, refetch };
}
