import { ArchedImage } from "@/components/about/ArchedImage";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_WHY_CHOOSE_US } from "@/constants/about";

function FeatureItem({ icon, iconBg, title, description }) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon svg={icon} className="h-7 w-7 text-hero-dark" />
      </div>
      <div className="min-w-0 pt-1">
        <h3 className="font-serif text-lg text-hero-dark">{title}</h3>
        <p className="mt-1.5 text-sm font-light leading-relaxed text-hero-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

export function AboutWhyChooseUs() {
  const { title, description, closing, image, features } = ABOUT_WHY_CHOOSE_US;

  return (
    <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <ArchedImage
          src={image}
          alt="Curated plant collection in a styled interior"
          className="aspect-[4/5] w-full sm:aspect-[3/4]"
        />

        <div className="absolute top-6 left-6 hidden rounded-lg bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-hero-green">
            The Kite Store Store
          </p>
          <p className="mt-1 font-serif text-sm leading-snug text-hero-dark">
            The Perfect
            <br />
            Choice
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-3xl tracking-tight text-hero-dark sm:text-4xl">
          {title}
        </h2>

        <p className="mt-5 text-sm font-light leading-relaxed text-hero-muted sm:text-base">
          {description}
        </p>

        <div className="mt-8 space-y-7">
          {features.map((feature) => (
            <FeatureItem
              key={feature.id}
              icon={feature.icon}
              iconBg={feature.iconBg}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <p className="mt-8 text-sm font-light leading-relaxed text-hero-muted italic sm:text-base">
          {closing}
        </p>
      </div>
    </section>
  );
}
