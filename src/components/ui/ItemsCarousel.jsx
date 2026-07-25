import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";
import {
  CAROUSEL_ITEMS_PER_VIEW_DEFAULT,
  resolveItemsPerView,
} from "@/constants/carousel";
import { cn } from "@/utils";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

const GAP_PX = 12;
const AUTO_PLAY_MS = 5000;

function CarouselNavButton({ direction, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous items" : "Next items"}
      className={cn(
        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-hero-dark transition-colors",
        disabled
          ? "cursor-not-allowed opacity-35"
          : "hover:bg-gray-50 active:bg-gray-100",
      )}
    >
      <Icon
        svg={arrowIcon}
        className={cn(
          "h-3.5 w-3.5",
          direction === "prev" ? "-rotate-90" : "rotate-90",
        )}
      />
    </button>
  );
}

export function ItemsCarousel({
  title,
  items,
  renderItem,
  viewAllHref,
  viewAllLabel = "View All",
  showHeader = true,
  itemsPerView = CAROUSEL_ITEMS_PER_VIEW_DEFAULT,
  className,
}) {
  const containerRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [index, setIndex] = useState(0);

  const showControls = maxIndex > 0;
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const prev = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const next = useCallback(() => {
    setIndex((current) => Math.min(current + 1, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback((targetIndex) => {
    setIndex(Math.min(Math.max(targetIndex, 0), maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const updateMetrics = () => {
      const containerWidth = container.offsetWidth;
      const perView = resolveItemsPerView(itemsPerView);
      const nextSlideWidth =
        (containerWidth - GAP_PX * (perView - 1)) / perView;
      const nextMaxIndex = Math.max(0, items.length - perView);

      setSlideWidth(nextSlideWidth);
      setSlideStep(nextSlideWidth + GAP_PX);
      setMaxIndex(nextMaxIndex);
      setIndex((current) => Math.min(current, nextMaxIndex));
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    observer.observe(container);
    window.addEventListener("resize", updateMetrics);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [items.length, itemsPerView]);

  useEffect(() => {
    if (maxIndex === 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setIndex((current) => {
        const limit = Math.max(0, items.length - resolveItemsPerView(itemsPerView));
        return current >= limit ? 0 : current + 1;
      });
    }, AUTO_PLAY_MS);

    return () => clearInterval(interval);
  }, [maxIndex, items.length, itemsPerView]);

  return (
    <div className={cn("min-w-0", className)}>
      {showHeader && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-hero-dark">{title}</h2>

          <div className="flex shrink-0 items-center gap-2">
            {showControls && (
              <div className="flex items-center gap-1.5">
                <CarouselNavButton
                  direction="prev"
                  disabled={!canPrev}
                  onClick={prev}
                />
                <CarouselNavButton
                  direction="next"
                  disabled={!canNext}
                  onClick={next}
                />
              </div>
            )}

            {viewAllHref && (
              <Link
                to={viewAllHref}
                className="inline-flex cursor-pointer rounded-full border border-gray-200 px-3 py-1 text-[11px] font-light text-hero-dark transition-colors hover:bg-gray-50"
              >
                {viewAllLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex gap-3 transition-transform duration-500 ease-in-out"
          style={{
            transform:
              slideStep > 0 ? `translateX(-${index * slideStep}px)` : undefined,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0"
              style={{ width: slideWidth > 0 ? slideWidth : undefined }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={cn(
                "h-1 cursor-pointer rounded-full transition-all duration-300",
                dotIndex === index
                  ? "w-2.5 bg-hero-dark"
                  : "w-1 bg-gray-200 hover:bg-gray-300",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
