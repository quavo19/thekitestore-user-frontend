import { Link } from "react-router-dom";
import docIcon from "@/assets/svgs/doc-1.svg?raw";
import pointRightIcon from "@/assets/svgs/point-Right.svg?raw";
import { StarRating } from "@/components/ui/StarRating";
import { Icon } from "@/components/ui/Icon";
import {
  HERO_AVATARS,
  HERO_RATING,
  HERO_SOCIAL_PROOF,
} from "@/constants/hero";
import { ROUTES } from "@/constants";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-hero-dark sm:text-5xl xl:text-[3.4rem]">
        Bring Nature
        <br />
        <span className="italic text-hero-green">Into Your Life</span>
      </h1>

      <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-hero-muted sm:text-base">
        Beautiful plants. Expert care. Delivered to your door.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to={ROUTES.SHOP}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-hero-dark px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Shop Plants
          <Icon svg={pointRightIcon} className="h-4 w-4 text-white" />
        </Link>
        <Link
          to={ROUTES.INSPIRATION}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-light text-ink transition-colors hover:bg-gray-50"
        >
          <Icon svg={docIcon} className="h-4 w-4 text-ink" />
          Get Inspired
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {HERO_AVATARS.map((avatar) => (
              <img
                key={avatar.id}
                src={avatar.image}
                alt={avatar.name}
                className="h-9 w-9 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-normal leading-tight text-hero-dark">
              {HERO_SOCIAL_PROOF.count}
            </span>
            <span className="text-xs font-light text-hero-muted">
              {HERO_SOCIAL_PROOF.label}
            </span>
          </div>
        </div>

        <span className="hidden h-8 w-px bg-gray-200 sm:block" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-hero-dark">
            {HERO_RATING.score}
          </span>
          <div>
            <StarRating count={HERO_RATING.stars} />
            <p className="text-xs font-light text-hero-muted">
              {HERO_RATING.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
