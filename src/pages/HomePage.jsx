import { HeroSection } from "@/components/home/HeroSection";
import { HeroFeaturesBar } from "@/components/home/HeroFeaturesBar";
import { HomeHotDealsSection } from "@/components/home/HomeHotDealsSection";
import { HomeDiscoverSection } from "@/components/home/HomeDiscoverSection";
import { HomeInspirationGrid } from "@/components/home/HomeInspirationGrid";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
import { useCustomerProducts } from "@/hooks/useCustomerProducts";

export function HomePage() {
  const { products, isLoadingProducts } = useCustomerProducts();
  return (
    <>
      <HeroSection products={products} />
      <HeroFeaturesBar />
      <HomeHotDealsSection products={products} isLoading={isLoadingProducts} />
      <HomeDiscoverSection products={products} isLoadingProducts={isLoadingProducts} />
      <HomeInspirationGrid />
      <HomePromoBanner />
    </>
  );
}
