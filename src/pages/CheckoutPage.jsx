import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import cartIcon from "@/assets/svgs/cart.svg?raw";
import googleIcon from "@/assets/svgs/Google.svg?raw";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants";
import { getProductById } from "@/constants/products";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";
import { cn } from "@/utils";
import { getShopReturn } from "@/utils/shopReturn";

const GHANA_REGION_OPTIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
].map((region) => ({ value: region, label: region }));

const emptyAddress = {
  name: "",
  line1: "",
  city: "",
  region: "",
  country: "Ghana",
  is_default: false,
};

const fieldClass =
  "w-full rounded-2xl bg-hero-sage/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-hero-muted focus:bg-hero-sage/60";

function normalizeAddress(record) {
  const attrs = record?.attributes ?? record ?? {};
  return {
    id: record?.id ?? attrs.id,
    name: attrs.name || "",
    line1: attrs.address?.line1 || attrs.address?.street || attrs.address?.formatted || "",
    city: attrs.city || "",
    region: attrs.region || "",
    country: "Ghana",
    is_default: Boolean(attrs.is_default),
  };
}

function addressPayload(address) {
  return {
    name: address.name.trim(),
    city: address.city.trim(),
    region: address.region.trim(),
    country: "Ghana",
    is_default: address.is_default,
    address: {
      line1: address.line1.trim(),
    },
  };
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "");
}

function splitPhone(phone) {
  const cleaned = normalizePhone(phone);
  return cleaned.startsWith("+233") ? cleaned.slice(4) : cleaned;
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

function PhoneField({ value, onChange, onRemove, removable }) {
  return (
    <div className="flex gap-2">
      <div className="flex w-24 shrink-0 items-center justify-center rounded-2xl bg-hero-sage/40 px-3 py-3 text-sm font-medium text-hero-dark">
        +233
      </div>
      <input
        value={splitPhone(value)}
        onChange={(event) => onChange(`+233${event.target.value.replace(/\D/g, "")}`)}
        inputMode="tel"
        placeholder="Phone number"
        className={cn(fieldClass, "min-w-0 flex-1")}
      />
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer px-3 text-sm font-medium text-hero-muted hover:text-ink"
        >
          Remove
        </button>
      )}
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoadingUser, startGoogleAuth, fetchCurrentUser } = useUser();
  const { cartItems, itemProducts, clearCart, refreshCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [phones, setPhones] = useState(["+233"]);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lineItems = useMemo(
    () =>
      cartItems
        .map(({ id, productId, variantStockId, quantity }) => {
          const product = itemProducts[id] || itemProducts[String(productId)] || getProductById(productId);
          if (!product) return null;
          return { id, product, variantStockId, quantity };
        })
        .filter(Boolean),
    [cartItems, itemProducts],
  );

  const subtotal = lineItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function continueShopping() {
    navigate(getShopReturn());
  }

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference || !isAuthenticated) return undefined;

    const timer = window.setTimeout(async () => {
      setIsLoadingCheckout(true);
      setError("");
      try {
        await customerService.verifyPayment(reference);
        await clearCart();
        await fetchCurrentUser();
        navigate(ROUTES.ORDERS, { replace: true });
      } catch (nextError) {
        setError(nextError.message || "Unable to verify payment.");
      } finally {
        setIsLoadingCheckout(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [clearCart, fetchCurrentUser, isAuthenticated, navigate, searchParams]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const timer = window.setTimeout(async () => {
      setIsLoadingCheckout(true);
      setError("");
      try {
        await refreshCart();
        const response = await customerService.getAddresses();
        const nextAddresses = (response?.data || []).map(normalizeAddress);
        setAddresses(nextAddresses);
        const defaultAddress = nextAddresses.find((address) => address.is_default) || nextAddresses[0];
        if (defaultAddress) setSelectedAddressId(defaultAddress.id);

        const userPhones = Array.isArray(user?.phone_numbers)
          ? user.phone_numbers.filter(Boolean).slice(0, 3)
          : [];
        setPhones(userPhones.length ? userPhones : ["+233"]);
      } catch (nextError) {
        setError(nextError.message || "Unable to load checkout details.");
      } finally {
        setIsLoadingCheckout(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, refreshCart, user?.phone_numbers]);

  async function refreshAddresses(selectId) {
    const response = await customerService.getAddresses();
    const nextAddresses = (response?.data || []).map(normalizeAddress);
    setAddresses(nextAddresses);
    if (selectId) {
      setSelectedAddressId(selectId);
      return;
    }
    const defaultAddress = nextAddresses.find((address) => address.is_default) || nextAddresses[0];
    if (defaultAddress) setSelectedAddressId(defaultAddress.id);
  }

  async function saveAddress(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!addressForm.region) {
      setError("Please select a region.");
      return;
    }

    try {
      const payload = addressPayload(addressForm);
      const response = editingAddressId
        ? await customerService.updateAddress(editingAddressId, payload)
        : await customerService.createAddress(payload);
      const savedId = response?.data?.id || editingAddressId;
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      setIsAddingAddress(false);
      await refreshAddresses(savedId);
      await fetchCurrentUser();
      setMessage(editingAddressId ? "Address updated successfully" : "Address saved successfully");
    } catch (nextError) {
      setError(nextError.message || "Unable to save address.");
    }
  }

  function startEditAddress(address) {
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
    setAddressForm(address);
  }

  function startAddAddress() {
    setEditingAddressId(null);
    setIsAddingAddress(true);
    setAddressForm(emptyAddress);
  }

  function cancelAddressForm() {
    setEditingAddressId(null);
    setIsAddingAddress(false);
    setAddressForm(emptyAddress);
  }

  function updatePhone(index, value) {
    const normalized = normalizePhone(value);
    const duplicate = phones.some((phone, phoneIndex) => phoneIndex !== index && normalizePhone(phone) === normalized);
    if (normalized && normalized !== "+233" && duplicate) {
      setError("Phone numbers cannot be duplicated.");
      return;
    }
    const next = [...phones];
    next[index] = value;
    setPhones(next);
  }

  async function handlePay() {
    setError("");
    setMessage("");

    const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
    if (!selectedAddress) {
      setError("Please select or add a shipping address.");
      return;
    }

    const contactPhones = phones.map(normalizePhone).filter((phone) => phone && phone !== "+233").slice(0, 3);
    if (contactPhones.length === 0) {
      setError("Please add at least one contact phone number.");
      return;
    }

    const orderItems = [];
    const fulfillmentMap = new Map();
    for (const item of lineItems) {
      const stock = item.product.variantStocks?.find((variantStock) => variantStock.id === item.variantStockId) || item.product.defaultVariantStock;
      if (!stock?.id || !stock?.warehouse_id) {
        setError(`${item.product.name} is not ready for checkout.`);
        return;
      }
      const orderItem = {
        variant_stock_id: stock.id,
        quantity: item.quantity,
      };
      orderItems.push(orderItem);
      const existing = fulfillmentMap.get(stock.warehouse_id) || [];
      existing.push(orderItem);
      fulfillmentMap.set(stock.warehouse_id, existing);
    }

    setIsPaying(true);
    try {
      const orderResponse = await customerService.createOrder({
        customer_address_id: selectedAddress.id,
        phones: contactPhones,
        order_items: orderItems,
        fulfillments: [...fulfillmentMap.entries()].map(([warehouseId, items]) => ({
          warehouse_id: warehouseId,
          order_items: items,
        })),
      });
      const order = orderResponse?.data;
      const orderId = order?.attributes?.order_id || order?.id;
      const callbackUrl = `${window.location.origin}${ROUTES.PAYMENT_CALLBACK}`;
      const payment = await customerService.initializePayment(orderId, callbackUrl);
      window.location.assign(payment.authorization_url);
    } catch (nextError) {
      setError(nextError.message || "Unable to start checkout.");
      setIsPaying(false);
    }
  }

  if (!isAuthenticated && !isLoadingUser) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={continueShopping}
          className="mb-7 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-hero-green"
        >
          <span aria-hidden="true">←</span>
          Back to shop
        </button>
        <p className="font-serif text-4xl text-hero-dark">Checkout</p>
        <p className="mt-3 max-w-md text-sm font-light leading-6 text-hero-muted">
          Sign up or log in with Google to continue to secure checkout.
        </p>
        <button
          type="button"
          onClick={() => startGoogleAuth(ROUTES.CHECKOUT)}
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-hero-green px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <Icon svg={googleIcon} className="h-4 w-4" />
          </span>
          Sign up with Google to continue
        </button>
        <button
          type="button"
          onClick={continueShopping}
          className="mt-4 cursor-pointer text-sm font-bold text-hero-green"
        >
          Continue shopping
        </button>
      </section>
    );
  }

  if (isLoadingCheckout) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-hero-green">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <button
          type="button"
          onClick={continueShopping}
          className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-hero-green"
        >
          <span aria-hidden="true">←</span>
          Back to shop
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">Secure checkout</p>
        <h1 className="mt-2 font-serif text-4xl text-hero-dark">Checkout</h1>
        <p className="mt-2 text-sm font-light text-hero-muted">Confirm delivery details and complete payment with Paystack.</p>
      </div>

      {(message || error) && (
        <p className={cn("px-5 py-3 text-sm font-light", error ? "bg-red-50 text-red-700" : "bg-hero-sage/50 text-hero-dark")}>
          {error || message}
        </p>
      )}

      {lineItems.length === 0 ? (
        <div className="bg-white px-5 py-14 text-center">
          <Icon svg={cartIcon} className="mx-auto h-8 w-8 text-hero-muted" />
          <p className="mt-4 font-serif text-2xl text-hero-dark">Your cart is empty</p>
          <button type="button" onClick={continueShopping} className="mt-5 cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white">
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.8fr]">
          <section className="space-y-6 bg-white p-5 sm:p-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-hero-dark">Shipping address</h2>
                  <p className="mt-1 text-sm font-light text-hero-muted">Choose or create a delivery address.</p>
                </div>
                {addresses.length < 3 && !isAddingAddress && !editingAddressId && (
                  <button type="button" onClick={startAddAddress} className="cursor-pointer text-sm font-bold text-hero-green">
                    Add
                  </button>
                )}
              </div>

              <div className="mt-5 grid gap-3">
                {addresses.map((address) => (
                  <label key={address.id} className="flex cursor-pointer gap-3 bg-hero-sage/20 p-4">
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 accent-hero-green"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-hero-dark">{address.name}</p>
                      <p className="mt-1 text-sm font-light text-hero-muted">
                        {[address.line1, address.city, address.region, "Ghana"].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        startEditAddress(address);
                      }}
                      className="cursor-pointer text-sm font-bold text-hero-green"
                    >
                      Edit
                    </button>
                  </label>
                ))}
              </div>

              {(isAddingAddress || editingAddressId) && (
                <form onSubmit={saveAddress} className="mt-5 grid gap-3 bg-hero-sage/10 p-4">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                    Address label
                    <input value={addressForm.name} onChange={(event) => setAddressForm({ ...addressForm, name: event.target.value })} required placeholder="Home" className={fieldClass} />
                  </label>
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                    Street address
                    <input value={addressForm.line1} onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })} required placeholder="Street address" className={fieldClass} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                      City
                      <input value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} placeholder="City" className={fieldClass} />
                    </label>
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                      Region
                      <SelectDropdown value={addressForm.region} options={GHANA_REGION_OPTIONS} onChange={(region) => setAddressForm({ ...addressForm, region })} placeholder="Region" />
                    </label>
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">
                      Country
                      <input value="Ghana" disabled className="rounded-2xl bg-hero-sage/30 px-4 py-3 text-sm text-hero-muted outline-none" />
                    </label>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-light text-hero-muted">
                    <Checkbox checked={addressForm.is_default} onChange={(event) => setAddressForm({ ...addressForm, is_default: event.target.checked })} />
                    Use as default address
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white">
                      {editingAddressId ? "Update address" : "Save address"}
                    </button>
                    <button type="button" onClick={cancelAddressForm} className="cursor-pointer rounded-full bg-hero-sage/30 px-5 py-2 text-sm font-medium text-hero-muted">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-hero-dark">Contact numbers</h2>
                <span className="text-xs text-hero-green">{phones.filter((phone) => normalizePhone(phone) !== "+233").length}/3</span>
              </div>
              <div className="mt-4 space-y-3">
                {phones.map((phone, index) => (
                  <PhoneField
                    key={index}
                    value={phone}
                    onChange={(value) => updatePhone(index, value)}
                    removable={phones.length > 1}
                    onRemove={() => setPhones(phones.filter((_, phoneIndex) => phoneIndex !== index))}
                  />
                ))}
              </div>
              {phones.length < 3 && (
                <button type="button" onClick={() => setPhones([...phones, "+233"])} className="mt-4 cursor-pointer rounded-full border border-hero-green px-5 py-2 text-sm font-medium text-hero-green">
                  Add phone
                </button>
              )}
            </div>
          </section>

          <aside className="bg-white p-5 sm:p-6">
            <h2 className="font-serif text-2xl text-hero-dark">Order summary</h2>
            <div className="mt-5 space-y-4">
              {lineItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.image} alt={product.name} className="h-16 w-16 bg-hero-sage/25 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-hero-dark">{product.name}</p>
                    {variantLabel(product).length > 0 && (
                      <p className="mt-1 text-xs font-light leading-5 text-hero-muted">
                        {variantLabel(product).join(" / ")}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-hero-muted">Qty {quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-hero-dark">GHS {(product.price * quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-hero-sage/40 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-hero-muted">Subtotal</span>
                <span className="font-semibold text-hero-dark">GHS {subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs font-light leading-5 text-hero-muted">Delivery fee is calculated by the order service and included before Paystack payment.</p>
            </div>
            <button
              type="button"
              onClick={handlePay}
              disabled={isPaying}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-hero-green px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying && <Spinner className="text-white" />}
              {isPaying ? "Opening Paystack..." : "Pay now"}
            </button>
            <button
              type="button"
              onClick={continueShopping}
              className="mt-3 w-full cursor-pointer rounded-full bg-hero-sage/30 px-5 py-3 text-sm font-medium text-hero-green"
            >
              Continue shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
