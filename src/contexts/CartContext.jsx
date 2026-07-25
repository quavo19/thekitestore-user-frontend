import { createContext, useCallback, useContext, useMemo, useState } from "react";

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

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart());
  const [isGuest, setIsGuest] = useState(() => readGuestPreference());

  const persist = useCallback((nextItems) => {
    setItems(nextItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  }, []);

  const addItem = useCallback(
    (productId, quantity = 1) => {
      const id = String(productId);
      persist({
        ...items,
        [id]: (items[id] ?? 0) + quantity,
      });
    },
    [items, persist],
  );

  const removeItem = useCallback(
    (productId) => {
      const id = String(productId);
      if (!(id in items)) return;
      const next = { ...items };
      delete next[id];
      persist(next);
    },
    [items, persist],
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const id = String(productId);
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      persist({ ...items, [id]: quantity });
    },
    [items, persist, removeItem],
  );

  const clearCart = useCallback(() => {
    persist({});
  }, [persist]);

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
        productId: Number(id),
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
