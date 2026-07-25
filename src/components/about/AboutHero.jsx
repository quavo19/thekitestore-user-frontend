import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { ArchedImage } from "@/components/about/ArchedImage";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_HERO } from "@/constants/about";
import { ROUTES } from "@/constants";
import { Link } from "react-router-dom";

export function AboutHero() {
  const { eyebrow, headline, description, badge, images } = ABOUT_HERO;

  return (
    <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-green">
          {eyebrow}
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-hero-dark sm:text-5xl xl:text-[3.25rem]">
          {headline}
        </h1>

        <p className="mt-5 text-sm font-light leading-relaxed text-hero-muted sm:text-base">
          {description}
        </p>

        <Link
          to={ROUTES.SHOP}
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-hero-green px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90"
        >
          Discover Now
          <Icon svg={pointRightIcon} className="h-4 w-4 text-white" />
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="grid grid-cols-[1.15fr_0.85fr] gap-3 sm:gap-4">
          <div className="relative row-span-2">
            <ArchedImage
              src={images.main}
              alt="Styled indoor plant arrangement"
              className="aspect-[3/4] w-full sm:aspect-[4/5]"
            />

            <div className="absolute -bottom-3 -left-3 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-hero-green p-3 text-center shadow-lg sm:-bottom-4 sm:-left-4 sm:h-28 sm:w-28">
              <span className="text-[10px] font-medium uppercase leading-tight tracking-wide text-white/90">
                {badge}
              </span>
              <span className="mt-1 text-xl font-serif text-white">+</span>
            </div>
          </div>

          <ArchedImage
            src={images.top}
            alt="Hanging terrarium plant"
            className="aspect-[4/5] w-full"
          />
          <ArchedImage
            src={images.bottom}
            alt="Trailing plants in woven baskets"
            className="aspect-[4/5] w-full"
          />
        </div>
      </div>
    </section>
  );
}
