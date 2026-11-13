import { CATALOG_CATEGORIES } from "./catalog";
export const SHOP_CATEGORIES = CATALOG_CATEGORIES;
export const SHOP_MAIN_CATEGORIES = CATALOG_CATEGORIES;

export const SHOP_SIZES = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

export const SHOP_AVAILABILITY = [
  { id: "in-stock", label: "In stock" },
  { id: "pre-order", label: "Pre-order" },
];

export const SHOP_STYLES = [
  { id: "modern", label: "Modern" },
  { id: "minimalist", label: "Minimalist" },
  { id: "tropical", label: "Tropical" },
  { id: "rustic", label: "Rustic" },
];

export const SHOP_SORT_OPTIONS = [
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
];

export const SHOP_PAGE_SIZE = 12;
export const SHOP_CATALOG_PAGE_SIZE = 10;

export const SHOP_PRICE_RANGE = {
  min: 0,
  max: 100000,
  step: 50,
};

export const SHOP_SEARCH_PARAM = "search";
export const SHOP_QUERY_PARAM = "query";
export const SHOP_PAGE_PARAM = "page";
export const SHOP_CATALOG_PAGE_PARAM = "catalogPage";
export const SHOP_SORT_PARAM = "sort";
export const SHOP_CATEGORY_PARAM = "category";
export const SHOP_SIZE_PARAM = "size";
export const SHOP_AVAILABILITY_PARAM = "availability";
export const SHOP_STYLE_PARAM = "style";
export const SHOP_PRICE_MIN_PARAM = "priceMin";
export const SHOP_PRICE_MAX_PARAM = "priceMax";
export const SHOP_PRODUCT_PARAM = "product";
export const SHOP_MODAL_PARAM = "modal";
export const MODAL_CART = "cart";
export const MODAL_WISHLIST = "wishlist";
export const MODAL_SUPPORT = "support";
