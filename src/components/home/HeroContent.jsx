import { Link } from "react-router-dom";
import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { categoryHref } from "@/constants/catalog";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-hero-dark sm:text-5xl xl:text-[3.4rem]">
        Find Your Next<br />
        <span className="italic text-hero-green">Favourite Device</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-hero-muted sm:text-base">
        iPhones, Macs, AirPods and the accessories you need, all in one place.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to={categoryHref("phones")} className="inline-flex items-center gap-2 rounded-full bg-hero-dark px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
          Shop iPhones <Icon svg={pointRightIcon} className="h-4 w-4 text-white" />
        </Link>
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-light text-ink transition-colors hover:bg-gray-50">
          Shop all products
        </Link>
      </div>
      <p className="mt-8 max-w-sm text-xs leading-relaxed text-hero-muted">
        The Kite Store is an independent retailer and is not an Apple Authorized Reseller.
      </p>
    </div>
  );
}
