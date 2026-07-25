import heartIcon from "@/assets/svgs/Heart.svg?raw";
import { AddToCartIconButton } from "@/components/shop/AddToCartIconButton";
import { Icon } from "@/components/ui/Icon";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/utils";

function ProductStars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "text-xs",
            index < fullStars
              ? "text-hero-green"
              : index === fullStars && hasHalf
                ? "text-hero-green/60"
                : "text-gray-200",
          )}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ShopProductCard({
  product,
  onSelect,
  showWishlist = true,
  showAddToCart = false,
  className,
}) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggle(product.id);
  }

  function handleClick() {
    onSelect?.(product);
  }

  return (
    <article
      className={cn("group flex cursor-pointer flex-col", className)}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-50">
        {showWishlist && (
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={handleWishlistClick}
            className={cn(
              "absolute right-3 top-3 z-[1] inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors",
              wishlisted
                ? "bg-hero-green text-white hover:bg-hero-green/90"
                : "bg-white/90 text-hero-muted hover:bg-white",
            )}
          >
            <Icon
              svg={heartIcon}
              className={cn(
                "h-4 w-4 transition-colors",
                wishlisted ? "fill-white text-white" : "text-current",
              )}
            />
          </button>
        )}

        {showAddToCart && (
          <div className="absolute bottom-3 right-3 z-[1]">
            <AddToCartIconButton
              productId={product.id}
              availability={product.availability}
            />
          </div>
        )}

        <div className="relative aspect-[4/3] overflow-hidden transition-colors group-hover:bg-gray-100/80">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <h3 className="truncate text-sm font-semibold text-hero-dark">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <ProductStars rating={product.rating} />
          <span className="text-xs font-light text-hero-muted">
            {product.rating} ({product.reviewCount} Reviews)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {product.originalPrice > product.price && (
            <span className="text-sm font-light text-hero-muted line-through">
              ${product.originalPrice.toFixed(0)}
            </span>
          )}
          <span className="text-sm font-semibold text-hero-dark">
            ${product.price.toFixed(0)}
          </span>
        </div>
      </div>
    </article>
  );
}
