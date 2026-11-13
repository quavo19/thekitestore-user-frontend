export function ProductCardsSkeleton({ label = "Loading products" }) {
  return (
    <div role="status" aria-label={label} aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={index >= 3 ? "hidden xl:block" : index === 2 ? "hidden md:block" : ""}>
            <div className="skeleton-shimmer aspect-[4/3] rounded-2xl" />
            <div className="mt-3 space-y-2">
              <div className="skeleton-shimmer h-4 w-4/5 rounded" />
              <div className="skeleton-shimmer h-3 w-3/5 rounded" />
              <div className="skeleton-shimmer h-4 w-2/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
