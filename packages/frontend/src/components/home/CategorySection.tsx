import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesApi } from "@/api/endpoints/products";
import type { Category } from "@/types/category";

const CATEGORY_ICONS: Record<string, string> = {
  electronics: "💻",
  fashion: "👕",
  home: "🏠",
  sports: "⚽",
  books: "📚",
};

function getCategoryIcon(slug: string): string {
  const key = Object.keys(CATEGORY_ICONS).find((k) => slug.includes(k));
  return key ? CATEGORY_ICONS[key] : "📦";
}

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await categoriesApi.getAll();
        if (!cancelled && response.success && response.data) {
          setCategories(response.data);
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

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Explorá por Categoría</h2>
          <p className="text-gray-600 mt-1">Encontrá exactamente lo que buscás</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?category_id=${cat.id}`}
              className="group flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all"
            >
              <span className="text-4xl mb-3">{getCategoryIcon(cat.slug)}</span>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-sky-600 transition-colors text-center">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
