import plant2 from "@/assets/images/plants/plant2.png";

export function GreenClubCard({ isCollapsed }) {
  if (isCollapsed) {
    return (
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-lime text-xs font-bold text-sidebar"
        title="Join Green Club"
      >
        +
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sidebar-active bg-sidebar-card p-4">
      <div className="relative z-10 max-w-[65%] space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-accent-lime">Join Green Club</h3>
          <p className="mt-1 text-xs leading-relaxed text-white/80">
            Get exclusive offers &amp; early access
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-accent-lime px-4 py-2 text-xs font-semibold text-sidebar transition-opacity hover:opacity-90"
        >
          Join Now
        </button>
      </div>
      <img
        src={plant2}
        alt=""
        className="pointer-events-none absolute -bottom-2 -right-1 h-28 w-auto object-contain"
      />
    </div>
  );
}
