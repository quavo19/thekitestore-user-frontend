import { HeroSection } from "@/components/home/HeroSection";
import { HomeDailyDealSection } from "@/components/home/HomeDailyDealSection";
import { HomeDiscoverSection } from "@/components/home/HomeDiscoverSection";
import { HomeInspirationGrid } from "@/components/home/HomeInspirationGrid";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeDiscoverSection />
      <HomeInspirationGrid />
      <HomeDailyDealSection />
      <HomePromoBanner />
    </>
  );
}
