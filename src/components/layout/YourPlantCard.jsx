import plant1 from "@/assets/images/plants/plant1.png";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";

export function YourPlantCard({ isCollapsed }) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center overflow-visible rounded-2xl bg-sidebar-card p-2">
        <img
          src={plant1}
          alt="Your plant"
          className="-mt-2 h-12 w-12 rounded-xl object-cover"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="relative flex w-full items-center gap-3 overflow-visible rounded-2xl bg-sidebar-card py-3 pl-16 pr-3 text-left transition-colors hover:bg-sidebar-active"
    >
      <img
        src={plant1}
        alt="Your plant"
        className="absolute -left-2 -top-3 h-16 w-16 shrink-0 object-contain"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Your Plant</p>
        <p className="text-xs text-sidebar-muted">2 new tips</p>
      </div>
      <Icon svg={arrowIcon} className="h-4 w-4 rotate-90 text-sidebar-muted" />
    </button>
  );
}
