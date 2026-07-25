import { FeaturedPlantCarousel } from "@/components/home/FeaturedPlantCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { HeroFeaturesBar } from "@/components/home/HeroFeaturesBar";
import { HeroShowcaseCarousel } from "@/components/home/HeroShowcaseCarousel";

export function HeroSection() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full px-0 sm:px-2">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)_minmax(0,0.52fr)] lg:items-center lg:gap-8 xl:gap-10">
          <HeroContent />
          <HeroShowcaseCarousel />
          <FeaturedPlantCarousel />
        </div>

        <HeroFeaturesBar />
      </div>
    </section>
  );
}

