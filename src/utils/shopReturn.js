import { ROUTES } from "@/constants";

export const SHOP_RETURN_STORAGE_KEY = "karaboome-shop-return";

export function rememberShopReturn(path) {
  if (!path) return;
  sessionStorage.setItem(SHOP_RETURN_STORAGE_KEY, path);
}

export function getShopReturn() {
  return sessionStorage.getItem(SHOP_RETURN_STORAGE_KEY) || ROUTES.SHOP;
}
