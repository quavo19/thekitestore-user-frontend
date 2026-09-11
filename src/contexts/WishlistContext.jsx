/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";

const STORAGE_KEY = "karaboome-wishlist";

function readStoredIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useUser();
  const [wishlistIds, setWishlistIds] = useState(() => new Set(readStoredIds()));
  const [wishlistProducts, setWishlistProducts] = useState({});
  const [isSyncingWishlist, setIsSyncingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  const persist = useCallback((next) => {
    setWishlistIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }, []);

  const setApiItems = useCallback((apiItems) => {
    const nextIds = new Set();
    const nextProducts = {};

    apiItems.forEach((item) => {
      if (!item.productId) return;
      const id = String(item.productId);
      nextIds.add(id);
      if (item.product) {
        nextProducts[id] = item.product;
      }
    });

    setWishlistIds(nextIds);
    setWishlistProducts(nextProducts);
  }, []);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsSyncingWishlist(true);
    setWishlistError("");

    try {
      const response = await customerService.getWishlist();
      setApiItems(response.items || []);
    } catch (error) {
      setWishlistError(error.message || "Unable to load your wishlist.");
    } finally {
      setIsSyncingWishlist(false);
    }
  }, [isAuthenticated, setApiItems]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setTimeout(() => {
      refreshWishlist();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, refreshWishlist]);

  const toggle = useCallback(
    async (id) => {
      const productId = String(id);
      const nextIds = new Set(wishlistIds);

      if (isAuthenticated) {
        setWishlistError("");
        try {
          if (wishlistIds.has(productId)) {
            await customerService.removeFromWishlist(productId);
            nextIds.delete(productId);
            setWishlistProducts((current) => {
              const nextProducts = { ...current };
              delete nextProducts[productId];
              return nextProducts;
            });
          } else {
            await customerService.addToWishlist(productId);
            nextIds.add(productId);
            await refreshWishlist();
            return;
          }

          persist(nextIds);
          return;
        } catch (error) {
          setWishlistError(error.message || "Unable to update your wishlist.");
          throw error;
        }
      }

      setWishlistError("Please sign in to use your wishlist.");
      throw new Error("Please sign in to use your wishlist.");
    },
    [isAuthenticated, persist, refreshWishlist, wishlistIds],
  );

  const isWishlisted = useCallback(
    (id) => wishlistIds.has(String(id)),
    [wishlistIds],
  );

  const remove = useCallback(
    async (id) => {
      const productId = String(id);
      if (!wishlistIds.has(productId)) return;

      if (isAuthenticated) {
        setWishlistError("");
        try {
          await customerService.removeFromWishlist(productId);
        } catch (error) {
          setWishlistError(error.message || "Unable to remove this item from your wishlist.");
          throw error;
        }
      }

      persist(new Set([...wishlistIds].filter((item) => item !== productId)));
      setWishlistProducts((current) => {
        const nextProducts = { ...current };
        delete nextProducts[productId];
        return nextProducts;
      });
    },
    [isAuthenticated, persist, wishlistIds],
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistProducts,
      count: wishlistIds.size,
      isSyncingWishlist,
      wishlistError,
      refreshWishlist,
      toggle,
      remove,
      isWishlisted,
    }),
    [
      wishlistIds,
      wishlistProducts,
      isSyncingWishlist,
      wishlistError,
      refreshWishlist,
      toggle,
      remove,
      isWishlisted,
    ],
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
