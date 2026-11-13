import { ItemsCarousel } from "@/components/ui/ItemsCarousel";
import { ProductCarouselCard } from "@/components/ui/ProductCarouselCard";
import { ProductCardsSkeleton } from "@/components/ui/ProductCardsSkeleton";
import { CAROUSEL_ITEMS_PER_VIEW_WIDE } from "@/constants/carousel";
import { Link } from "react-router-dom";

export function HomeDiscoverSection({ products, isLoadingProducts }) {

  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="New arrivals">
      {isLoadingProducts ? (
        <><h2 className="mb-3 text-sm font-semibold text-hero-dark">New Arrivals</h2><ProductCardsSkeleton label="Loading New Arrivals" /></>
      ) : products.length > 0 ? (
        <ItemsCarousel
          title="New Arrivals"
          viewAllHref="/shop"
          items={products.slice(0, 10)}
          itemsPerView={CAROUSEL_ITEMS_PER_VIEW_WIDE}
          renderItem={(product) => <ProductCarouselCard name={product.name} price={product.price} rating={product.rating} demo={product.demo} image={product.image} href={`/products/${product.id}`} />}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-sm font-semibold text-hero-dark">New Arrivals</h2>
            <p className="mt-1 text-xs text-hero-muted">Our catalogue is being prepared. Browse the shop for updates.</p>
          </div>
          <Link to="/shop" className="rounded-full border border-gray-200 px-4 py-2 text-xs text-hero-dark hover:bg-gray-50">View shop</Link>
        </div>
      )}
    </section>
  );
}
