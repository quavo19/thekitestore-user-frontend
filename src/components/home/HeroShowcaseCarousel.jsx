import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { CarouselTrack } from "@/components/ui/CarouselTrack";
import { Icon } from "@/components/ui/Icon";
import { StarRating } from "@/components/ui/StarRating";
import { HERO_SHOWCASE_SLIDES } from "@/constants/hero";
import { useCarousel } from "@/hooks/useCarousel";

export function HeroShowcaseCarousel() {
  const { index, next, prev } = useCarousel(HERO_SHOWCASE_SLIDES.length, {
    autoPlayInterval: 5500,
  });

  return (
    <div className="relative mx-auto w-full max-w-[300px] overflow-visible sm:max-w-[320px] lg:max-w-[340px]">
      <div className="relative min-h-[340px] overflow-visible px-3 pt-2 sm:min-h-[360px]">
        <div className="relative z-10 mx-auto flex min-h-[280px] w-[72%] items-end justify-center overflow-visible rounded-t-[8.5rem] bg-hero-sage pb-6 pt-14 sm:min-h-[300px] sm:rounded-t-[9.5rem]" />

        <div className="absolute inset-x-0 bottom-0 z-20 overflow-visible">
          <CarouselTrack
            index={index}
            className="overflow-hidden"
            slideClassName="flex items-end justify-center overflow-visible"
          >
            {HERO_SHOWCASE_SLIDES.map((slide) => (
              <img
                key={slide.id}
                src={slide.image}
                alt="Featured plant showcase"
                className="block h-[360px] w-auto max-w-none object-contain object-bottom sm:h-[400px]"
              />
            ))}
          </CarouselTrack>
        </div>

        <div className="absolute bottom-[5.5rem] left-1 z-20 sm:bottom-[6rem] sm:left-2">
          <div className="rounded-full border border-white bg-white p-0.5">
            <div className="flex h-[4.25rem] w-[4.25rem] flex-col items-center justify-center rounded-full border border-dashed border-hero-green/45 bg-hero-sage px-1.5 py-1.5 text-center sm:h-[4.5rem] sm:w-[4.5rem]">
              <p className="text-[9px] font-light leading-tight text-hero-muted sm:text-[10px]">
                Plants
                <br />
                Delivered
              </p>
              <p className="mt-0.5 text-xs font-semibold text-hero-dark sm:text-sm">
                {HERO_SHOWCASE_SLIDES[index].badge}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[4.5rem] right-1 z-20 w-[148px] sm:bottom-[5.25rem] sm:right-2 sm:w-[158px]">
          <CarouselTrack index={index}>
            {HERO_SHOWCASE_SLIDES.map((slide) => (
              <div key={slide.id} className="rounded-2xl bg-white p-2.5">
                <div className="flex items-start gap-2">
                  <img
                    src={slide.testimonial.avatar}
                    alt={slide.testimonial.author}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-light leading-snug text-hero-muted">
                      &ldquo;{slide.testimonial.quote}&rdquo;
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-hero-dark">
                      {slide.testimonial.author}
                    </p>
                    <StarRating
                      count={slide.testimonial.rating}
                      className="mt-0.5 scale-[0.65] origin-left"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CarouselTrack>
        </div>

        <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 sm:right-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous showcase slide"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-ink transition-colors hover:bg-gray-50"
          >
            <Icon svg={arrowIcon} className="h-3.5 w-3.5 -rotate-90 text-ink" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next showcase slide"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-ink transition-colors hover:bg-gray-50"
          >
            <Icon svg={arrowIcon} className="h-3.5 w-3.5 rotate-90 text-ink" />
          </button>
        </div>
      </div>
    </div>
  );
}
