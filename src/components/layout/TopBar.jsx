import cartIcon from "@/assets/svgs/cart.svg?raw";
import heartIcon from "@/assets/svgs/Heart.svg?raw";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import searchIcon from "@/assets/svgs/Search.svg?raw";
import profileImage from "@/assets/images/others/profile.avif";
import { Icon } from "@/components/ui/Icon";
import { CartModal } from "@/components/shop/CartModal";
import { WishlistModal } from "@/components/shop/WishlistModal";
import { ROUTES } from "@/constants/routes";
import { useSidebar } from "@/contexts/SidebarContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useModalParams } from "@/hooks/useModalParams";
import { useShopParams } from "@/hooks/useShopParams";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function TopBarAction({ label, children, className, badge, onClick, isActive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80",
        isActive && "text-hero-green",
        className,
      )}
    >
      <span className="relative inline-flex">
        {children}
        {badge != null && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-lime px-1 text-[10px] font-medium text-ink">
            {badge}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-light text-ink sm:inline">{label}</span>
    </button>
  );
}

function HamburgerIcon() {
  return (
    <span
      className="flex w-6 flex-col items-start justify-center gap-[5px]"
      aria-hidden="true"
    >
      <span className="block h-[2px] w-6 rounded-full bg-current" />
      <span className="block h-[2px] w-3.5 rounded-full bg-current" />
      <span className="block h-[2px] w-5 rounded-full bg-current" />
    </span>
  );
}

export function TopBar() {
  const { toggleMobile } = useSidebar();
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount } = useCart();
  const { openCart, openWishlist } = useModalParams();
  const { pathname } = useLocation();
  const isShopPage = pathname === ROUTES.SHOP;
  const {
    query,
    openSearchModal,
    openSearch,
    setShopQuery,
    isShopResultsMode,
  } = useShopParams();
  const inputRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const prevResultsMode = useRef(isShopResultsMode);

  useEffect(() => {
    if (isShopPage && prevResultsMode.current && !isShopResultsMode) {
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
    prevResultsMode.current = isShopResultsMode;
  }, [isShopResultsMode, isShopPage]);

  useKeyboardShortcut("k", () => {
    if (!isShopPage) {
      openSearchModal();
    }
    inputRef.current?.focus();
  });

  function handleSearchFocus() {
    if (isShopPage) {
      setIsSearchFocused(true);
      return;
    }
    openSearchModal();
  }

  function handleSearchBlur() {
    if (!isShopPage) return;
    window.setTimeout(() => setIsSearchFocused(false), 120);
  }

  function handleSearchChange(event) {
    if (isShopPage) {
      setShopQuery(event.target.value);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (isShopPage) {
      setShopQuery(value);
      inputRef.current?.blur();
      return;
    }
    openSearch(value);
  }

  return (
    <>
      <header className="z-30 flex shrink-0 items-center gap-4 bg-white px-4 py-4 lg:px-8">
        <button
          type="button"
          onClick={toggleMobile}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-start text-ink lg:hidden"
        >
          <HamburgerIcon />
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className={cn(
            "relative min-w-0 flex-1 transition-all duration-300 ease-out",
            isShopPage
              ? isSearchFocused
                ? "max-w-full sm:max-w-sm sm:focus-within:max-w-md md:focus-within:max-w-lg"
                : "max-w-xs sm:max-w-sm sm:focus-within:max-w-md md:focus-within:max-w-lg"
              : "max-w-xs focus-within:max-w-sm sm:max-w-sm sm:focus-within:max-w-md md:focus-within:max-w-lg",
          )}
        >
          <Icon
            svg={searchIcon}
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          />
          <input
            ref={inputRef}
            key={query}
            type="search"
            name="query"
            defaultValue={query}
            placeholder="Search plants, care tips, accessories..."
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            className={cn(
              "w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm font-light text-ink outline-none transition-all duration-300 placeholder:text-gray-400 md:pr-20",
            )}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-light text-gray-400 md:flex">
            <span>⌘</span>
            <span>K</span>
          </span>
        </form>

        <div
          className={cn(
            "ml-auto flex shrink-0 items-center gap-4 sm:gap-6",
            isShopPage && isSearchFocused && "hidden sm:flex",
          )}
        >
          <TopBarAction
            label="Wishlist"
            badge={wishlistCount || undefined}
            isActive={wishlistCount > 0}
            onClick={openWishlist}
          >
            <Icon
              svg={heartIcon}
              className={cn(
                "h-5 w-5 transition-colors",
                wishlistCount > 0
                  ? "fill-hero-green text-hero-green"
                  : "text-ink",
              )}
            />
          </TopBarAction>

          <TopBarAction
            label="Cart"
            badge={cartCount || undefined}
            isActive={cartCount > 0}
            onClick={openCart}
          >
            <Icon
              svg={cartIcon}
              className={cn(
                "h-5 w-5 transition-colors",
                cartCount > 0 ? "text-hero-green" : "text-ink",
              )}
            />
          </TopBarAction>

          <button
            type="button"
            aria-label="Profile menu"
            className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <Icon svg={arrowIcon} className="h-4 w-4 rotate-180 text-ink" />
          </button>
        </div>
      </header>

      <WishlistModal />
      <CartModal />
    </>
  );
}
