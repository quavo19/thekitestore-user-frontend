import cartIcon from "@/assets/svgs/cart.svg?raw";
import googleIcon from "@/assets/svgs/Google.svg?raw";
import heartIcon from "@/assets/svgs/Heart.svg?raw";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import searchIcon from "@/assets/svgs/Search.svg?raw";
import profileImage from "@/assets/images/others/profile.avif";
import { Icon } from "@/components/ui/Icon";
import { CartModal } from "@/components/shop/CartModal";
import { SupportModal } from "@/components/support/SupportModal";
import { WishlistModal } from "@/components/shop/WishlistModal";
import { ROUTES } from "@/constants/routes";
import { useSidebar } from "@/contexts/SidebarContext";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useModalParams } from "@/hooks/useModalParams";
import { useShopParams } from "@/hooks/useShopParams";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const { user, isAuthenticated, isLoadingUser, startGoogleAuth, logout } = useUser();
  const { openCart, openWishlist, openSupport } = useModalParams();
  const navigate = useNavigate();
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
  const profileMenuRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const prevResultsMode = useRef(isShopResultsMode);
  const displayName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.email ||
    "Plant lover";
  const avatarSrc = user?.avatar || profileImage;
  const bonusBalance = Number(user?.bonus?.balance || 0);

  useEffect(() => {
    if (isShopPage && prevResultsMode.current && !isShopResultsMode) {
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
    prevResultsMode.current = isShopResultsMode;
  }, [isShopResultsMode, isShopPage]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

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

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              aria-label="Profile menu"
              aria-expanded={isProfileMenuOpen}
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <Icon
                svg={arrowIcon}
                className={cn(
                  "h-4 w-4 text-ink transition-transform",
                  isProfileMenuOpen ? "rotate-0" : "rotate-180",
                )}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 border border-gray-100 bg-white py-6 text-left shadow-[0_8px_24px_rgb(15_23_42_/_0.12)]">
                {isAuthenticated ? (
                  <div>
                    <div className="flex items-center gap-3 px-6">
                      <img
                        src={avatarSrc}
                        alt={displayName}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {displayName}
                        </p>
                        <p className="truncate text-xs font-light text-hero-muted">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 px-6">
                      <p className="rounded-full bg-hero-green px-3 py-2 text-center text-xs font-medium text-white">
                        #{bonusBalance.toLocaleString()} points
                      </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(ROUTES.PROFILE);
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full cursor-pointer px-6 py-2 text-left text-sm font-light text-hero-muted hover:text-ink"
                      >
                        My profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(ROUTES.ORDERS);
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full cursor-pointer px-6 py-2 text-left text-sm font-light text-hero-muted hover:text-ink"
                      >
                        Orders
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openSupport();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full cursor-pointer px-6 py-2 text-left text-sm font-light text-hero-muted hover:text-ink"
                      >
                        Support
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="mt-2 block w-full cursor-pointer px-6 py-2 text-left text-sm font-medium text-hero-green hover:text-ink"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="px-6 text-center">
                      <p className="text-base font-semibold text-ink">
                        Get started on Kara Bloome
                      </p>
                      <button
                        type="button"
                        onClick={startGoogleAuth}
                        disabled={isLoadingUser}
                        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-light text-ink transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Icon svg={googleIcon} className="h-5 w-5" />
                        Sign in with Google
                      </button>
                      <button
                        type="button"
                        onClick={startGoogleAuth}
                        disabled={isLoadingUser}
                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                          <Icon svg={googleIcon} className="h-4 w-4" />
                        </span>
                        Sign up with Google
                      </button>
                    </div>

                    <div className="mt-6 border-t border-gray-100 px-6 py-5">
                      <button
                        type="button"
                        onClick={() => {
                          openSupport();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-4 text-sm font-light text-hero-muted hover:text-ink"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-xs">
                          ?
                        </span>
                        Help
                      </button>
                    </div>

                    <div className="border-t border-gray-100 px-6 py-5">
                      <button
                        type="button"
                        className="block cursor-pointer py-1 text-left text-sm font-light text-hero-muted hover:text-ink"
                      >
                        Become a Kara Bloome member
                      </button>
                      <button
                        type="button"
                        className="block cursor-pointer py-1 text-left text-sm font-light text-hero-muted hover:text-ink"
                      >
                        Plant care rewards
                      </button>
                    </div>

                    <div className="border-t border-gray-100 px-6 pt-4 text-xs font-light leading-6 text-hero-muted">
                      <span>About</span> <span>Blog</span> <span>Careers</span>{" "}
                      <span>Privacy</span> <span>Terms</span> <span>More</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <WishlistModal />
      <CartModal />
      <SupportModal />
    </>
  );
}
