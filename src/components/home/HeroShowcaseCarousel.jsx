import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { CarouselTrack } from "@/components/ui/CarouselTrack";
import { Icon } from "@/components/ui/Icon";
import { HERO_SHOWCASE_SLIDES } from "@/constants/hero";
import { useCarousel } from "@/hooks/useCarousel";

export function HeroShowcaseCarousel() {
  const { index, next, prev } = useCarousel(HERO_SHOWCASE_SLIDES.length, { autoPlayInterval: 5500 });

  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[320px] lg:max-w-[340px]">
      <div className="relative min-h-[340px] px-3 pt-2 sm:min-h-[360px]">
        <div className="relative z-10 mx-auto min-h-[280px] w-[72%] rounded-t-[8.5rem] bg-hero-sage sm:min-h-[300px] sm:rounded-t-[9.5rem]" />
        <div className="absolute inset-x-0 bottom-[55px] z-20">
          <CarouselTrack index={index} slideClassName="flex items-center justify-center">
            {HERO_SHOWCASE_SLIDES.map((slide) => (
              <div key={slide.id} className="flex h-[220px] w-[190px] items-center justify-center sm:h-[230px] sm:w-[200px]">
                <img src={slide.image} alt={slide.name} className="h-full w-full object-contain" />
              </div>
            ))}
          </CarouselTrack>
        </div>
        <div className="absolute bottom-[5.5rem] left-1 z-20 rounded-full border border-dashed border-gray-400 bg-hero-sage px-4 py-3 text-center text-xs leading-tight text-hero-dark sm:left-2">
          Discover<br /><span className="font-semibold">Devices</span>
        </div>
        <div className="absolute bottom-[4.5rem] right-1 z-20 w-[148px] rounded-2xl border border-gray-100 bg-white p-3 text-xs text-hero-dark shadow-sm sm:right-2">
          <p className="font-medium">{HERO_SHOWCASE_SLIDES[index].name}</p>
          <p className="mt-1 text-xs leading-relaxed text-hero-muted">{HERO_SHOWCASE_SLIDES[index].caption}</p>
        </div>
        <div className="absolute bottom-2 right-2 z-30 flex gap-1.5 sm:right-3">
          <button type="button" onClick={prev} aria-label="Previous showcase slide" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-ink hover:bg-gray-50"><Icon svg={arrowIcon} className="h-3.5 w-3.5 -rotate-90" /></button>
          <button type="button" onClick={next} aria-label="Next showcase slide" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-ink hover:bg-gray-50"><Icon svg={arrowIcon} className="h-3.5 w-3.5 rotate-90" /></button>
        </div>
      </div>
    </div>
  );
}
