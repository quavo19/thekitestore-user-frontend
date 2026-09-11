import preferenceIcon from "@/assets/svgs/preference-horizontal.svg?raw";
import { FilterModal } from "@/components/shop/FilterModal";
import { ShopCategoryCard } from "@/components/shop/ShopCategoryCard";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopResultsView } from "@/components/shop/ShopResultsView";
import { Icon } from "@/components/ui/Icon";
import { ItemsCarousel } from "@/components/ui/ItemsCarousel";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCarouselCard } from "@/components/ui/ProductCarouselCard";
import { ROUTES } from "@/constants/routes";
import {
  SHOP_CATALOG_PAGE_PARAM,
  SHOP_CATALOG_PAGE_SIZE,
  SHOP_MAIN_CATEGORIES,
} from "@/constants/shop";
import { useCustomerProducts } from "@/hooks/useCustomerProducts";
import { useShopParams } from "@/hooks/useShopParams";
import { rememberShopReturn } from "@/utils/shopReturn";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const CATEGORY_CAROUSEL_ITEMS_PER_VIEW = [
  { minWidth: 1024, count: 4 },
  { minWidth: 640, count: 3 },
  { minWidth: 0, count: 2 },
];

const NEW_ARRIVALS_ITEMS_PER_VIEW = [
  { minWidth: 1024, count: 5 },
  { minWidth: 768, count: 3 },
  { minWidth: 0, count: 2 },
];

export function ShopPage() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const catalogPageParam = Number(searchParams.get(SHOP_CATALOG_PAGE_PARAM));
  const catalogPage = Number.isFinite(catalogPageParam) && catalogPageParam > 0 ? catalogPageParam : 1;
  const { products, isLoadingProducts } = useCustomerProducts();
  const {
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
    isShopResultsMode,
    paginatedProducts,
    totalCount,
    totalPages,
    applyFilters,
    clearFilters,
    setPage,
    setSort,
  } = useShopParams(products);

  const newArrivals = products.slice(0, 8);

  const filterState = {
    categories,
    sizes,
    availability,
    styles,
    priceMin,
    priceMax,
    sort,
  };

  const catalogTotalPages = Math.max(
    1,
    Math.ceil(products.length / SHOP_CATALOG_PAGE_SIZE),
  );

  const catalogProducts = useMemo(() => {
    const pageIndex = Math.min(catalogPage, catalogTotalPages);
    const start = (pageIndex - 1) * SHOP_CATALOG_PAGE_SIZE;
    return products.slice(start, start + SHOP_CATALOG_PAGE_SIZE);
  }, [catalogPage, catalogTotalPages, products]);

  useEffect(() => {
    rememberShopReturn(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  function setCatalogPage(pageNumber) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (pageNumber <= 1) {
          next.delete(SHOP_CATALOG_PAGE_PARAM);
        } else {
          next.set(SHOP_CATALOG_PAGE_PARAM, String(pageNumber));
        }
        return next;
      },
    );
  }

  function toggleCategory(categoryId) {
    const nextCategories = categories.includes(categoryId)
      ? categories.filter((id) => id !== categoryId)
      : [...categories, categoryId];

    applyFilters({ ...filterState, categories: nextCategories });
  }

  if (isShopResultsMode) {
    return (
      <>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-semibold text-hero-dark sm:text-base">
            Product Categories
          </h1>
          <p className="mt-0.5 text-xs font-light text-hero-muted">
            Browse our curated plant collections
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-hero-green transition-opacity hover:opacity-80"
        >
          <Icon svg={preferenceIcon} className="h-5 w-5 text-hero-green" />
          All filters
        </button>
      </div>

      <ItemsCarousel
        showHeader={false}
        items={SHOP_MAIN_CATEGORIES}
        itemsPerView={CATEGORY_CAROUSEL_ITEMS_PER_VIEW}
        renderItem={(category) => (
          <ShopCategoryCard
            label={category.label}
            count={category.count}
            image={category.image}
            isSelected={categories.includes(category.id)}
            onSelect={() => toggleCategory(category.id)}
          />
        )}
      />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-hero-dark">All Products</h2>
        {isLoadingProducts && (
          <p className="text-xs font-light text-hero-muted">Refreshing products...</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {catalogProducts.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              showAddToCart
              onSelect={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>

        <Pagination
          currentPage={Math.min(catalogPage, catalogTotalPages)}
          totalPages={catalogTotalPages}
          onPageChange={setCatalogPage}
        />
      </section>

      <ItemsCarousel
        title="New Arrivals"
        viewAllHref={ROUTES.SHOP}
        items={newArrivals}
        itemsPerView={NEW_ARRIVALS_ITEMS_PER_VIEW}
        renderItem={(plant) => (
          <ProductCarouselCard
            name={plant.name}
            price={plant.price}
            rating={plant.rating}
            image={plant.image}
            href={`/products/${plant.id}`}
          />
        )}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filterState}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
