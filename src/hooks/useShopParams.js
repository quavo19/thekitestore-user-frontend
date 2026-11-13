import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DUMMY_PRODUCTS } from "@/constants/dummyProducts";
import {
  SHOP_AVAILABILITY_PARAM,
  SHOP_CATEGORY_PARAM,
  SHOP_PAGE_PARAM,
  SHOP_PAGE_SIZE,
  SHOP_PRICE_MAX_PARAM,
  SHOP_PRICE_MIN_PARAM,
  SHOP_PRICE_RANGE,
  SHOP_PRODUCT_PARAM,
  SHOP_QUERY_PARAM,
  SHOP_SEARCH_PARAM,
  SHOP_SIZE_PARAM,
  SHOP_SORT_PARAM,
  SHOP_SORT_OPTIONS,
  SHOP_STYLE_PARAM,
} from "@/constants/shop";

function parseListParam(value) {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseNumberParam(value, fallback) {
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function useShopParams(products = DUMMY_PRODUCTS, options = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      isSearchOpen: searchParams.get(SHOP_SEARCH_PARAM) === "1",
      query: searchParams.get(SHOP_QUERY_PARAM) ?? "",
      page: Math.max(1, parseNumberParam(searchParams.get(SHOP_PAGE_PARAM), 1)),
      sort: searchParams.get(SHOP_SORT_PARAM) ?? "newest",
      categories: parseListParam(searchParams.get(SHOP_CATEGORY_PARAM)),
      sizes: parseListParam(searchParams.get(SHOP_SIZE_PARAM)),
      availability: parseListParam(searchParams.get(SHOP_AVAILABILITY_PARAM)),
      styles: parseListParam(searchParams.get(SHOP_STYLE_PARAM)),
      priceMin: parseNumberParam(
        searchParams.get(SHOP_PRICE_MIN_PARAM),
        SHOP_PRICE_RANGE.min,
      ),
      priceMax: parseNumberParam(
        searchParams.get(SHOP_PRICE_MAX_PARAM),
        SHOP_PRICE_RANGE.max,
      ),
      productId: searchParams.get(SHOP_PRODUCT_PARAM),
    }),
    [searchParams],
  );

  const hasActiveFilters = useMemo(
    () =>
      params.categories.length > 0 ||
      params.sizes.length > 0 ||
      params.availability.length > 0 ||
      params.styles.length > 0 ||
      params.priceMin > SHOP_PRICE_RANGE.min ||
      params.priceMax < SHOP_PRICE_RANGE.max ||
      params.sort !== "newest",
    [params],
  );

  const isShopResultsMode = useMemo(
    () => Boolean(params.query.trim()) || hasActiveFilters || params.page > 1,
    [params.query, hasActiveFilters, params.page],
  );

  const updateParams = useCallback(
    (updates, { replace = false } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          Object.entries(updates).forEach(([key, value]) => {
            if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
              next.delete(key);
              return;
            }

            if (Array.isArray(value)) {
              next.set(key, value.join(","));
              return;
            }

            next.set(key, String(value));
          });

          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  const openSearchModal = useCallback(() => {
    setSearchParams({ [SHOP_SEARCH_PARAM]: "1" }, { replace: true });
  }, [setSearchParams]);

  const openSearch = useCallback(
    (query = "") => {
      const trimmed = query.trim();
      updateParams({
        [SHOP_SEARCH_PARAM]: "1",
        [SHOP_QUERY_PARAM]: trimmed || null,
        [SHOP_PAGE_PARAM]: null,
        [SHOP_PRODUCT_PARAM]: null,
        ...(trimmed
          ? {}
          : {
              [SHOP_CATEGORY_PARAM]: null,
              [SHOP_SIZE_PARAM]: null,
              [SHOP_AVAILABILITY_PARAM]: null,
              [SHOP_STYLE_PARAM]: null,
              [SHOP_PRICE_MIN_PARAM]: null,
              [SHOP_PRICE_MAX_PARAM]: null,
              [SHOP_SORT_PARAM]: null,
            }),
      });
    },
    [updateParams],
  );

  const setShopQuery = useCallback(
    (query) => {
      const trimmed = query.trim();
      updateParams({
        [SHOP_SEARCH_PARAM]: null,
        [SHOP_QUERY_PARAM]: trimmed || null,
        [SHOP_PAGE_PARAM]: null,
        ...(trimmed
          ? {}
          : {
              [SHOP_CATEGORY_PARAM]: null,
              [SHOP_SIZE_PARAM]: null,
              [SHOP_AVAILABILITY_PARAM]: null,
              [SHOP_STYLE_PARAM]: null,
              [SHOP_PRICE_MIN_PARAM]: null,
              [SHOP_PRICE_MAX_PARAM]: null,
              [SHOP_SORT_PARAM]: null,
            }),
      });
    },
    [updateParams],
  );

  const closeSearch = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        [
          SHOP_SEARCH_PARAM,
          SHOP_QUERY_PARAM,
          SHOP_PAGE_PARAM,
          SHOP_SORT_PARAM,
          SHOP_CATEGORY_PARAM,
          SHOP_SIZE_PARAM,
          SHOP_AVAILABILITY_PARAM,
          SHOP_STYLE_PARAM,
          SHOP_PRICE_MIN_PARAM,
          SHOP_PRICE_MAX_PARAM,
          SHOP_PRODUCT_PARAM,
        ].forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const setPage = useCallback(
    (page) => {
      updateParams({ [SHOP_PAGE_PARAM]: String(page) });
    },
    [updateParams],
  );

  const setSort = useCallback(
    (sort) => {
      updateParams({ [SHOP_SORT_PARAM]: sort, [SHOP_PAGE_PARAM]: null });
    },
    [updateParams],
  );

  const setQuery = useCallback(
    (query) => {
      updateParams({ [SHOP_QUERY_PARAM]: query || null, [SHOP_PAGE_PARAM]: null });
    },
    [updateParams],
  );

  const applyFilters = useCallback(
    (filters) => {
      updateParams({
        [SHOP_CATEGORY_PARAM]: filters.categories,
        [SHOP_SIZE_PARAM]: filters.sizes,
        [SHOP_AVAILABILITY_PARAM]: filters.availability,
        [SHOP_STYLE_PARAM]: filters.styles,
        [SHOP_PRICE_MIN_PARAM]:
          filters.priceMin === SHOP_PRICE_RANGE.min ? null : String(filters.priceMin),
        [SHOP_PRICE_MAX_PARAM]:
          filters.priceMax === SHOP_PRICE_RANGE.max ? null : String(filters.priceMax),
        [SHOP_SORT_PARAM]: filters.sort !== "newest" ? filters.sort : null,
        [SHOP_PAGE_PARAM]: null,
      });
    },
    [updateParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (current) => {
        if (current.get(SHOP_SEARCH_PARAM) === "1") {
          return new URLSearchParams({ [SHOP_SEARCH_PARAM]: "1" });
        }
        return new URLSearchParams();
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const openProduct = useCallback(
    (productId) => {
      updateParams({ [SHOP_PRODUCT_PARAM]: String(productId) });
    },
    [updateParams],
  );

  const closeProduct = useCallback(() => {
    updateParams({ [SHOP_PRODUCT_PARAM]: null });
  }, [updateParams]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    let results = [...products];
    const query = params.query.trim().toLowerCase();

    if (query && !options.skipLocalQueryFilter) {
      results = results.filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.replace(/-/g, " ");
        return (
          name.includes(query) ||
          category.includes(query) ||
          name.replace(/s$/, "").includes(query.replace(/s$/, ""))
        );
      });
    }

    if (params.categories.length) {
      results = results.filter((product) =>
        params.categories.some(category => category === product.category || product.categoryIds?.includes(category)),
      );
    }

    if (params.sizes.length) {
      results = results.filter((product) => params.sizes.includes(product.size));
    }

    if (params.availability.length) {
      results = results.filter((product) =>
        params.availability.includes(product.availability),
      );
    }

    if (params.styles.length) {
      results = results.filter((product) => params.styles.includes(product.style));
    }

    const priceMin = Math.min(params.priceMin, params.priceMax);
    const priceMax = Math.max(params.priceMin, params.priceMax);

    results = results.filter(
      (product) => (params.priceMin === SHOP_PRICE_RANGE.min || product.price >= priceMin) && (params.priceMax === SHOP_PRICE_RANGE.max || product.price <= priceMax),
    );

    switch (params.sort) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }

    return results;
  }, [options.skipLocalQueryFilter, params, products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / SHOP_PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const page = Math.min(params.page, totalPages);
    const start = (page - 1) * SHOP_PAGE_SIZE;
    return filteredProducts.slice(start, start + SHOP_PAGE_SIZE);
  }, [filteredProducts, params.page, totalPages]);

  const sortLabel =
    SHOP_SORT_OPTIONS.find((option) => option.id === params.sort)?.label ??
    "Newest Arrivals";

  return {
    ...params,
    hasActiveFilters,
    isShopResultsMode,
    totalPages,
    totalCount: filteredProducts.length,
    paginatedProducts,
    sortLabel,
    updateParams,
    openSearchModal,
    openSearch,
    setShopQuery,
    closeSearch,
    setPage,
    setSort,
    setQuery,
    applyFilters,
    clearFilters,
    openProduct,
    closeProduct,
  };
}
