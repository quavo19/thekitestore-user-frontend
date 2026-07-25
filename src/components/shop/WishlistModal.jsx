import { SideModal } from "@/components/ui/SideModal";
import { WishlistItemCard } from "@/components/shop/WishlistItemCard";
import { DUMMY_PRODUCTS } from "@/constants/dummyProducts";
import { useWishlist } from "@/contexts/WishlistContext";
import { useModalParams } from "@/hooks/useModalParams";
import { useMemo } from "react";

export function WishlistModal() {
  const { isWishlistOpen, closeModal } = useModalParams();
  const { wishlistIds, count } = useWishlist();

  const wishlistedProducts = useMemo(
    () => DUMMY_PRODUCTS.filter((product) => wishlistIds.has(product.id)),
    [wishlistIds],
  );

  return (
    <SideModal isOpen={isWishlistOpen} onClose={closeModal} title="Wishlist">
      <div className="px-5 py-6">
        {wishlistedProducts.length > 0 ? (
          <>
            <p className="mb-4 text-sm font-light text-hero-muted">
              {count} {count === 1 ? "plant" : "plants"} saved
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
              Tap the heart on any plant to save it here.
            </p>
          </div>
        )}
      </div>
    </SideModal>
  );
}
