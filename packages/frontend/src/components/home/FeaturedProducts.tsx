import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "@/api/endpoints/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await productsApi.getFeatured(4);
        if (!cancelled && response.success && response.data) {
          setProducts(response.data);
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
          <p className="text-gray-600 mt-1">Lo que nuestros clientes más eligen</p>
        </div>
        <Link
          to="/catalogo?is_featured=true"
          className="text-sky-600 hover:text-sky-700 text-sm font-medium"
        >
          Ver todos →
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
