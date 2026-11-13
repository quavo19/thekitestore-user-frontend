import { api } from "@/api";
import { DUMMY_PRODUCTS } from "@/constants/dummyProducts";

const PRODUCT_CACHE_TTL = 60_000;
const productCache = new Map();
const AFFILIATE_VISITOR_STORAGE_KEY = "thekitestore-user-frontend-affiliate-visitor-id";
const AFFILIATE_ATTRIBUTION_STORAGE_KEY = "thekitestore-user-frontend-affiliate-attribution";
const AFFILIATE_SIGNUP_CLAIM_STORAGE_KEY = "thekitestore-user-frontend-affiliate-signup-claim";

function cacheGet(key) {
  const cached = productCache.get(key);
  if (!cached || cached.expiresAt <= Date.now()) {
    productCache.delete(key);
    return null;
  }
  return cached.value;
}

function cacheSet(key, value) {
  productCache.set(key, {
    value,
    expiresAt: Date.now() + PRODUCT_CACHE_TTL,
  });
  return value;
}

function productFromItem(item) {
  return item?.attributes?.product ?? item?.product ?? null;
}

export function normalizeApiProduct(record) {
  const attributes = record?.attributes ?? record ?? {};
  const image = attributes.image_url || attributes.images?.[0]?.url || DUMMY_PRODUCTS[0]?.image || "";
  const defaultStock = attributes.default_variant_stock || attributes.defaultVariantStock || null;
  const price = Number(defaultStock?.price ?? attributes.base_price ?? attributes.price ?? 0);
  const category = attributes.category?.id || attributes.category?.name || "plants";

  return {
    id: record?.id ?? attributes.id,
    slug: record?.id ?? attributes.id,
    name: attributes.name || "Product",
    description: attributes.description || "",
    category,
    size: "medium",
    availability: attributes.status === "out_of_stock" ? "out-of-stock" : "in-stock",
    style: "modern",
    price,
    originalPrice: price,
    bonusPoints: Number(attributes.bonus_points || attributes.bonusPoints || 0),
    affiliateCommissionAmount: Number(
      attributes.affiliate_commission_amount ||
        attributes.affiliateCommissionAmount ||
        0,
    ),
    rating: Number(attributes.review_summary?.average_points || 5),
    reviewCount: Number(attributes.review_summary?.total_reviews || 0),
    image,
    images: attributes.images || [],
    meta: attributes.meta || [],
    reviews: attributes.reviews || [],
    reviewSummary: attributes.review_summary || null,
    variantStocks: attributes.variant_stocks || attributes.variantStocks || [],
    defaultVariantStock: defaultStock,
    createdAt: attributes.created_at || new Date().toISOString(),
  };
}

export function normalizeCustomerItem(item) {
  const attributes = item?.attributes ?? item ?? {};
  const product = productFromItem(item);

  return {
    id: item?.id ?? attributes.id,
    productId: attributes.product_id ?? product?.id,
    cartItemId: item?.id ?? attributes.id,
    variantStockId: attributes.variant_stock_id ?? product?.selected_variant_stock?.id ?? product?.default_variant_stock?.id,
    quantity: Number(attributes.quantity || 1),
    product: product
      ? normalizeApiProduct({
          id: product.id,
          attributes: {
            name: product.name,
            description: product.description,
            active: product.active,
            image_url: product.image_url,
            category: product.category,
            base_price: product.base_price ?? product.price,
            bonus_points: product.bonus_points ?? product.bonusPoints,
            default_variant_stock: product.default_variant_stock ?? product.defaultVariantStock,
            variant_stocks: product.selected_variant_stock ? [product.selected_variant_stock] : [],
          },
        })
      : null,
  };
}

export const customerService = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    query.set("per_page", params.perPage || 100);
    if (params.search) query.set("search", params.search);

    const cacheKey = `products:index:${query.toString()}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const response = await api.get(`/customer/products?${query.toString()}`);
    return cacheSet(cacheKey, {
      ...response,
      products: (response?.data || []).map(normalizeApiProduct),
    });
  },
  getProduct: async (productId) => {
    const cached = cacheGet(`products:show:${productId}`);
    if (cached) return cached;

    const response = await api.get(`/customer/products/${productId}`);
    return cacheSet(`products:show:${productId}`, {
      ...response,
      product: response?.data ? normalizeApiProduct(response.data) : null,
    });
  },

  getAffiliateVisitorId: () => {
    let visitorId = localStorage.getItem(AFFILIATE_VISITOR_STORAGE_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(AFFILIATE_VISITOR_STORAGE_KEY, visitorId);
    }
    return visitorId;
  },

  getStoredAffiliateVisitorId: () => localStorage.getItem(AFFILIATE_VISITOR_STORAGE_KEY),

  rememberAffiliateAttribution: (attribution) => {
    localStorage.setItem(AFFILIATE_ATTRIBUTION_STORAGE_KEY, JSON.stringify({
      ...attribution,
      visitorId: attribution.visitorId || customerService.getAffiliateVisitorId(),
      trackedAt: new Date().toISOString(),
    }));
  },

  getRememberedAffiliateAttribution: () => {
    const raw = localStorage.getItem(AFFILIATE_ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(AFFILIATE_ATTRIBUTION_STORAGE_KEY);
      return null;
    }
  },

  rememberAffiliateCodeFromUrl: () => {
    const affiliateCode = new URLSearchParams(window.location.search).get("ref")?.trim();
    if (!affiliateCode) return null;

    const visitorId = customerService.getAffiliateVisitorId();
    customerService.rememberAffiliateAttribution({
      affiliateCode,
      visitorId,
      landingUrl: window.location.href,
    });
    return { affiliateCode, visitorId };
  },

  hasClaimedSignupReferral: (affiliateCode) =>
    localStorage.getItem(AFFILIATE_SIGNUP_CLAIM_STORAGE_KEY) === affiliateCode,

  markSignupReferralClaimed: (affiliateCode) => {
    localStorage.setItem(AFFILIATE_SIGNUP_CLAIM_STORAGE_KEY, affiliateCode);
  },

  recordSignupReferral: ({ affiliateCode, visitorId }) =>
    api.post("/affiliate_signup_referrals", {
      affiliate_signup_referral: {
        affiliate_code: affiliateCode,
        visitor_id: visitorId,
      },
    }),

  recordAffiliateClick: ({ productId, affiliateCode, visitorId, landingUrl, referrerUrl }) =>
    api.post("/affiliate_clicks", {
      affiliate_click: {
        product_id: productId,
        affiliate_code: affiliateCode,
        visitor_id: visitorId,
        landing_url: landingUrl,
        referrer_url: referrerUrl,
      },
    }),

  getCart: async () => {
    const response = await api.get("/customer/cart");
    return {
      ...response,
      items: (response?.data || []).map(normalizeCustomerItem),
    };
  },

  addToCart: (productId, variantStockId, quantity = 1) =>
    api.post("/customer/cart", {
      product_id: productId,
      quantity,
      ...(variantStockId ? { variant_stock_id: variantStockId } : {}),
    }),
  updateCartQuantity: (productId, variantStockId, quantity) =>
    api.patch(`/customer/cart/${productId}`, {
      product_id: productId,
      quantity,
      ...(variantStockId ? { variant_stock_id: variantStockId } : {}),
    }),
  removeFromCart: (productId, variantStockId) => {
    const query = new URLSearchParams();
    query.set("product_id", productId);
    if (variantStockId) query.set("variant_stock_id", variantStockId);
    return api.delete(`/customer/cart/${productId}?${query.toString()}`);
  },

  getWishlist: async () => {
    const response = await api.get("/customer/wishlist");
    return {
      ...response,
      items: (response?.data || []).map(normalizeCustomerItem),
    };
  },

  addToWishlist: (productId) => api.post("/customer/wishlist", { product_id: productId }),
  removeFromWishlist: (productId) => api.delete(`/customer/wishlist/${productId}`),

  getAddresses: () => api.get("/customer/addresses"),
  getDeliveryZones: () => api.get("/customer/delivery_zones"),
  createAddress: (address) => api.post("/customer/addresses", { address }),
  updateAddress: (id, address) => api.patch(`/customer/addresses/${id}`, { address }),
  deleteAddress: (id) => api.delete(`/customer/addresses/${id}`),
  setDefaultAddress: (id) => api.post(`/customer/addresses/${id}/set_default`),

  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, value);
      }
    });
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return api.get(`/customer/orders/orders${suffix}`);
  },
  getOrder: (orderId) => api.get(`/customer/orders/orders/${orderId}`),
  markOrderReceived: (orderId) => api.post(`/customer/orders/orders/${orderId}/mark_received`),
  createReview: (productId, review) =>
    api.post(`/customer/products/${productId}/reviews`, { review }),

  createSupportRequest: (supportRequest) =>
    api.post("/support_requests", { support_request: supportRequest }),

  createOrder: (order) => api.post("/customer/orders/orders", { order }),
  initializePayment: (orderId, callbackUrl) =>
    api.post("/payments/paystack/initialize", {
      order_id: orderId,
      callback_url: callbackUrl,
    }),
  verifyPayment: (reference) =>
    api.get(`/payments/paystack/verify?reference=${encodeURIComponent(reference)}`),
};
