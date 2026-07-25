import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { ItemsCarousel } from "@/components/ui/ItemsCarousel";
import { ProductCarouselCard } from "@/components/ui/ProductCarouselCard";
import { BEST_SELLERS, SHOP_COLLECTIONS } from "@/constants/home";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { Link } from "react-router-dom";

function HangingDivider({ vertical = true, className }) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "bg-gray-100",
          vertical ? "h-32 w-px lg:h-40" : "h-px w-12",
        )}
      />
    </div>
  );
}

function CollectionCard({ title, count, image, href }) {
  return (
    <Link
      to={href}
      className="group flex h-full flex-col cursor-pointer"
    >
      <div className="flex h-28 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3 transition-colors group-hover:bg-gray-100/80 sm:h-32">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div className="mt-2 flex min-h-10 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-hero-dark">{title}</p>
          <p className="text-[11px] font-light text-hero-muted">{count} Plants</p>
        </div>

        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-hero-dark transition-colors group-hover:bg-gray-200/80"
        >
          <Icon svg={pointRightIcon} className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export function HomeDiscoverSection() {
  return (
    <section className="mt-10 w-full sm:mt-12">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <ItemsCarousel
          title="Shop by Collection"
          viewAllHref={ROUTES.SHOP}
          items={SHOP_COLLECTIONS}
          className="min-w-0 flex-1"
          renderItem={(collection) => (
            <CollectionCard
              title={collection.title}
              count={collection.count}
              image={collection.image}
              href={collection.href}
            />
          )}
        />

        <HangingDivider vertical={false} className="my-5 lg:hidden" />
        <HangingDivider vertical className="hidden px-5 lg:flex" />

        <ItemsCarousel
          title="Best Sellers"
          viewAllHref={ROUTES.SHOP}
          items={BEST_SELLERS}
          className="min-w-0 flex-1"
          renderItem={(plant) => (
            <ProductCarouselCard
              name={plant.name}
              price={plant.price}
              rating={plant.rating}
              image={plant.image}
              href={plant.href}
            />
          )}
        />
      </div>
    </section>
  );
}
