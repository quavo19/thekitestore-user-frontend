import cartIcon from "@/assets/svgs/cart.svg?raw";
import closeIcon from "@/assets/svgs/Close.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { SideModal } from "@/components/ui/SideModal";
import { getProductById } from "@/constants/products";
import { useCart } from "@/contexts/CartContext";
import { useModalParams } from "@/hooks/useModalParams";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils";
import { useMemo, useState } from "react";

function CartLineItem({ product, quantity, onUpdateQuantity, onRemove }) {
  const [phase, setPhase] = useState("idle");

  async function handleRemove() {
    if (phase !== "idle") return;
    setPhase("exiting");
    await sleep(350);
    onRemove();
  }

  async function handleUpdateQuantity(next) {
    if (phase !== "idle") return;
    if (next <= 0) {
      await handleRemove();
      return;
    }
    onUpdateQuantity(next);
  }

  const isBusy = phase !== "idle";

  return (
    <div
      className={cn(
        "flex gap-3 border-b border-gray-100 py-4 transition-all duration-300 ease-out last:border-b-0",
        phase === "exiting" && "modal-item-exit pointer-events-none",
      )}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-hero-dark">
              {product.name}
            </p>
            <p className="mt-1 text-sm font-light text-hero-muted">
              ${product.price.toFixed(2)} each
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${product.name} from cart`}
            disabled={isBusy}
            onClick={handleRemove}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-hero-muted transition-colors hover:bg-gray-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon svg={closeIcon} className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-gray-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={isBusy}
              onClick={() => handleUpdateQuantity(quantity - 1)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-sm text-hero-dark transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-light text-hero-dark">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isBusy}
              onClick={() => handleUpdateQuantity(quantity + 1)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-sm text-hero-dark transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-hero-dark">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CartModal() {
  const { isCartOpen, closeModal } = useModalParams();
  const { cartItems, count, isGuest, updateQuantity, removeItem, clearCart, continueAsGuest } =
    useCart();

  const lineItems = useMemo(
    () =>
      cartItems
        .map(({ productId, quantity }) => {
          const product = getProductById(productId);
          if (!product) return null;
          return { product, quantity };
        })
        .filter(Boolean),
    [cartItems],
  );

  const subtotal = lineItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <SideModal
      isOpen={isCartOpen}
      onClose={closeModal}
      title="Cart"
      footer={
        lineItems.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-light text-hero-muted">Subtotal</span>
              <span className="font-semibold text-hero-dark">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                continueAsGuest();
                closeModal();
              }}
              className="w-full cursor-pointer rounded-lg bg-hero-green py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Checkout as Guest
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full cursor-pointer rounded-lg border border-gray-200 py-3 text-sm font-light text-hero-muted transition-colors hover:bg-gray-50"
            >
              Clear cart
            </button>
          </div>
        ) : null
      }
    >
      <div className="px-5 py-6">
        {isGuest && (
          <div className="mb-4 rounded-xl bg-hero-sage/40 px-4 py-3">
            <p className="text-sm font-medium text-hero-dark">Shopping as a guest</p>
            <p className="mt-1 text-xs font-light text-hero-muted">
              No account needed. Your cart is saved on this device until checkout.
            </p>
          </div>
        )}

        {lineItems.length > 0 ? (
          <>
            <p className="mb-2 text-sm font-light text-hero-muted">
              {count} {count === 1 ? "item" : "items"} in your cart
            </p>
            <div className="modal-item-list">
              {lineItems.map(({ product, quantity }) => (
                <CartLineItem
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  onUpdateQuantity={(next) => updateQuantity(product.id, next)}
                  onRemove={() => removeItem(product.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-hero-muted">
              <Icon svg={cartIcon} className="h-6 w-6" />
            </span>
            <p className="mt-4 text-base font-medium text-hero-dark">
              Your cart is empty
            </p>
            <p className="mt-2 text-sm font-light text-hero-muted">
              Browse plants and add your favourites to get started.
            </p>
          </div>
        )}
      </div>
    </SideModal>
  );
}
