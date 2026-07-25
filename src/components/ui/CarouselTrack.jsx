import { Children } from "react";
import { cn } from "@/utils";

export function CarouselTrack({ index, children, className, slideClassName }) {
  const slides = Children.toArray(children);

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={cn("w-full shrink-0", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
