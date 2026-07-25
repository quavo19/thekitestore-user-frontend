import { cn } from "@/utils";

export function ShopCategoryCard({
  label,
  count,
  image,
  isSelected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-0.5 text-left transition-colors",
        isSelected
          ? "bg-hero-green/5"
          : "hover:bg-gray-50/80",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100/80">
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-hero-dark">
          {label}
        </p>
        <p className="text-[10px] font-light text-hero-muted">{count} items</p>
      </div>
    </button>
  );
}
