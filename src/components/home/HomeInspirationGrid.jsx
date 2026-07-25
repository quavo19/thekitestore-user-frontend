import { HOME_INSPIRATION_GRID } from "@/constants/home";
import { cn } from "@/utils";
import { Link } from "react-router-dom";

function InspirationGridTile({ image, alt, variant, href }) {
  const isBanner = variant === "banner";

  return (
    <Link
      to={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-gray-100",
        isBanner
          ? "col-span-2 aspect-2/1 lg:aspect-auto lg:h-full"
          : "col-span-1 aspect-square lg:aspect-auto lg:h-full",
      )}
    >
      <img
        src={image}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </Link>
  );
}

export function HomeInspirationGrid() {
  return (
    <section
      className="mt-10 w-full sm:mt-12"
      aria-label="Plant inspiration gallery"
    >
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:h-[60svh] lg:grid-rows-2">
        {HOME_INSPIRATION_GRID.map((tile) => (
          <InspirationGridTile
            key={tile.id}
            image={tile.image}
            alt={tile.alt}
            variant={tile.variant}
            href={tile.href}
          />
        ))}
      </div>
    </section>
  );
}

