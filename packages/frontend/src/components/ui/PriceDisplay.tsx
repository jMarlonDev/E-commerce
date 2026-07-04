import { cn } from "@/utils/cn";
import { formatPrice, getDiscountPercent } from "@/utils/format";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { current: "text-lg font-bold", original: "text-sm" },
  md: { current: "text-xl font-bold", original: "text-base" },
  lg: { current: "text-3xl font-bold", original: "text-lg" },
};

export function PriceDisplay({ price, comparePrice, size = "md", className }: PriceDisplayProps) {
  const discount = getDiscountPercent(price, comparePrice ?? null);
  const hasDiscount = comparePrice != null && comparePrice > price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(sizes[size].current, "text-gray-900")}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn(sizes[size].original, "text-gray-400 line-through")}>
            {formatPrice(comparePrice)}
          </span>
          {discount && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
