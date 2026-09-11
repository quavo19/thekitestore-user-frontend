/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";

const CART_STORAGE_KEY = "karaboome-cart";
const GUEST_STORAGE_KEY = "karaboome-guest-shopper";

function readStoredCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readGuestPreference() {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored == null) return true;
    return stored === "true";
  } catch {
    return true;
  }
}

function cartKey(productId, variantStockId) {
  return variantStockId ? `${productId}:${variantStockId}` : String(productId);
}

function parseCartKey(key) {
  const [productId, variantStockId] = String(key).split(":");
  return { productId, variantStockId: variantStockId || null };
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useUser();
  const [items, setItems] = useState(() => readStoredCart());
  const [itemProducts, setItemProducts] = useState({});
  const [isSyncingCart, setIsSyncingCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [isGuest, setIsGuest] = useState(() => readGuestPreference());

  const persist = useCallback((nextItems) => {
    setItems(nextItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  }, []);

  const setApiItems = useCallback((apiItems) => {
    const nextItems = {};
    const nextProducts = {};

    apiItems.forEach((item) => {
      if (!item.productId) return;
      const id = cartKey(item.productId, item.variantStockId);
      nextItems[id] = Number(item.quantity || 1);
      if (item.product) {
        nextProducts[id] = item.product;
      }
    });

    setItems(nextItems);
    setItemProducts(nextProducts);
    setIsGuest(false);
    localStorage.setItem(GUEST_STORAGE_KEY, "false");
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsSyncingCart(true);
    setCartError("");

    try {
      const response = await customerService.getCart();
      setApiItems(response.items || []);
    } catch (error) {
      setCartError(error.message || "Unable to load your cart.");
    } finally {
      setIsSyncingCart(false);
    }
  }, [isAuthenticated, setApiItems]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setTimeout(() => {
      const guestItems = readStoredCart();
      const guestItemsList = Object.entries(guestItems).map(([key, quantity]) => ({
        ...parseCartKey(key),
        quantity: Number(quantity || 1),
      }));

      if (guestItemsList.length > 0 && readGuestPreference()) {
        Promise.allSettled(guestItemsList.map(({ productId, variantStockId, quantity }) => customerService.addToCart(productId, variantStockId, quantity)))
          .finally(() => refreshCart());
        return;
      }

      refreshCart();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, refreshCart]);

  const addItem = useCallback(
    async (productId, quantity = 1, product = null, variantStockId = null) => {
      const selectedVariantStockId = variantStockId || product?.defaultVariantStock?.id;
      const id = cartKey(productId, selectedVariantStockId);

      if (isAuthenticated) {
        setCartError("");
        try {
          await customerService.addToCart(productId, selectedVariantStockId, quantity);
          persist({
            ...items,
            [id]: Number(items[id] || 0) + quantity,
          });
          if (product) {
            setItemProducts((current) => ({ ...current, [id]: product }));
          }
          await refreshCart();
          return;
        } catch (error) {
          setCartError(error.message || "Unable to add this item to your cart.");
          throw error;
        }
      }

      persist({
        ...items,
        [id]: (items[id] ?? 0) + quantity,
      });
      if (product) {
        setItemProducts((current) => ({ ...current, [id]: product }));
      }
    },
    [isAuthenticated, items, persist, refreshCart],
  );

  const removeItem = useCallback(
    async (productId, variantStockId = null) => {
      const id = cartKey(productId, variantStockId);
      if (!(id in items)) return;

      if (isAuthenticated) {
        setCartError("");
        try {
          await customerService.removeFromCart(productId, variantStockId);
        } catch (error) {
          setCartError(error.message || "Unable to remove this item from your cart.");
          throw error;
        }
      }

      const next = { ...items };
      delete next[id];
      persist(next);
      setItemProducts((current) => {
        const nextProducts = { ...current };
        delete nextProducts[id];
        return nextProducts;
      });
    },
    [isAuthenticated, items, persist],
  );

  const updateQuantity = useCallback(
    async (productId, quantity, variantStockId = null) => {
      const id = cartKey(productId, variantStockId);
      if (quantity <= 0) {
        removeItem(productId, variantStockId);
        return;
      }
      if (isAuthenticated) {
        setCartError("");
        try {
          await customerService.updateCartQuantity(productId, variantStockId, quantity);
        } catch (error) {
          setCartError(error.message || "Unable to update this cart item.");
          throw error;
        }
      }
      persist({ ...items, [id]: quantity });
    },
    [isAuthenticated, items, persist, removeItem],
  );

  const clearCart = useCallback(async () => {
    const productIds = Object.keys(items);

    if (isAuthenticated) {
      await Promise.allSettled(productIds.map((key) => {
        const { productId, variantStockId } = parseCartKey(key);
        return customerService.removeFromCart(productId, variantStockId);
      }));
    }
    persist({});
    setItemProducts({});
  }, [isAuthenticated, items, persist]);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    localStorage.setItem(GUEST_STORAGE_KEY, "true");
  }, []);

  const count = useMemo(
    () => Object.values(items).reduce((total, qty) => total + qty, 0),
    [items],
  );

  const cartItems = useMemo(
    () =>
      Object.entries(items).map(([id, quantity]) => ({
        ...parseCartKey(id),
        id,
        quantity,
      })),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      cartItems,
      count,
      isGuest,
      itemProducts,
      isSyncingCart,
      cartError,
      refreshCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      continueAsGuest,
    }),
    [
      items,
      cartItems,
      count,
      isGuest,
      itemProducts,
      isSyncingCart,
      cartError,
      refreshCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      continueAsGuest,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
