import { Fragment } from "react";
import trophy from "@/assets/svgs/trophy.svg?raw";
import guaranteeIcon from "@/assets/svgs/security-check.svg?raw";
import medalIcon from "@/assets/svgs/medal.svg?raw";
import truckIcon from "@/assets/svgs/truck.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { HERO_FEATURES } from "@/constants/hero";
import { cn } from "@/utils";

const FEATURE_ICONS = {
  1: medalIcon,
  2: truckIcon,
  3: trophy,
  4: guaranteeIcon,
};

function HangingDivider({ vertical = true, className }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        vertical ? "px-0" : "py-0",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn("bg-gray-100", vertical ? "h-10 w-px" : "h-px w-xs")}
      />
    </div>
  );
}

function HeroFeatureItem({ icon, iconBg, title, description, className }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2.5 px-4 py-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-full",
          iconBg,
        )}
      >
        <Icon svg={icon} className="h-8 w-8 text-hero-dark" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug text-hero-dark">
          {title}
        </p>
        <p className="mt-0.5 text-xs font-light leading-relaxed text-hero-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureRow({ items, className }) {
  return (
    <div className={cn("flex items-center", className)}>
      {items.map((feature, index) => (
        <Fragment key={feature.id}>
          {index > 0 && <HangingDivider vertical />}
          <HeroFeatureItem
            className="flex-1"
            icon={FEATURE_ICONS[feature.id]}
            iconBg={feature.iconBg}
            title={feature.title}
            description={feature.description}
          />
        </Fragment>
      ))}
    </div>
  );
}

export function HeroFeaturesBar() {
  const [firstRow, secondRow] = [
    HERO_FEATURES.slice(0, 2),
    HERO_FEATURES.slice(2, 4),
  ];

  return (
    <div className="mt-10 rounded-2xl border border-gray-100 bg-white py-2.5 sm:mt-12">
      <div className="hidden lg:block">
        <FeatureRow items={HERO_FEATURES} />
      </div>

      <div className="hidden sm:block lg:hidden">
        <FeatureRow items={firstRow} />
        <HangingDivider vertical={false} className="my-1" />
        <FeatureRow items={secondRow} />
      </div>

      <div className="flex flex-col sm:hidden">
        {HERO_FEATURES.map((feature, index) => (
          <div key={feature.id}>
            {index > 0 && <HangingDivider vertical={false} className="my-1" />}
            <HeroFeatureItem
              icon={FEATURE_ICONS[feature.id]}
              iconBg={feature.iconBg}
              title={feature.title}
              description={feature.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

