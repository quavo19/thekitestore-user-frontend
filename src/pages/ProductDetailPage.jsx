import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bagIcon from "@/assets/svgs/Bag.svg?raw";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { customerService } from "@/services";
import { cn } from "@/utils";

function money(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function dateLabel(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function reviewUserName(user) {
  return user?.display_name || (user?.id_hash ? `Customer ${String(user.id_hash).slice(0, 8).toUpperCase()}` : "Customer");
}

function Stars({ value, size = "text-sm" }) {
  const points = Number(value || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={cn(size, index < points ? "text-hero-green" : "text-hero-sage")}>
          ★
        </span>
      ))}
    </div>
  );
}

function stockLabel(stock) {
  const count = Number(stock?.available_quantity || 0);
  if (count <= 0) return "Out of stock";
  if (count === 1) return "1 left";
  return `${count} left`;
}

function selectableOptions(stock) {
  return (stock?.options || []).filter((option) => option.variant_type_pricing_role !== "base");
}

function optionGroups(product) {
  const groups = new Map();

  (product?.variantStocks || []).forEach((stock) => {
    selectableOptions(stock).forEach((option) => {
      const group = groups.get(option.variant_type_id) || {
        id: option.variant_type_id,
        name: option.variant_type_name,
        options: [],
      };

      if (!group.options.some((existing) => existing.id === option.id)) {
        group.options.push(option);
      }

      groups.set(option.variant_type_id, group);
    });
  });

  return [...groups.values()].map((group) => ({
    ...group,
    options: group.options.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

function initialOptionSelection(stock) {
  return selectableOptions(stock).reduce((selection, option) => {
    selection[option.variant_type_id] = option.id;
    return selection;
  }, {});
}

function stockMatchesSelection(stock, selectedOptions, groups) {
  if (!groups.length) return true;
  const optionIds = new Set((stock.option_ids || []).map(String));

  return groups.every((group) => {
    const selectedOptionId = selectedOptions[group.id];
    return selectedOptionId && optionIds.has(String(selectedOptionId));
  });
}

function variantLabel(stock) {
  const names = selectableOptions(stock).map((option) => option.name);
  return names.join(" / ") || "Default";
}

function productGalleryImages(product) {
  const images = [];
  const seen = new Set();

  function addImage(image, source = "product") {
    const url = typeof image === "string" ? image : image?.url;
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({
      id: image?.id || `${source}-${images.length}`,
      url,
      source,
    });
  }

  (product?.images || []).forEach((image) => addImage(image, "product"));
  addImage(product?.image, "product");

  (product?.variantStocks || []).forEach((stock) => {
    if (stock?.image) addImage(stock.image, `variant-${stock.id}`);
    (stock?.options || []).forEach((option) => {
      (option?.images || []).forEach((image) => addImage(image, `option-${option.id}`));
    });
  });

  return images;
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [quantitiesByStockId, setQuantitiesByStockId] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const trackedAffiliateClicks = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      setIsLoading(true);
      setError("");
      try {
        const response = await customerService.getProduct(productId);
        if (!isMounted) return;
        const nextProduct = response.product;
        const defaultStock = nextProduct?.defaultVariantStock || nextProduct?.variantStocks?.[0];
        setProduct(nextProduct);
        setSelectedOptions(initialOptionSelection(defaultStock));
        setSelectedImageUrl("");

        try {
          const relatedResponse = await customerService.getProducts();
          if (!isMounted) return;
          const candidates = (relatedResponse.products || []).filter((item) => item.id !== nextProduct?.id);
          const sameCategory = candidates.filter((item) => String(item.category) === String(nextProduct?.category));
          const pool = sameCategory.length ? sameCategory : candidates.sort(() => Math.random() - 0.5);
          setRelatedProducts(pool.slice(0, 4));
        } catch {
          if (isMounted) setRelatedProducts([]);
        }
      } catch (nextError) {
        if (isMounted) setError(nextError.message || "Unable to load this product.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    const affiliateCode = new URLSearchParams(location.search).get("ref")?.trim();
    if (!affiliateCode || !product?.id) return;

    const trackingKey = `${product.id}:${affiliateCode}`;
    if (trackedAffiliateClicks.current.has(trackingKey)) return;
    trackedAffiliateClicks.current.add(trackingKey);

    const visitorId = customerService.getAffiliateVisitorId();
    customerService.rememberAffiliateAttribution({
      productId: product.id,
      affiliateCode,
      visitorId,
      landingUrl: window.location.href,
    });
    customerService
      .recordAffiliateClick({
        productId: product.id,
        affiliateCode,
        visitorId,
        landingUrl: window.location.href,
        referrerUrl: document.referrer,
      })
      .catch(() => {
        trackedAffiliateClicks.current.delete(trackingKey);
      });
  }, [location.search, product?.id]);

  const groups = useMemo(() => optionGroups(product), [product]);
  const selectedStock = useMemo(() => {
    const stocks = product?.variantStocks || [];
    return stocks.find((stock) => stockMatchesSelection(stock, selectedOptions, groups)) || null;
  }, [groups, product, selectedOptions]);

  const selectedImage = selectedImageUrl || selectedStock?.image?.url || product?.images?.[0]?.url || product?.image || "";
  const galleryImages = useMemo(() => productGalleryImages(product), [product]);
  const selectedPrice = selectedStock?.price ?? product?.price ?? 0;
  const affiliateCommissionAmount = Number(product?.affiliateCommissionAmount || 0);
  const cartKey = selectedStock?.id ? `${product?.id}:${selectedStock.id}` : String(product?.id || "");
  const inCart = Boolean(items[cartKey]);
  const maxQuantity = Number(selectedStock?.available_quantity || 0);
  const outOfStock = !selectedStock || maxQuantity <= 0;
  const quantityKey = selectedStock?.id || "default";
  const selectedQuantity = outOfStock
    ? 0
    : Math.min(Math.max(Number(quantitiesByStockId[quantityKey] || 1), 1), maxQuantity);
  const reviews = product?.reviews || [];
  const reviewSummary = product?.reviewSummary || {};
  const description = product?.description || "";
  const shouldClampDescription = description.length > 170;
  const visibleDescription = !shouldClampDescription || isDescriptionExpanded
    ? description
    : `${description.slice(0, 170).trim()}...`;
  const affiliateCode = user?.affiliate_profile?.affiliate_code || "";
  const isApprovedAffiliate = user?.role?.name === "AFFILIATE" && user?.affiliate_profile?.status === "approved";
  const affiliateLink = isApprovedAffiliate && product?.id && affiliateCode
    ? `${window.location.origin}/products/${product.id}?ref=${encodeURIComponent(affiliateCode)}`
    : "";

  async function handleCopyAffiliateLink() {
    if (!affiliateLink) return;
    setError("");
    setMessage("");
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setMessage("Affiliate product link copied.");
    } catch {
      setError("Unable to copy the link. Please copy it manually.");
    }
  }

  async function handleAddToCart() {
    if (!product || !selectedStock || isAdding || outOfStock) return;
    setIsAdding(true);
    setError("");
    setMessage("");
    try {
      await addItem(
        product.id,
        selectedQuantity,
        {
          ...product,
          price: selectedPrice,
          image: selectedImage,
          defaultVariantStock: selectedStock,
        },
        selectedStock.id,
      );
      setMessage(`${selectedQuantity} ${product.name} (${variantLabel(selectedStock)}) added to cart`);
    } catch (nextError) {
      setError(nextError.message || "Unable to add this item to cart.");
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-hero-green">
        <Spinner size="md" />
      </div>
    );
  }

  if (error && !product) {
    return (
      <section className="mx-auto max-w-3xl bg-white px-6 py-16 text-center">
        <Icon svg={bagIcon} className="mx-auto h-9 w-9 text-hero-muted" />
        <p className="mt-5 font-serif text-3xl text-hero-dark">Product unavailable</p>
        <p className="mt-2 text-sm font-light text-hero-muted">{error}</p>
        <button type="button" onClick={() => navigate(ROUTES.SHOP)} className="mt-6 cursor-pointer rounded-full bg-hero-green px-5 py-2 text-sm font-medium text-white">
          Back to shop
        </button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <button type="button" onClick={() => navigate(ROUTES.SHOP)} className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-hero-green">
        <span aria-hidden="true">←</span>
        Back to shop
      </button>

      {(message || error) && (
        <p className={cn("px-5 py-3 text-sm font-light", error ? "bg-red-50 text-red-700" : "bg-hero-sage/50 text-hero-dark")}>
          {error || message}
        </p>
      )}

      <section className="grid gap-8 bg-white p-5 sm:p-7 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="aspect-square bg-hero-sage/20">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-hero-muted">
                <Icon svg={bagIcon} className="h-12 w-12" />
              </div>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
              {galleryImages.map((image) => {
                const isActive = image.url === selectedImage;
                return (
                <button
                  type="button"
                  key={image.id || image.url}
                  onClick={() => setSelectedImageUrl(image.url)}
                  className={cn(
                    "aspect-square cursor-pointer bg-hero-sage/20 p-2 transition-colors hover:bg-hero-sage/40",
                    isActive && "bg-hero-green/20 outline outline-2 outline-hero-green",
                  )}
                >
                  <img src={image.url} alt="" className="h-full w-full object-contain" />
                </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-4xl text-hero-dark sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Stars value={Math.round(reviewSummary.average_points || product.rating || 0)} />
              <span className="text-sm font-light text-hero-muted">
                {Number(reviewSummary.average_points || product.rating || 0).toFixed(1)} · {reviewSummary.total_reviews ?? product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div>
            <p className="font-serif text-3xl text-hero-dark">{money(selectedPrice)}</p>
            {affiliateCommissionAmount > 0 && (
              <p className="mt-1.5 text-sm italic text-hero-green">
                Affiliate earns {money(affiliateCommissionAmount)}
              </p>
            )}
          </div>
          {Number(product.bonusPoints || 0) > 0 && (
            <p className="text-sm font-light text-hero-green">
              Earn <span className="font-bold">#{Number(product.bonusPoints || 0).toLocaleString()}</span> bonus points
            </p>
          )}
          <div>
            <p className="text-sm font-light leading-7 text-hero-muted">{visibleDescription}</p>
            {shouldClampDescription && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((expanded) => !expanded)}
                className="mt-2 cursor-pointer text-sm font-bold text-hero-green"
              >
                {isDescriptionExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>

          {groups.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className={cn("text-sm font-medium", outOfStock ? "text-red-600" : "text-hero-green")}>
                  {selectedStock ? stockLabel(selectedStock) : "Unavailable"}
                </span>
              </div>
              {groups.map((group) => (
                <div key={group.id}>
                  <h2 className="text-sm font-semibold text-hero-dark">{group.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const selected = String(selectedOptions[group.id]) === String(option.id);
                      return (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => {
                            setSelectedOptions((current) => ({ ...current, [group.id]: option.id }));
                            setSelectedImageUrl(option.images?.[0]?.url || "");
                          }}
                          style={selected ? { backgroundColor: "#0f5f37", color: "#ffffff" } : undefined}
                          className={cn(
                            "cursor-pointer bg-hero-sage/25 px-3 py-2 text-xs font-medium text-hero-dark transition-colors hover:bg-hero-sage/45",
                            selected && "!bg-[#0f5f37] !text-white hover:!bg-[#0f5f37]",
                          )}
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center bg-hero-sage/25">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={outOfStock || selectedQuantity <= 1}
                onClick={() => setQuantitiesByStockId((current) => ({
                  ...current,
                  [quantityKey]: Math.max(1, selectedQuantity - 1),
                }))}
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-xl font-medium text-hero-dark transition-colors hover:bg-hero-sage/45 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span aria-hidden="true">−</span>
              </button>
              <span className="min-w-12 px-3 text-center text-sm font-semibold text-hero-dark">
                {selectedQuantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={outOfStock || selectedQuantity >= maxQuantity}
                onClick={() => setQuantitiesByStockId((current) => ({
                  ...current,
                  [quantityKey]: Math.min(maxQuantity, selectedQuantity + 1),
                }))}
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-xl font-medium text-hero-dark transition-colors hover:bg-hero-sage/45 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
            <p className="text-sm font-light text-hero-muted">
              {outOfStock ? "This variant is unavailable" : `Choose up to ${maxQuantity}`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || inCart || outOfStock}
            className="w-full cursor-pointer bg-hero-green px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Adding..." : inCart ? "In cart" : "Add to cart"}
          </button>

          {isApprovedAffiliate && affiliateLink && (
            <div className="bg-hero-sage/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">Affiliate link</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={affiliateLink}
                  readOnly
                  className="min-w-0 flex-1 bg-white px-3 py-2 text-sm font-light text-hero-dark outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyAffiliateLink}
                  className="cursor-pointer bg-hero-dark px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {product.meta?.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {product.meta.slice(0, 4).map((meta) => (
                <div key={meta.id || meta.name} className="bg-hero-sage/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hero-muted">{meta.name}</p>
                  <p className="mt-2 text-sm font-medium text-hero-dark">{meta.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-white p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">Related</p>
              <h2 className="mt-2 font-serif text-3xl text-hero-dark">You may also like</h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <ShopProductCard
                key={item.id}
                product={item}
                showAddToCart
                onSelect={() => navigate(`/products/${item.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_1.45fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-green">Reviews</p>
            <h2 className="mt-2 font-serif text-3xl text-hero-dark">Customer notes</h2>
            <p className="mt-3 text-sm font-light leading-6 text-hero-muted">
              Reviews from customers who have received this item.
            </p>
          </div>

          <div className="space-y-3">
            {reviews.length ? (
              reviews.map((review) => {
                const attrs = review.attributes || review;
                return (
                  <article key={review.id} className="bg-hero-sage/20 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-hero-dark">{reviewUserName(attrs.user)}</p>
                        <p className="mt-1 text-xs font-light text-hero-muted">{dateLabel(attrs.created_at)}</p>
                      </div>
                      <Stars value={attrs.points} />
                    </div>
                    {attrs.comment && (
                      <p className="mt-4 text-sm font-light leading-6 text-hero-muted">{attrs.comment}</p>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="bg-hero-sage/20 p-8 text-center">
                <p className="font-serif text-2xl text-hero-dark">No reviews yet</p>
                <p className="mt-2 text-sm font-light text-hero-muted">Received orders can leave the first review.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
