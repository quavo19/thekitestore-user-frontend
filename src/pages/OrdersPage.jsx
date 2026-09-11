import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bagIcon from "@/assets/svgs/Bag.svg?raw";
import googleIcon from "@/assets/svgs/Google.svg?raw";
import searchIcon from "@/assets/svgs/Search.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { ROUTES } from "@/constants";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";
import { cn } from "@/utils";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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

function money(value) {
  const amount = Number(value || 0);
  return `GHS ${amount.toFixed(2)}`;
}

function dateLabel(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function OrdersSkeleton() {
  return (
    <div className="divide-y divide-transparent">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] md:items-center"
        >
          <div className="space-y-2">
            <div className="skeleton-shimmer h-4 w-32" />
            <div className="skeleton-shimmer h-3 w-24" />
          </div>
          <div className="skeleton-shimmer h-6 w-20" />
          <div className="skeleton-shimmer h-4 w-16" />
          <div className="skeleton-shimmer h-4 w-20" />
          <div className="skeleton-shimmer h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingUser, startGoogleAuth } = useUser();
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setTimeout(async () => {
      setIsLoadingOrders(true);
      setError("");
      try {
        const response = await customerService.getOrders({
          search,
          status,
          page,
          per_page: 10,
        });
        setOrders(response?.data || []);
        setMeta(response?.meta || {});
      } catch (nextError) {
        setError(nextError.message || "Unable to load your orders.");
      } finally {
        setIsLoadingOrders(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, page, search, status]);

  if (!isAuthenticated && !isLoadingUser) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <p className="font-serif text-4xl text-hero-dark">Your orders</p>
        <p className="mt-3 max-w-md text-sm font-light leading-6 text-hero-muted">
          Sign in to see your order history and delivery status.
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">
            Order history
          </p>
          <h1 className="mt-2 font-serif text-4xl text-hero-dark">Your orders</h1>
          <p className="mt-2 text-sm font-light text-hero-muted">
            Track your purchases and payment status.
          </p>
        </div>
        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[minmax(14rem,18rem)_10rem]">
          <div className="relative">
            <Icon
              svg={searchIcon}
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-hero-muted"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value.toUpperCase());
                setPage(1);
              }}
              placeholder="Search order ID"
              className="w-full rounded-2xl bg-hero-sage/40 py-3 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-hero-muted focus:bg-hero-sage/60"
            />
          </div>
          <SelectDropdown
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            className="sm:w-40"
          />
        </div>
      </div>

      {error && <p className="rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-700">{error}</p>}

      <section className="overflow-hidden bg-white">
        <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] bg-hero-sage/20 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-hero-muted md:grid">
          <span>Order</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Total</span>
          <span>Date</span>
        </div>

        {isLoadingOrders ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center bg-hero-sage/35 text-hero-green">
              <Icon svg={bagIcon} className="h-7 w-7" />
            </span>
            <p className="font-serif text-2xl text-hero-dark">No orders yet</p>
            <p className="mt-2 text-sm font-light text-hero-muted">
              {search || status
                ? "No orders match your current filters."
                : "Your purchases will appear here once checkout is complete."}
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order) => {
              const attrs = order.attributes || {};
              const orderPath = `${ROUTES.ORDERS}/${attrs.order_id || order.id}`;
              return (
                <button
                  type="button"
                  key={order.id}
                  onClick={() => navigate(orderPath)}
                  className="grid w-full cursor-pointer gap-3 px-5 py-4 text-left text-sm transition-colors hover:bg-hero-sage/20 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] md:items-center"
                >
                  <div>
                    <p className="font-medium text-hero-dark">
                      Order #{attrs.order_id || order.id?.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-xs font-light text-hero-muted">
                      {attrs.delivery_fee ? `${money(attrs.delivery_fee)} delivery` : "Delivery fee pending"}
                    </p>
                  </div>
                  <div>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClass(attrs.status))}>
                      {attrs.status || "pending"}
                    </span>
                  </div>
                  <p className="text-hero-muted">{attrs.payment_status === "completed" ? "Paid" : attrs.payment_status || "Pending"}</p>
                  <p className="font-medium text-hero-dark">{money(attrs.total_price ?? attrs.total_amount)}</p>
                  <p className="text-hero-muted">{dateLabel(attrs.created_at)}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {(meta.total_pages || 1) > 1 && (
        <div className="flex items-center justify-between text-sm text-hero-muted">
          <span>
            Page {meta.current_page || page} of {meta.total_pages || 1}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= (meta.total_pages || 1)}
              onClick={() => setPage((current) => Math.min(meta.total_pages || 1, current + 1))}
              className="cursor-pointer rounded-full bg-hero-green px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
