import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "karaboome-wishlist";

function readStoredIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => new Set(readStoredIds()));

  const persist = useCallback((next) => {
    setWishlistIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }, []);

  const toggle = useCallback(
    (id) => {
      persist(
        new Set(
          wishlistIds.has(id)
            ? [...wishlistIds].filter((item) => item !== id)
            : [...wishlistIds, id],
        ),
      );
    },
    [persist, wishlistIds],
  );

  const isWishlisted = useCallback(
    (id) => wishlistIds.has(id),
    [wishlistIds],
  );

  const remove = useCallback(
    (id) => {
      if (!wishlistIds.has(id)) return;
      persist(new Set([...wishlistIds].filter((item) => item !== id)));
    },
    [persist, wishlistIds],
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      count: wishlistIds.size,
      toggle,
      remove,
      isWishlisted,
    }),
    [wishlistIds, toggle, remove, isWishlisted],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
