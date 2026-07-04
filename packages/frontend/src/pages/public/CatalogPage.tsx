import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProductFilters as Filters } from "@/types/product";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters: Filters = {
    search: searchParams.get("search") || undefined,
    category_id: searchParams.get("category_id") || undefined,
    brand_id: searchParams.get("brand_id") || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    is_featured: searchParams.get("is_featured") === "true" ? true : undefined,
    sort: searchParams.get("sort") || undefined,
    order: (searchParams.get("order") as "asc" | "desc") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 12,
  };

  const { products, meta, isLoading, error } = useProducts(filters);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && key !== "limit") {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  }, [setSearchParams]);

  const handlePageChange = (page: number) => {
    handleFilterChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPage = filters.page || 1;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
        <p className="text-gray-600 mt-1">
          {meta ? `${meta.total} productos encontrados` : "Cargando productos..."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>

        <aside className={`${showFilters ? "block" : "hidden"} lg:block lg:w-64 shrink-0`}>
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <EmptyState
              title="Error al cargar productos"
              description={error}
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No se encontraron productos"
              description="Intentá ajustar los filtros de búsqueda"
            />
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
