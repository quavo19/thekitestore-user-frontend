import { ItemsCarousel } from "@/components/ui/ItemsCarousel";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ProductCardsSkeleton } from "@/components/ui/ProductCardsSkeleton";
import { CAROUSEL_ITEMS_PER_VIEW_WIDE } from "@/constants/carousel";
import { Link, useNavigate } from "react-router-dom";

export function HomeHotDealsSection({ products, isLoading }) {
  const navigate = useNavigate();
  const deals = products.filter((product) => product.hotDeal && (product.demo || product.availability === "in-stock"));

  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="Hot Deals">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-hero-dark">Hot Deals</h2>
          <p className="mt-1 text-sm text-hero-muted">One-off finds at lower prices. Each pre-owned device has its condition and known faults listed.</p>
        </div>
        <Link to="/shop" className="rounded-full border border-gray-200 px-4 py-2 text-xs text-hero-dark hover:bg-gray-50">Visit the shop</Link>
      </div>
      {isLoading ? <ProductCardsSkeleton label="Loading Hot Deals" /> : deals.length ? (
        <ItemsCarousel showHeader={false} items={deals} itemsPerView={CAROUSEL_ITEMS_PER_VIEW_WIDE} renderItem={(product) => (
          <ShopProductCard product={product} showAddToCart onSelect={() => navigate(`/products/${product.id}`)} />
        )} />
      ) : <p className="rounded-2xl bg-gray-50 px-5 py-6 text-sm text-hero-muted">No Hot Deals available right now. Check back for the next one.</p>}
    </section>
  );
}
