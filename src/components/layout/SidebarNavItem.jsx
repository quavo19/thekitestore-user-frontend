import { NavLink } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";

export function SidebarNavItem({ to, icon, label, isCollapsed, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-lg p-3 text-[14px] font-light text-white transition-colors",
          isActive ? "bg-sidebar-active" : "hover:bg-sidebar-active/60",
          isCollapsed && "justify-center px-2",
        )
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            svg={icon}
            className={cn(
              "h-5 w-5",
              isActive ? "text-white" : "text-white/75",
            )}
          />
          {!isCollapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}

