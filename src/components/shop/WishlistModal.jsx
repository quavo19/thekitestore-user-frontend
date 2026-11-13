import { SideModal } from "@/components/ui/SideModal";
import { WishlistItemCard } from "@/components/shop/WishlistItemCard";
import { getProductById } from "@/constants/products";
import { useWishlist } from "@/contexts/WishlistContext";
import { useModalParams } from "@/hooks/useModalParams";
import { useMemo } from "react";

export function WishlistModal() {
  const { isWishlistOpen, closeModal } = useModalParams();
  const { wishlistIds, wishlistProducts, count, isSyncingWishlist, wishlistError } = useWishlist();

  const wishlistedProducts = useMemo(
    () =>
      [...wishlistIds]
        .map((id) => wishlistProducts[String(id)] || getProductById(id))
        .filter(Boolean),
    [wishlistIds, wishlistProducts],
  );

  return (
    <SideModal isOpen={isWishlistOpen} onClose={closeModal} title="Wishlist">
      <div className="px-5 py-6">
        {wishlistedProducts.length > 0 ? (
          <>
            {isSyncingWishlist && (
              <p className="mb-4 text-sm font-light text-hero-muted">
                Syncing your wishlist...
              </p>
            )}
            {wishlistError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-light text-red-600">
                {wishlistError}
              </p>
            )}
            <p className="mb-4 text-sm font-light text-hero-muted">
              {count} {count === 1 ? "product" : "products"} saved
            </p>
            <div className="modal-item-list grid grid-cols-2 gap-4">
              {wishlistedProducts.map((product) => (
                <WishlistItemCard
                  key={product.id}
                  product={product}
                  onSelect={closeModal}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-base font-medium text-hero-dark">
              Your wishlist is empty
            </p>
            <p className="mt-2 text-sm font-light text-hero-muted">
              Tap the heart on any product to save it here.
            </p>
          </div>
        )}
      </div>
    </SideModal>
  );
}
