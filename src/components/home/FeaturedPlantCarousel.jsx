import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import iphone16pro from "@/assets/images/devices/iphone16pro.png";
import macbook from "@/assets/images/devices/macbook.png";
import airpodmax from "@/assets/images/devices/airpodmax.png";
import { CarouselTrack } from "@/components/ui/CarouselTrack";
import { Icon } from "@/components/ui/Icon";
import { categoryHref } from "@/constants/catalog";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/utils";
import { Link } from "react-router-dom";

const FEATURED_FALLBACK = [
  { id: "iphone", name: "iPhone", image: iphone16pro, href: categoryHref("phones") },
  { id: "macbook", name: "MacBook", image: macbook, href: categoryHref("macbooks") },
  { id: "airpods", name: "AirPods Max", image: airpodmax, href: categoryHref("airpods-audio") },
];
const money = (value) => `GHS ${Number(value || 0).toFixed(2)}`;

export function FeaturedPlantCarousel({ products = [] }) {
  const deals = products.filter((product) => product.hotDeal && (product.demo || product.availability === "in-stock"));
  const items = deals.length ? deals : FEATURED_FALLBACK;
  const { index, next, prev, goTo } = useCarousel(items.length, { autoPlayInterval: 6000 });
  const selectedIndex = index % items.length;

  return (
    <div className="mx-auto flex min-h-[365px] w-full max-w-[320px] flex-col rounded-[2rem] bg-hero-dark p-5 text-white lg:mx-0 lg:max-w-[220px]">
      <p className="font-serif text-lg leading-tight">{deals.length ? "Featured Hot Deals" : "Featured Devices"}</p>
      <CarouselTrack index={selectedIndex} className="mt-1 flex-1">
        {items.map((item) => (
          <div key={item.id} className="flex min-h-[250px] flex-col">
            <p className="text-sm font-light text-gray-300">{item.name}</p>
            {item.demo && <p className="mt-1 text-xs text-gray-300">Sample listing · not for sale</p>}
            <div className="my-3 flex h-36 items-center justify-center">
              <img src={item.image} alt={item.name} className="h-full w-full max-w-[150px] object-contain" />
            </div>
            <div className="mt-auto">
              {item.price != null && <div className="flex flex-wrap items-baseline gap-2"><span className="text-lg font-medium">{money(item.price)}</span>{item.originalPrice > item.price && <span className="text-xs text-gray-400 line-through">{money(item.originalPrice)}</span>}</div>}
              <Link to={item.href || `/products/${item.id}`} className="mt-2.5 inline-flex rounded-full border border-white/60 px-4 py-1.5 text-xs text-white hover:bg-white/10">{item.demo ? "View sample" : "Shop now"}</Link>
            </div>
          </div>
        ))}
      </CarouselTrack>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={prev} aria-label="Previous featured device" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><Icon svg={arrowIcon} className="h-3.5 w-3.5 -rotate-90" /></button>
        <div className="flex items-center gap-1">{items.map((item, dotIndex) => <button key={item.id} type="button" onClick={() => goTo(dotIndex)} aria-label={`Go to featured device ${dotIndex + 1}`} aria-current={dotIndex === selectedIndex ? "true" : undefined} className={cn("h-1 rounded-full", dotIndex === selectedIndex ? "w-2.5 bg-white" : "w-1 bg-white/40")} />)}</div>
        <button type="button" onClick={next} aria-label="Next featured device" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><Icon svg={arrowIcon} className="h-3.5 w-3.5 rotate-90" /></button>
      </div>
    </div>
  );
}
