import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = new Set([1, totalPages, currentPage]);

  if (currentPage > 2) items.add(currentPage - 1);
  if (currentPage < totalPages - 1) items.add(currentPage + 1);

  if (currentPage <= 3) {
    items.add(2);
    items.add(3);
  }

  if (currentPage >= totalPages - 2) {
    items.add(totalPages - 1);
    items.add(totalPages - 2);
  }

  const sorted = [...items].sort((a, b) => a - b);
  const result = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  });

  return result;
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 py-8"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-sm font-light text-hero-green transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon svg={arrowIcon} className="h-4 w-4 -rotate-90" />
        Prev.
      </button>

      <div className="flex items-center gap-1">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm font-light text-hero-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? "page" : undefined}
              className={cn(
                "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-light transition-colors",
                item === currentPage
                  ? "bg-hero-green text-white"
                  : "text-hero-muted hover:text-ink",
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-sm font-light text-hero-green transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <Icon svg={arrowIcon} className="h-4 w-4 rotate-90" />
      </button>
    </nav>
  );
}
