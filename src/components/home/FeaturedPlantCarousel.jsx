import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Link } from "react-router-dom";
import { CarouselTrack } from "@/components/ui/CarouselTrack";
import { Icon } from "@/components/ui/Icon";
import { HERO_FEATURED_PLANTS } from "@/constants/hero";
import { ROUTES } from "@/constants";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/utils";

export function FeaturedPlantCarousel() {
  const { index, next, prev, goTo } = useCarousel(HERO_FEATURED_PLANTS.length, {
    autoPlayInterval: 6000,
  });

  return (
    <div className="mx-auto flex h-full w-full flex-col rounded-[2rem] bg-hero-dark p-4 text-white sm:w-full lg:mx-0 lg:max-w-[220px]">
      <p className="font-serif text-base leading-tight sm:text-lg">
        {HERO_FEATURED_PLANTS[0].label}
      </p>

      <CarouselTrack index={index} className="mt-1 flex-1">
        {HERO_FEATURED_PLANTS.map((plant) => (
          <div key={plant.id} className="flex flex-col">
            <p className="text-sm font-light text-secondary">{plant.name}</p>

            <div className="relative my-3 flex flex-1 items-center justify-center overflow-visible">
              <img
                src={plant.image}
                alt={plant.name}
                className="max-h-36 w-auto object-contain sm:max-h-40"
              />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium sm:text-2xl">
                  ${plant.price.toFixed(2)}
                </span>
                <span className="text-xs font-light text-sidebar-muted line-through">
                  ${plant.originalPrice.toFixed(2)}
                </span>
              </div>
              <Link
                to={ROUTES.SHOP}
                className="mt-2.5 inline-flex cursor-pointer rounded-full border border-white/60 px-4 py-1.5 text-xs font-light text-white transition-colors hover:bg-white/10"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </CarouselTrack>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous featured plant"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-transparent text-white transition-colors hover:bg-white/10"
        >
          <Icon svg={arrowIcon} className="h-3.5 w-3.5 -rotate-90 text-white" />
        </button>

        <div className="flex items-center gap-1">
          {HERO_FEATURED_PLANTS.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to featured plant ${dotIndex + 1}`}
              className={cn(
                "h-1 cursor-pointer rounded-full transition-all duration-300",
                dotIndex === index
                  ? "w-2.5 bg-white"
                  : "w-1 bg-white/35 hover:bg-white/55",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next featured plant"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-transparent text-white transition-colors hover:bg-white/10"
        >
          <Icon svg={arrowIcon} className="h-3.5 w-3.5 rotate-90 text-white" />
        </button>
      </div>
    </div>
  );
}
