import homeIcon from "@/assets/svgs/Home.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { Link, useLocation } from "react-router-dom";
import { APP_NAME } from "@/constants";
import { categoryHref } from "@/constants/catalog";
import { useCategories } from "@/hooks/useCategories";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/utils";

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const categories = useCategories();
  const { pathname, search } = useLocation();
  const selected = new URLSearchParams(search).get("category");
  const expanded = !isCollapsed || isMobileOpen;

  return (
    <>
      {isMobileOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMobile} />}
      <aside className={cn("store-sidebar fixed inset-y-0 left-0 z-50 flex h-full flex-col overflow-hidden bg-white text-ink transition-all lg:relative lg:translate-x-0", expanded ? "w-64" : "w-20", isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-6 right-0 w-px bg-gray-200" />
        <div className="flex items-center justify-between gap-2 px-5 py-7">
          <Link to="/" onClick={closeMobile} aria-label={APP_NAME} className="flex items-center gap-3">
            <span className="kite-mark" aria-hidden="true">↗</span>
            {expanded && <span className="text-[17px] font-bold leading-tight tracking-tight">the kite<span className="block text-xs font-normal tracking-[.25em] text-gray-500">STORE</span></span>}
          </Link>
          {expanded && <button onClick={toggleCollapse} className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-950 lg:block" aria-label="Collapse sidebar">‹</button>}
        </div>
        <nav aria-label="Shop categories" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          <Link to="/" title="Discover" onClick={closeMobile} className={cn("category-nav", pathname === "/" && "selected")}><Icon svg={homeIcon} className="h-5 w-7 text-current" />{expanded && "Discover"}</Link>
          {expanded && <p className="pb-2 pl-3 pt-6 text-xs font-semibold uppercase tracking-[.1em] text-gray-500">Shop by category</p>}
          <Link to="/shop" title="All products" onClick={closeMobile} className={cn("category-nav", pathname === "/shop" && !selected && "selected")}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-7 shrink-0"><path d="M4 7h6l1.5 2H20v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/><path d="M4 7V6a2 2 0 0 1 2-2h5l2 3h5a2 2 0 0 1 2 2"/></svg>{expanded && <span className="flex-1">All products</span>}</Link>
          {categories.map((category) => (
            <Link key={category.id} to={categoryHref(category.id)} title={category.label} onClick={closeMobile} className={cn("category-nav", pathname === "/shop" && selected?.split(",").includes(category.id) && "selected")}>
              <img src={category.image} alt="" className="h-7 w-7 shrink-0 rounded-md object-contain grayscale" />
              {expanded && <span className="flex-1">{category.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="relative px-5 py-5">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gray-200" />
          {expanded && <><Link to="/about" onClick={closeMobile} className="text-xs font-medium text-gray-800 hover:underline">About The Kite Store ↗</Link><p className="mt-3 text-xs leading-relaxed text-gray-600">Independent retailer.<br />Not an Apple Authorized Reseller.</p></>}
          {!expanded && <button onClick={toggleCollapse} className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:block" aria-label="Expand sidebar">›</button>}
        </div>
      </aside>
    </>
  );
}
