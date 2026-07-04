import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { getDiscountPercent, getStockStatus } from "@/utils/format";
import { StarRating } from "@/components/ui/StarRating";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.compare_price);
  const stock = getStockStatus(product.stock_quantity, product.low_stock_threshold);

  return (
    <Link
      to={`/producto/${product.slug}`}
      className={cn(
        "group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-sky-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Destacado
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
            {product.short_description}
          </p>
        )}

        <StarRating rating={product.average_rating} count={product.review_count} />

        <PriceDisplay
          price={product.price}
          comparePrice={product.compare_price}
          size="sm"
          className="mt-2"
        />

        <p className={cn("text-xs mt-1", stock.color)}>
          {stock.label}
        </p>
      </div>
    </Link>
  );
}
