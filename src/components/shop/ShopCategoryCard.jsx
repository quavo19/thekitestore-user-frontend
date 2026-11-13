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
      aria-pressed={isSelected}
      className="flex h-full w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {image ? <img src={image} alt="" className="h-full w-full object-contain object-center" /> : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-hero-dark"><path d="M4 7h6l1.5 2H20v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/><path d="M4 7V6a2 2 0 0 1 2-2h5l2 3h5a2 2 0 0 1 2 2"/></svg>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-hero-dark">
          {label}
        </p>
        <p className="mt-0.5 text-xs font-light text-hero-muted">{count == null ? "Explore collection" : `${count} items`}</p>
      </div>
    </button>
  );
}
