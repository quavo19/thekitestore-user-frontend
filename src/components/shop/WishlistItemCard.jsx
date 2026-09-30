import cartIcon from "@/assets/svgs/cart.svg?raw";
import heartIcon from "@/assets/svgs/Heart.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils";
import { useState } from "react";

function money(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

export function WishlistItemCard({ product, onSelect }) {
  const { addItem } = useCart();
  const { remove } = useWishlist();
  const [phase, setPhase] = useState("idle");

  async function handleAddToCart(event) {
    event.stopPropagation();
    if (phase !== "idle") return;

    setPhase("loading");
    try {
      await addItem(product.id, 1, product, product.defaultVariantStock?.id);
      await sleep(350);
      setPhase("exiting");
      await sleep(450);
      await remove(product.id);
    } catch {
      setPhase("idle");
    }
  }

  async function handleRemove(event) {
    event.stopPropagation();
    if (phase !== "idle") return;

    setPhase("exiting");
    await sleep(350);
    try {
      await remove(product.id);
    } catch {
      setPhase("idle");
    }
  }

  const isBusy = phase !== "idle";

  return (
    <article
      className={cn(
        "group flex flex-col transition-all duration-300 ease-out",
        phase === "exiting" && "modal-item-exit pointer-events-none",
        phase === "loading" && "opacity-90",
        !isBusy && "cursor-pointer",
      )}
      onClick={() => {
        if (!isBusy) onSelect?.(product);
      }}
      onKeyDown={(event) => {
        if (isBusy) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(product);
        }
      }}
      role="button"
      tabIndex={isBusy ? -1 : 0}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-50">
        {phase === "exiting" && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center rounded-2xl bg-hero-green/90">
            <p className="px-3 text-center text-xs font-medium text-white">
              Moved to cart
            </p>
          </div>
        )}

        <button
          type="button"
          aria-label="Remove from wishlist"
          disabled={isBusy}
          onClick={handleRemove}
          className="absolute right-3 top-3 z-[1] inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-hero-green text-white shadow-sm transition-colors hover:bg-hero-green/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon svg={heartIcon} className="h-4 w-4 fill-white text-white" />
        </button>

        <div className="flex aspect-[4/3] items-center justify-center p-4 transition-colors group-hover:bg-gray-100/80">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <h3 className="truncate text-sm font-semibold text-hero-dark">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-hero-dark">
          {money(product.price)}
        </p>
        <button
          type="button"
          disabled={isBusy}
          onClick={handleAddToCart}
          className={cn(
            "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
            phase === "loading"
              ? "bg-hero-green/80 text-white"
              : "bg-hero-green text-white hover:opacity-90",
            isBusy && "cursor-not-allowed",
          )}
        >
          {phase === "loading" ? (
            <Spinner className="text-white" />
          ) : (
            <>
              <Icon svg={cartIcon} className="h-4 w-4" />
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}
