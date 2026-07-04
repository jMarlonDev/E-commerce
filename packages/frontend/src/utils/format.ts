export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(price: number, comparePrice: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function getStockStatus(stock: number, threshold: number): { label: string; color: string } {
  if (stock === 0) return { label: "Sin stock", color: "text-red-600" };
  if (stock <= threshold) return { label: "Últimas unidades", color: "text-orange-600" };
  return { label: "En stock", color: "text-green-600" };
}
