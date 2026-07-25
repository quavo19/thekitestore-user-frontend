export { DUMMY_PRODUCTS as PRODUCTS } from "@/constants/dummyProducts";
export { DUMMY_PRODUCTS } from "@/constants/dummyProducts";

import { DUMMY_PRODUCTS } from "@/constants/dummyProducts";

export function getProductById(id) {
  return DUMMY_PRODUCTS.find((product) => product.id === Number(id));
}

export function getProductBySlug(slug) {
  return DUMMY_PRODUCTS.find((product) => product.slug === slug);
}
