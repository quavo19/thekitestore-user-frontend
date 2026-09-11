import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MODAL_CART,
  MODAL_SUPPORT,
  MODAL_WISHLIST,
  SHOP_MODAL_PARAM,
} from "@/constants/shop";

export function useModalParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const modal = searchParams.get(SHOP_MODAL_PARAM);

  const openModal = useCallback(
    (name) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(SHOP_MODAL_PARAM, name);
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const closeModal = useCallback(() => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(SHOP_MODAL_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const isCartOpen = modal === MODAL_CART;
  const isWishlistOpen = modal === MODAL_WISHLIST;
  const isSupportOpen = modal === MODAL_SUPPORT;

  return useMemo(
    () => ({
      modal,
      isCartOpen,
      isWishlistOpen,
      isSupportOpen,
      openModal,
      closeModal,
      openCart: () => openModal(MODAL_CART),
      openWishlist: () => openModal(MODAL_WISHLIST),
      openSupport: () => openModal(MODAL_SUPPORT),
    }),
    [modal, isCartOpen, isWishlistOpen, isSupportOpen, openModal, closeModal],
  );
}
