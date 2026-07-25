import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Link } from "react-router-dom";
import { GreenClubCard } from "@/components/layout/GreenClubCard";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import { YourPlantCard } from "@/components/layout/YourPlantCard";
import { Icon } from "@/components/ui/Icon";
import { APP_NAME, LOGO_SRC, NAV_ITEMS, ROUTES } from "@/constants";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/utils";

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } =
    useSidebar();

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col overflow-hidden bg-sidebar text-white transition-all duration-300 lg:static lg:translate-x-0",
          isCollapsed ? "w-16" : "w-56",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-sidebar-active/50 px-3 py-4",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          <Link
            to={ROUTES.HOME}
            onClick={closeMobile}
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center",
            )}
          >
            <img
              src={LOGO_SRC}
              alt={APP_NAME}
              className={cn(
                "object-contain",
                isCollapsed ? "h-8 w-8" : "h-8 w-auto",
              )}
            />
          </Link>

          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              className="hidden h-8 w-8 items-center justify-center rounded-xl bg-sidebar-card text-sidebar-muted transition-colors hover:text-white lg:inline-flex"
            >
              <Icon
                svg={arrowIcon}
                className="h-4 w-4 -rotate-90 text-sidebar-muted"
              />
            </button>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-4 overflow-y-auto px-2.5 py-3">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        <div
          className={cn(
            "space-y-3 overflow-visible px-2.5 pb-4",
            isCollapsed && "flex flex-col items-center",
          )}
        >
          <YourPlantCard isCollapsed={isCollapsed} />
          <GreenClubCard isCollapsed={isCollapsed} />
        </div>

        {isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Expand sidebar"
            className="mb-4 hidden h-8 w-8 items-center justify-center rounded-xl bg-sidebar-card text-sidebar-muted transition-colors hover:text-white lg:mx-auto lg:inline-flex"
          >
            <Icon
              svg={arrowIcon}
              className="h-4 w-4 rotate-90 text-sidebar-muted"
            />
          </button>
        )}
      </aside>
    </>
  );
}

