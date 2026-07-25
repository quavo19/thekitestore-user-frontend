import { ProductCarouselCard } from "@/components/ui/ProductCarouselCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ItemsCarousel } from "@/components/ui/ItemsCarousel";
import { CAROUSEL_ITEMS_PER_VIEW_WIDE } from "@/constants/carousel";
import { DAILY_DEALS } from "@/constants/home";
import { useEndOfDayCountdown } from "@/hooks/useEndOfDayCountdown";

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl tabular-nums text-hero-green sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[11px] font-light capitalize text-hero-muted">
        {label}
      </span>
    </div>
  );
}

function DailyDealCountdown() {
  const { hours, minutes, seconds } = useEndOfDayCountdown();

  return (
    <div
      className="mt-4 flex items-center justify-center gap-2 sm:gap-3"
      aria-live="polite"
      aria-label="Time remaining in today's deal"
    >
      <CountdownUnit value={hours} label="Hours" />
      <span className="mb-4 font-serif text-2xl font-light text-hero-green/70 sm:text-3xl">
        :
      </span>
      <CountdownUnit value={minutes} label="minutes" />
      <span className="mb-4 font-serif text-2xl font-light text-hero-green/70 sm:text-3xl">
        :
      </span>
      <CountdownUnit value={seconds} label="Seconds" />
    </div>
  );
}

export function HomeDailyDealSection() {
  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="Daily deal">
      <SectionHeading>Daily Deal</SectionHeading>
      <DailyDealCountdown />

      <div className="mt-6">
        <ItemsCarousel
          items={DAILY_DEALS}
          showHeader={false}
          itemsPerView={CAROUSEL_ITEMS_PER_VIEW_WIDE}
          renderItem={(deal) => (
            <ProductCarouselCard
              name={deal.name}
              price={deal.price}
              rating={deal.rating}
              image={deal.image}
              href={deal.href}
            />
          )}
        />
      </div>
    </section>
  );
}
