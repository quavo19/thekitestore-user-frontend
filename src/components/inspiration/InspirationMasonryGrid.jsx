import { cn } from "@/utils";

const ASPECT_CLASSES = {
  tall: "aspect-[3/4]",
  medium: "aspect-[4/5]",
  wide: "aspect-[5/4]",
  square: "aspect-square",
};

function InspirationTile({ board, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(board)}
      className="group mb-3 w-full cursor-pointer break-inside-avoid text-left sm:mb-4"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gray-100",
          ASPECT_CLASSES[board.aspect] ?? ASPECT_CLASSES.medium,
        )}
      >
        <img
          src={board.thumbnail}
          alt={board.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-medium text-white">{board.title}</p>
          <p className="mt-0.5 text-xs font-light text-white/80">
            {board.images.length} photos
          </p>
        </div>
      </div>
      <p className="mt-2 px-0.5 font-serif text-sm text-hero-dark sm:hidden">
        {board.title}
      </p>
    </button>
  );
}

export function InspirationMasonryGrid({ boards, onSelectBoard }) {
  return (
    <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
      {boards.map((board) => (
        <InspirationTile
          key={board.id}
          board={board}
          onSelect={onSelectBoard}
        />
      ))}
    </div>
  );
}
