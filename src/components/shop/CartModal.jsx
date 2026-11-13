import cartIcon from "@/assets/svgs/cart.svg?raw";
import closeIcon from "@/assets/svgs/Close.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { SideModal } from "@/components/ui/SideModal";
import { getProductById } from "@/constants/products";
import { ROUTES } from "@/constants";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useModalParams } from "@/hooks/useModalParams";
import { sleep } from "@/utils/sleep";
import { cn } from "@/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function money(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function variantLabel(product) {
  const stock = product.defaultVariantStock;
  const options = (stock?.options || []).filter((option) => option.variant_type_pricing_role !== "base");
  const names = options.length ? options.map((option) => option.name) : (stock?.option_names || []).map((name) => {
    const [type, ...value] = String(name).split(":");
    if (type?.trim().toLowerCase() === "base") return "";
    return value.join(":").trim() || type?.trim();
  });

  return names.filter(Boolean);
}

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
            {variantLabel(product).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {variantLabel(product).map((option) => (
                  <span key={option} className="bg-hero-sage/35 px-2 py-1 text-xs font-medium text-hero-dark">
                    {option}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm font-light text-hero-muted">
              {money(product.price)} each
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
            {money(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CartModal() {
  const { isCartOpen, closeModal } = useModalParams();
  const navigate = useNavigate();
  const { isAuthenticated, startGoogleAuth } = useUser();
  const {
    cartItems,
    count,
    isGuest,
    itemProducts,
    isSyncingCart,
    cartError,
    updateQuantity,
    removeItem,
    clearCart,
    continueAsGuest,
  } =
    useCart();

  const lineItems = useMemo(
    () =>
      cartItems
        .map(({ id, productId, quantity }) => {
          const product = itemProducts[id] || itemProducts[String(productId)] || getProductById(productId);
          if (!product) return null;
          return { id, product, quantity };
        })
        .filter(Boolean),
    [cartItems, itemProducts],
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
                {money(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  continueAsGuest();
                  startGoogleAuth(ROUTES.CHECKOUT);
                  return;
                }
                navigate(ROUTES.CHECKOUT);
                closeModal();
              }}
              className="w-full cursor-pointer rounded-lg bg-hero-green py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {isAuthenticated ? "Proceed to checkout" : "Sign up with Google to continue"}
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

        {isSyncingCart && (
          <p className="mb-4 text-sm font-light text-hero-muted">Syncing your cart...</p>
        )}

        {cartError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-light text-red-600">
            {cartError}
          </p>
        )}

        {lineItems.length > 0 ? (
          <>
            <p className="mb-2 text-sm font-light text-hero-muted">
              {count} {count === 1 ? "item" : "items"} in your cart
            </p>
            <div className="modal-item-list">
              {lineItems.map(({ id, product, quantity }) => (
                <CartLineItem
                  key={id}
                  product={product}
                  quantity={quantity}
                  onUpdateQuantity={(next) => updateQuantity(product.id, next, product.defaultVariantStock?.id)}
                  onRemove={() => removeItem(product.id, product.defaultVariantStock?.id)}
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
              Browse devices and accessories to find your next favourite.
            </p>
          </div>
        )}
      </div>
    </SideModal>
  );
}
