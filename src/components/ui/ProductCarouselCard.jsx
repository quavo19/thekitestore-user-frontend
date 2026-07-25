import bagIcon from "@/assets/svgs/Bag.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Link } from "react-router-dom";

export function ProductCarouselCard({ name, price, rating, image, href }) {
  return (
    <Link to={href} className="group flex h-full flex-col cursor-pointer">
      <div className="relative flex-1">
        <div className="relative h-36 overflow-hidden rounded-2xl bg-gray-50 transition-colors group-hover:bg-gray-100/80 sm:h-40">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div className="relative -mt-5 mx-1 min-h-[68px] rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm">
          <p className="truncate text-xs font-semibold text-hero-dark">{name}</p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] font-light text-hero-dark">
              ${price.toFixed(2)}
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-light text-hero-muted">
              {rating}
              <span className="text-[10px] text-hero-green">★</span>
            </span>
          </div>

          <span className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-lime text-hero-dark transition-opacity group-hover:opacity-90">
            <Icon svg={bagIcon} className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
