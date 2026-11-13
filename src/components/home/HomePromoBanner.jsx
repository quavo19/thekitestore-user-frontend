import { Link } from "react-router-dom";
import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { Icon } from "@/components/ui/Icon";

export function HomePromoBanner() {
  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="Explore the store">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <img src="/images/connected-workspace.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-right" aria-hidden="true" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
        <div className="relative flex min-h-[200px] flex-col justify-center px-6 py-8 sm:min-h-[240px] sm:px-10 lg:min-h-[280px] lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-muted sm:text-sm">Everyday essentials</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-hero-dark sm:text-4xl lg:text-[2.75rem]">From iPhone to Mac</h2>
          <p className="mt-2 text-sm text-hero-muted">Devices and accessories for every day.</p>
          <Link to="/shop" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-hero-dark px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:text-sm">
            Shop now <Icon svg={pointRightIcon} className="h-4 w-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
