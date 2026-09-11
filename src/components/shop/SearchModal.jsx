import closeIcon from "@/assets/svgs/Close.svg?raw";
import searchIcon from "@/assets/svgs/Search.svg?raw";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { FilterModal } from "@/components/shop/FilterModal";
import { ShopResultsView } from "@/components/shop/ShopResultsView";
import { ROUTES } from "@/constants/routes";
import { useShopParams } from "@/hooks/useShopParams";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function SearchModal() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isShopPage = pathname === ROUTES.SHOP;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef(null);
  const {
    isSearchOpen,
    query,
    page,
    sort,
    sortLabel,
    categories,
    sizes,
    availability,
    styles,
    priceMin,
    priceMax,
    paginatedProducts,
    totalCount,
    totalPages,
    closeSearch,
    setPage,
    setSort,
    setQuery,
    applyFilters,
    clearFilters,
  } = useShopParams();

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen || isShopPage) return null;

  function handleClose() {
    closeSearch();
  }

  function handleGoHome() {
    closeSearch();
    navigate(ROUTES.HOME);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setQuery(String(formData.get("query") ?? ""));
  }

  const filterState = {
    categories,
    sizes,
    availability,
    styles,
    priceMin,
    priceMax,
    sort,
  };

  return (
    <>
      <div className="absolute inset-0 z-50 flex flex-col bg-white">
        <div className="shrink-0 border-b border-gray-100 px-4 py-4 lg:px-8">
          <div className="flex items-start gap-4">
            <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1">
              <Icon
                svg={searchIcon}
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={inputRef}
                name="query"
                type="search"
                key={query}
                defaultValue={query}
                placeholder="Search plants, care tips, accessories..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-light text-ink outline-none transition-all duration-300 focus:border-hero-green sm:focus:max-w-none"
              />
            </form>

            <button
              type="button"
              aria-label="Close search"
              onClick={handleClose}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
            >
              <Icon svg={closeIcon} className="h-5 w-5 text-ink" />
            </button>
          </div>

          <div className="mt-4">
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: ROUTES.HOME,
                  onClick: (event) => {
                    event.preventDefault();
                    handleGoHome();
                  },
                },
                { label: "Search results" },
              ]}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <ShopResultsView
            query={query}
            sort={sort}
            sortLabel={sortLabel}
            page={page}
            totalCount={totalCount}
            totalPages={totalPages}
            paginatedProducts={paginatedProducts}
            onSortChange={setSort}
            onPageChange={setPage}
            onProductSelect={(product) => navigate(`/products/${product.id}`)}
            onOpenFilters={() => setIsFilterOpen(true)}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filterState}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </>
  );
}
