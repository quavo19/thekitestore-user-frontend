import { Link } from "react-router-dom";
import bagIcon from "@/assets/svgs/Bag.svg?raw";
import heartIcon from "@/assets/svgs/Heart.svg?raw";
import searchIcon from "@/assets/svgs/Search.svg?raw";
const deviceImage = "/catalog/macbooks.svg";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/constants";

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 bg-white px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-[360px] overflow-hidden bg-hero-sage/20">
        <span className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center bg-white text-hero-green">
          <Icon svg={bagIcon} className="h-8 w-8" />
        </span>
        <span className="absolute right-7 top-10 flex h-11 w-11 items-center justify-center bg-hero-green text-white">
          <Icon svg={heartIcon} className="h-5 w-5" />
        </span>
        <img
          src={deviceImage}
          alt=""
          className="absolute bottom-0 left-1/2 h-[88%] max-h-[480px] -translate-x-1/2 object-contain"
        />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-white/90 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
              Lost path
            </p>
            <p className="mt-1 font-serif text-2xl text-hero-dark">404</p>
          </div>
          <Icon svg={searchIcon} className="h-6 w-6 text-hero-muted" />
        </div>
      </div>

      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-green">
          Page not found
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-tight text-hero-dark sm:text-6xl">
          Nothing here just yet.
        </h1>
        <p className="mt-5 text-sm font-light leading-7 text-hero-muted sm:text-base">
          The page may have moved, or the link may be wrong. Head back to the shop
          and keep browsing fresh picks for your space.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.SHOP}
            className="inline-flex cursor-pointer items-center justify-center gap-2 bg-hero-green px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Icon svg={bagIcon} className="h-5 w-5" />
            Back to shop
          </Link>
          <Link
            to={ROUTES.HOME}
            className="inline-flex cursor-pointer items-center justify-center bg-hero-sage/35 px-6 py-3 text-sm font-medium text-hero-dark transition-colors hover:bg-hero-sage/55"
          >
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
