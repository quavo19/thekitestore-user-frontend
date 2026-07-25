import { Link } from "react-router-dom";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";

export function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm font-light", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <Icon
                  svg={arrowIcon}
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rotate-90 text-hero-muted"
                />
              )}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  onClick={item.onClick}
                  className="cursor-pointer text-hero-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? "font-medium text-ink" : "text-hero-muted",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
