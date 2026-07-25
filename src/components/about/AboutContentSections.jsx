import { ArchedImage } from "@/components/about/ArchedImage";
import { Icon } from "@/components/ui/Icon";
import {
  ABOUT_MISSION,
  ABOUT_OVERVIEW,
  ABOUT_SERVICES,
  ABOUT_VALUES,
  ABOUT_VISION,
} from "@/constants/about";

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hero-green">
      {children}
    </p>
  );
}

export function AboutOverview() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-hero-sage/20 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
      <div>
        <SectionLabel>Who We Are</SectionLabel>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-hero-dark sm:text-4xl">
          {ABOUT_OVERVIEW.title}
        </h2>

        <div className="mt-6 space-y-4">
          {ABOUT_OVERVIEW.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-sm font-light leading-relaxed text-hero-muted sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ArchedImage
        src={ABOUT_OVERVIEW.image}
        alt="Bright interior with curated greenery"
        className="aspect-[5/4] w-full max-w-md justify-self-center lg:max-w-none"
      />
    </section>
  );
}

export function AboutMissionVision() {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
      {[ABOUT_MISSION, ABOUT_VISION].map((block) => (
        <article
          key={block.title}
          className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8"
        >
          <SectionLabel>{block.title}</SectionLabel>
          <h2 className="mt-3 font-serif text-2xl text-hero-dark sm:text-3xl">
            {block.title}
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-hero-muted sm:text-base">
            {block.description}
          </p>
        </article>
      ))}
    </section>
  );
}

export function AboutValues() {
  return (
    <section className="rounded-3xl bg-hero-dark px-6 py-10 text-white sm:px-10 sm:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>
          <span className="text-accent-lime">{ABOUT_VALUES.title}</span>
        </SectionLabel>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{ABOUT_VALUES.title}</h2>
        <p className="mt-5 text-sm font-light leading-relaxed text-white/75 sm:text-base">
          {ABOUT_VALUES.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {ABOUT_VALUES.pillars.map((pillar) => (
            <span
              key={pillar}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/90"
            >
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutServices() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <SectionLabel>What We Offer</SectionLabel>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-hero-dark sm:text-4xl">
          Services
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ABOUT_SERVICES.map((service) => (
          <article
            key={service.id}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-hero-sage/20">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
                <Icon svg={service.icon} className="h-5 w-5 text-hero-dark" />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="font-serif text-xl text-hero-dark">{service.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-hero-muted">
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
