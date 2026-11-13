import { useCategories } from "@/hooks/useCategories";
import { useSearchParams } from "react-router-dom";
import preferenceIcon from "@/assets/svgs/preference-horizontal.svg?raw";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { SHOP_SORT_OPTIONS } from "@/constants/shop";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

function SortDropdown({ value, label, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-light text-hero-dark"
      >
        <span className="text-hero-muted">Sort by</span>
        <span className="text-gray-300">|</span>
        <span>{label}</span>
        <Icon
          svg={arrowIcon}
          className={cn(
            "h-4 w-4 text-hero-muted transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          {SHOP_SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer px-4 py-2 text-left text-sm font-light transition-colors hover:bg-gray-50",
                value === option.id ? "text-hero-green" : "text-hero-dark",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ShopResultsView({
  query,
  sort,
  sortLabel,
  page,
  totalCount,
  totalPages,
  paginatedProducts,
  onSortChange,
  onPageChange,
  onProductSelect,
  onOpenFilters,
  onClearFilters,
  showFiltersButton = true,
}) {
  const catalogCategories = useCategories();
  const [searchParams] = useSearchParams();
  const selectedIds = (searchParams.get("category") || "").split(",");
  const categoryLabel = catalogCategories.filter(item => selectedIds.includes(item.id) || selectedIds.includes(item.apiId)).map(item => item.label).join(", ");
  const hasQuery = Boolean(query.trim());
  const displayQuery = hasQuery ? query.trim() : "all products";
  const resultLabel =
    totalCount >= 1500 ? "1,500+ Items found" : `${totalCount} Items found`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-xl font-semibold text-hero-dark sm:text-2xl">
            {hasQuery ? `Search results for ${displayQuery}` : categoryLabel || "All products"}
          </h1>
          <span className="text-sm font-light text-hero-muted">{resultLabel}</span>
        </div>

        <div className="flex items-center gap-4">
          {showFiltersButton && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-hero-green transition-opacity hover:opacity-80"
            >
              <Icon svg={preferenceIcon} className="h-5 w-5 text-hero-green" />
              All filters
            </button>
          )}
          <SortDropdown value={sort} label={sortLabel} onChange={onSortChange} />
        </div>
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {paginatedProducts.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              showAddToCart
              onSelect={() => onProductSelect?.(product)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
          <p className="text-base font-medium text-hero-dark">No products found</p>
          <p className="mt-2 text-sm font-light text-hero-muted">
            Try adjusting your search or clearing filters.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 cursor-pointer text-sm font-medium text-hero-green transition-opacity hover:opacity-80"
          >
            Clear filters
          </button>
        </div>
      )}

      <Pagination
        currentPage={Math.min(page, totalPages)}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
