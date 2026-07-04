import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { categoriesApi, brandsApi } from "@/api/endpoints/products";
import type { Category, Brand } from "@/types/category";
import type { ProductFilters as Filters } from "@/types/product";

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Más recientes" },
  { value: "created_at:asc", label: "Más antiguos" },
  { value: "price:asc", label: "Menor precio" },
  { value: "price:desc", label: "Mayor precio" },
  { value: "name:asc", label: "Nombre A-Z" },
  { value: "name:desc", label: "Nombre Z-A" },
];

const PRICE_RANGES = [
  { value: "", label: "Todos" },
  { value: "0-50", label: "Hasta $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-300", label: "$100 - $300" },
  { value: "300-1000", label: "$300 - $1.000" },
  { value: "1000-999999", label: "Más de $1.000" },
];

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), brandsApi.getAll()]).then(([catRes, brandRes]) => {
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (brandRes.success && brandRes.data) setBrands(brandRes.data);
    });
  }, []);

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category_id: value || undefined, page: 1 });
  };

  const handleBrandChange = (value: string) => {
    onFilterChange({ ...filters, brand_id: value || undefined, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split(":");
    onFilterChange({ ...filters, sort, order: order as "asc" | "desc", page: 1 });
  };

  const handlePriceRangeChange = (value: string) => {
    setSelectedPriceRange(value);
    if (!value) {
      onFilterChange({ ...filters, min_price: undefined, max_price: undefined, page: 1 });
    } else {
      const [min, max] = value.split("-").map(Number);
      onFilterChange({ ...filters, min_price: min, max_price: max, page: 1 });
    }
  };

  const currentSort = filters.sort && filters.order ? `${filters.sort}:${filters.order}` : "created_at:desc";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Ordenar por
        </h3>
        <Select
          options={SORT_OPTIONS}
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Categoría
        </h3>
        <Select
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Todas las categorías"
          value={filters.category_id || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Marca
        </h3>
        <Select
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
          placeholder="Todas las marcas"
          value={filters.brand_id || ""}
          onChange={(e) => handleBrandChange(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Precio
        </h3>
        <Select
          options={PRICE_RANGES}
          value={selectedPriceRange}
          onChange={(e) => handlePriceRangeChange(e.target.value)}
        />
      </div>
    </div>
  );
}
