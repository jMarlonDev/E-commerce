import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategorySection } from "@/components/home/CategorySection";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
    </div>
  );
}
