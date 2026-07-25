import cartIcon from "@/assets/svgs/cart.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/utils";
import { sleep } from "@/utils/sleep";
import { useState } from "react";

export function AddToCartIconButton({
  productId,
  availability = "in-stock",
  className,
  size = "sm",
}) {
  const { addItem, items } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const inCart = Boolean(items[String(productId)]);
  const outOfStock = availability !== "in-stock";
  const disabled = isLoading || inCart || outOfStock;

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;

    setIsLoading(true);
    await sleep(600);
    addItem(productId);
    setIsLoading(false);
  }

  const sizeClasses =
    size === "sm" ? "h-7 w-7" : "h-8 w-8";

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label={
        inCart
          ? "Already in cart"
          : outOfStock
            ? "Out of stock"
            : "Add to cart"
      }
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
        sizeClasses,
        disabled
          ? "cursor-not-allowed bg-gray-100 text-hero-muted opacity-60"
          : "cursor-pointer bg-hero-green text-white hover:bg-hero-green/90",
        className,
      )}
    >
      {isLoading ? (
        <Spinner className="text-white" size="sm" />
      ) : (
        <Icon svg={cartIcon} className={iconSize} />
      )}
    </button>
  );
}
