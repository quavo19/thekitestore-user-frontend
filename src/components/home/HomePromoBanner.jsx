import bannerImage from "@/assets/images/banners/banner.jpg";
import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";

export function HomePromoBanner() {
  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="Promotional offer">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-right"
          aria-hidden="true"
        />

        <div className="relative flex min-h-[200px] flex-col justify-center px-6 py-8 sm:min-h-[240px] sm:px-10 lg:min-h-[280px] lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green sm:text-sm">
            Only Today
          </p>

          <h2 className="mt-2 font-serif text-3xl leading-tight text-hero-dark sm:text-4xl lg:text-[2.75rem]">
            Indoor Plants & Pot
          </h2>

          <p className="mt-2 font-serif text-xl text-hero-dark sm:text-2xl lg:text-[1.75rem]">
            Up To <span className="text-hero-green">-40%</span> Off
          </p>

          <Link
            to={ROUTES.SHOP}
            className="mt-5 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-hero-green px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:text-sm"
          >
            Shop Now
            <Icon svg={pointRightIcon} className="h-4 w-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
