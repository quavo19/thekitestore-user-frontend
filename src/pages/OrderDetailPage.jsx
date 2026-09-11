import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bagIcon from "@/assets/svgs/Bag.svg?raw";
import googleIcon from "@/assets/svgs/Google.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";
import { cn } from "@/utils";

function money(value) {
  const amount = Number(value || 0);
  return `GHS ${amount.toFixed(2)}`;
}

function dateLabel(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClass(status) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700";
    case "cancelled":
      return "bg-red-50 text-red-700";
    case "confirmed":
    case "dispatched":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function titleCase(value) {
  return String(value || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function addressText(addressRecord) {
  const attrs = addressRecord?.attributes || {};
  const address = attrs.address || {};
  return [
    address.line1,
    address.street,
    address.formatted,
    attrs.city,
    attrs.region,
    attrs.country || "Ghana",
  ]
    .filter(Boolean)
    .join(", ");
}

function orderItems(order) {
  return order?.relationships?.order_items?.data || [];
}

function fulfillments(order) {
  return order?.relationships?.fulfillments?.data || [];
}

function imageUrl(item) {
  return item?.attributes?.image?.url || "";
}

function variantOptionsText(value) {
  return String(value || "")
    .split("/")
    .map((part) => {
      const [type, ...optionParts] = part.split(":");
      if (type?.trim().toLowerCase() === "base") return "";
      return (optionParts.join(":").trim() || type?.trim());
    })
    .filter(Boolean)
    .join(" / ");
}

const ORDER_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "dispatched", label: "Dispatched" },
  { key: "received", label: "Received" },
  { key: "completed", label: "Completed" },
];

function orderStepIndex(status) {
  const index = ORDER_STEPS.findIndex((step) => step.key === status);
  return index >= 0 ? index : 0;
}

function OrderProgress({ status }) {
  const currentStatus = status || "pending";
  const currentIndex = orderStepIndex(currentStatus);
  const isInterrupted = ["cancelled", "returning"].includes(currentStatus);

  return (
    <section className="bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
            Progress
          </p>
          <h2 className="mt-2 font-serif text-3xl text-hero-dark">Order journey</h2>
        </div>
        {isInterrupted && (
          <span className={cn("px-4 py-2 text-xs font-medium", statusClass(currentStatus))}>
            {titleCase(currentStatus)}
          </span>
        )}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-5 sm:gap-3">
        {ORDER_STEPS.map((step, index) => {
          const isComplete = !isInterrupted && index < currentIndex;
          const isCurrent = !isInterrupted && index === currentIndex;
          const isDone = !isInterrupted && index <= currentIndex;

          return (
            <div key={step.key} className="relative isolate flex gap-3 sm:block">
              {index < ORDER_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[15px] top-11 -z-10 h-[calc(100%-0.25rem)] w-px bg-[#9eb294] sm:left-[calc(50%+1.75rem)] sm:top-5 sm:h-px sm:w-[calc(100%-3.5rem)]",
                    isComplete && "bg-[#0f7a3d]",
                  )}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c6d5be] text-xs font-bold text-[#4f6648] sm:mx-auto sm:h-10 sm:w-10 sm:text-sm",
                  isDone && "bg-[#0f7a3d] text-white",
                  isCurrent && "bg-[#cfe6d5] !text-[#075f2f] ring-4 ring-[#2ea65a]",
                )}
              >
                {isComplete || currentStatus === "completed" ? (
                  <span aria-hidden="true">✓</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="min-w-0 pb-3 sm:mt-3 sm:pb-0 sm:text-center">
                <p
                  style={isDone ? { color: isCurrent ? "#075f2f" : "#0f7a3d" } : undefined}
                  className={cn("text-sm font-medium text-hero-muted", isDone && "!text-[#0f7a3d]", isCurrent && "!text-[#075f2f]")}
                >
                  {step.label}
                </p>
                <p
                  style={isDone ? { color: isCurrent ? "#075f2f" : "#0f7a3d" } : undefined}
                  className={cn("mt-1 text-xs font-light text-hero-muted", isDone && "font-semibold !text-[#0f7a3d]", isCurrent && "!text-[#075f2f]")}
                >
                  {isComplete || currentStatus === "completed"
                    ? "Completed"
                    : isCurrent
                      ? "Current stage"
                      : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StarsInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const point = index + 1;
        return (
          <button
            type="button"
            key={point}
            onClick={() => onChange(point)}
            className={cn(
              "cursor-pointer text-3xl transition-colors",
              point <= value ? "text-hero-green" : "text-hero-sage",
            )}
            aria-label={`${point} star${point === 1 ? "" : "s"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isAuthenticated, isLoadingUser, startGoogleAuth, fetchCurrentUser } = useUser();
  const [order, setOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isMarkingReceived, setIsMarkingReceived] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewPoints, setReviewPoints] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !orderId) return undefined;

    const timer = window.setTimeout(async () => {
      setIsLoadingOrder(true);
      setError("");
      try {
        const response = await customerService.getOrder(orderId);
        setOrder(response?.data || null);
      } catch (nextError) {
        setError(nextError.message || "Unable to load this order.");
      } finally {
        setIsLoadingOrder(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, orderId]);

  const attrs = order?.attributes || {};
  const items = useMemo(() => orderItems(order), [order]);
  const canReviewItems = ["received", "completed"].includes(attrs.status);
  const canMarkReceived = !["received", "completed", "cancelled", "returning"].includes(attrs.status);
  const address = order?.relationships?.customer_address;
  const deliveryAddress = addressText(address);
  const phones = Array.isArray(attrs.phones) ? attrs.phones : [];

  function openReviewModal(item) {
    setReviewItem(item);
    setReviewPoints(5);
    setReviewComment("");
    setReviewError("");
  }

  function closeReviewModal() {
    if (isSubmittingReview) return;
    setReviewItem(null);
    setReviewComment("");
    setReviewError("");
  }

  async function submitReview(event) {
    event.preventDefault();
    const itemAttrs = reviewItem?.attributes || {};
    if (!itemAttrs.product_id) return;

    setIsSubmittingReview(true);
    setReviewError("");
    try {
      await customerService.createReview(itemAttrs.product_id, {
        points: reviewPoints,
        comment: reviewComment.trim() || null,
      });
      setReviewItem(null);
      setReviewComment("");
    } catch (nextError) {
      setReviewError(nextError.message || "Unable to save your review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  async function markReceived() {
    if (!order || isMarkingReceived || !canMarkReceived) return;

    setIsMarkingReceived(true);
    setActionError("");
    try {
      const response = await customerService.markOrderReceived(attrs.order_id || order.id);
      setOrder(response?.data || null);
      await fetchCurrentUser();
    } catch (nextError) {
      setActionError(nextError.message || "Unable to mark this order as received.");
    } finally {
      setIsMarkingReceived(false);
    }
  }

  if (!isAuthenticated && !isLoadingUser) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <p className="font-serif text-4xl text-hero-dark">Order details</p>
        <p className="mt-3 max-w-md text-sm font-light leading-6 text-hero-muted">
          Sign in to view this order and its delivery details.
        </p>
        <button
          type="button"
          onClick={startGoogleAuth}
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-hero-green px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <Icon svg={googleIcon} className="h-4 w-4" />
          </span>
          Sign in with Google
        </button>
      </section>
    );
  }

  if (isLoadingOrder || isLoadingUser) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-hero-green">
        <Spinner size="md" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-3xl bg-white px-6 py-16 text-center">
        <Icon svg={bagIcon} className="mx-auto h-9 w-9 text-hero-muted" />
        <p className="mt-5 font-serif text-3xl text-hero-dark">Order unavailable</p>
        <p className="mt-2 text-sm font-light text-hero-muted">
          {error || "We could not find this order."}
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ORDERS)}
          className="mt-6 cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white"
        >
          Back to orders
        </button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(ROUTES.ORDERS)}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-hero-green"
      >
        <span aria-hidden="true">←</span>
        Back to orders
      </button>

      <section className="grid gap-6 bg-white p-5 sm:p-7 lg:grid-cols-[1fr_0.55fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
            Order #{attrs.order_id || order.id?.slice(0, 8)}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-hero-dark sm:text-5xl">
            {titleCase(attrs.status)} order
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-hero-muted">
            Placed on {dateLabel(attrs.created_at)}. We will use the contact and shipping
            details below for this delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={markReceived}
              disabled={!canMarkReceived || isMarkingReceived}
              className="cursor-pointer bg-hero-green px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingReceived ? "Marking..." : canMarkReceived ? "Mark received +#1" : "Received"}
            </button>
            <span className={cn("rounded-full px-4 py-2 text-xs font-medium", statusClass(attrs.status))}>
              {titleCase(attrs.status)}
            </span>
            <span className={cn("rounded-full px-4 py-2 text-xs font-medium", statusClass(attrs.payment_status))}>
              {attrs.payment_status === "completed" ? "Paid" : titleCase(attrs.payment_status)}
            </span>
          </div>
          {actionError && (
            <p className="mt-4 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </p>
          )}
        </div>

        <div className="bg-hero-sage/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
            Total paid
          </p>
          <p className="mt-2 font-serif text-4xl text-hero-dark">
            {money(attrs.total_price ?? attrs.total_amount)}
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-hero-muted">Items</span>
              <span className="font-medium text-hero-dark">{money(attrs.item_subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-hero-muted">Delivery</span>
              <span className="font-medium text-hero-dark">{money(attrs.delivery_fee)}</span>
            </div>
          </div>
        </div>
      </section>

      <OrderProgress status={attrs.status} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="bg-white p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-hero-dark">Shipping details</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                Address
              </p>
              <p className="mt-2 font-light leading-6 text-hero-dark">
                {deliveryAddress || "Address unavailable"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                Contact numbers
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {phones.length ? (
                  phones.map((phone) => (
                    <span key={phone} className="bg-hero-sage/30 px-3 py-2 text-hero-dark">
                      {phone}
                    </span>
                  ))
                ) : (
                  <span className="font-light text-hero-muted">No contact number saved.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-hero-dark">Fulfillment</h2>
          <div className="mt-5 space-y-4">
            {fulfillments(order).length ? (
              fulfillments(order).map((fulfillment) => {
                const fulfillmentAttrs = fulfillment.attributes || {};
                const warehouse = fulfillmentAttrs.warehouse || {};
                return (
                  <div key={fulfillment.id} className="bg-hero-sage/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-hero-dark">
                        {warehouse.name || "Warehouse"}
                      </p>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClass(fulfillmentAttrs.status))}>
                        {titleCase(fulfillmentAttrs.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-light text-hero-muted">
                      {[warehouse.city, warehouse.region, warehouse.country].filter(Boolean).join(", ") || "Location pending"}
                    </p>
                    <p className="mt-3 text-sm font-medium text-hero-dark">
                      Delivery fee: {money(fulfillmentAttrs.delivery_fee)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm font-light text-hero-muted">Fulfillment details are pending.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
              Items
            </p>
            <h2 className="mt-2 font-serif text-3xl text-hero-dark">What you ordered</h2>
          </div>
          <p className="text-sm font-light text-hero-muted">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {items.map((item) => {
            const itemAttrs = item.attributes || {};
            const snapshot = itemAttrs.snapshot || {};
            const optionsText = variantOptionsText(snapshot.variant_stock_option_names);
            return (
              <article key={item.id} className="bg-hero-sage/20">
                <div className="aspect-[4/3] bg-hero-sage/30">
                  {imageUrl(item) ? (
                    <img
                      src={imageUrl(item)}
                      alt={itemAttrs.product_name || "Order item"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-hero-muted">
                      <Icon svg={bagIcon} className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-serif text-2xl text-hero-dark">
                    {itemAttrs.product_name || "Product"}
                  </p>
                  {optionsText && (
                    <p className="mt-2 text-sm font-light leading-6 text-hero-muted">
                      {optionsText}
                    </p>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/60 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-hero-muted">Quantity</p>
                      <p className="mt-1 font-medium text-hero-dark">{itemAttrs.quantity}</p>
                    </div>
                    <div className="bg-white/60 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-hero-muted">Price</p>
                      <p className="mt-1 font-medium text-hero-dark">{money(itemAttrs.price)}</p>
                    </div>
                  </div>
                  {snapshot.warehouse_name && (
                    <p className="mt-4 text-xs font-light text-hero-muted">
                      Fulfilled from {snapshot.warehouse_name}
                    </p>
                  )}
                  {canReviewItems && itemAttrs.product_id && (
                    <button
                      type="button"
                      onClick={() => openReviewModal(item)}
                      className="mt-5 cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white"
                    >
                      Review item
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {reviewItem && (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/25 px-3 py-4 sm:items-center sm:justify-center">
          <form onSubmit={submitReview} className="w-full max-w-lg bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">Review item</p>
                <h2 className="mt-2 font-serif text-3xl text-hero-dark">
                  {reviewItem.attributes?.product_name || "Product"}
                </h2>
                {variantOptionsText(reviewItem.attributes?.snapshot?.variant_stock_option_names) && (
                  <p className="mt-2 text-sm font-light text-hero-muted">
                    {variantOptionsText(reviewItem.attributes?.snapshot?.variant_stock_option_names)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                className="cursor-pointer text-sm font-bold text-hero-green"
              >
                Close
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">Rating</p>
              <div className="mt-2">
                <StarsInput value={reviewPoints} onChange={setReviewPoints} />
              </div>
            </div>

            <textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              rows={5}
              placeholder="Share a short note"
              className="mt-5 w-full resize-none rounded-2xl bg-hero-sage/35 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-hero-muted focus:bg-hero-sage/60"
            />

            {reviewError && (
              <p className="mt-3 bg-red-50 px-4 py-3 text-sm text-red-700">{reviewError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="mt-5 w-full cursor-pointer rounded-full bg-hero-green px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingReview ? "Saving review..." : "Save review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
