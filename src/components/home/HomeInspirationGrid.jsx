import { Link } from "react-router-dom";
import iphone16 from "@/assets/images/devices/iphone16.png";
import iphone16pro from "@/assets/images/devices/iphone16pro.png";
import { categoryHref } from "@/constants/catalog";

export function HomeInspirationGrid() {
  return (
    <section className="mt-10 w-full sm:mt-12" aria-label="Explore devices">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:h-[60svh] lg:grid-rows-2">
        <Link to={categoryHref("macbooks")} className="group relative col-span-2 aspect-2/1 overflow-hidden rounded-2xl bg-gray-100 lg:aspect-auto lg:h-full">
          <img src="/images/connected-workspace.jpg" alt="Laptop and wireless earbuds on a desk" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
        <Link to={categoryHref("phones")} className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100 p-4 lg:aspect-auto lg:h-full">
          <img src={iphone16} alt="Explore iPhone 16" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
        <Link to={categoryHref("phones")} className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100 p-4 lg:aspect-auto lg:h-full">
          <img src={iphone16pro} alt="Explore iPhone 16 Pro" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
        <Link to={categoryHref("airpods-audio")} className="group flex col-span-2 aspect-2/1 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 lg:aspect-auto lg:h-full">
          <img src="/catalog/airpods-audio.svg" alt="Explore AirPods and audio" className="h-full w-full object-contain p-5 grayscale transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
      </div>
    </section>
  );
}
