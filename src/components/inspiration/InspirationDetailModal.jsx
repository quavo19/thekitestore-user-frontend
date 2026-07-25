import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import closeIcon from "@/assets/svgs/Close.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

function ViewToggle({ viewMode, onChange }) {
  return (
    <div className="flex rounded-full bg-gray-100 p-0.5">
      {[
        { id: "grid", label: "Grid" },
        { id: "single", label: "Single" },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors",
            viewMode === option.id
              ? "bg-white text-hero-dark shadow-sm"
              : "text-hero-muted hover:text-hero-dark",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SingleImageView({ board, activeIndex, onIndexChange }) {
  const total = board.images.length;
  const image = board.images[activeIndex];

  function goPrev() {
    onIndexChange((activeIndex - 1 + total) % total);
  }

  function goNext() {
    onIndexChange((activeIndex + 1) % total);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-[50svh] flex-1 items-center justify-center bg-gray-50 px-4 py-6 sm:min-h-[55svh]">
        <button
          type="button"
          aria-label="Previous photo"
          onClick={goPrev}
          disabled={total <= 1}
          className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:left-4"
        >
          <Icon svg={arrowIcon} className="h-4 w-4 -rotate-90 text-ink" />
        </button>

        <img
          key={`${board.id}-${activeIndex}`}
          src={image}
          alt={`${board.title} — photo ${activeIndex + 1}`}
          className="max-h-[58svh] w-full max-w-full rounded-xl object-contain"
        />

        <button
          type="button"
          aria-label="Next photo"
          onClick={goNext}
          disabled={total <= 1}
          className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:right-4"
        >
          <Icon svg={arrowIcon} className="h-4 w-4 rotate-90 text-ink" />
        </button>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
        <p className="text-center text-sm font-light text-hero-muted">
          {activeIndex + 1} of {total}
        </p>

        {total > 1 ? (
          <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
            {board.images.map((thumb, index) => (
              <button
                key={`${board.id}-thumb-${index}`}
                type="button"
                aria-label={`View photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => onIndexChange(index)}
                className={cn(
                  "h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors",
                  index === activeIndex
                    ? "border-hero-green"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GridView({ board, onImageSelect }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
        {board.images.map((image, index) => (
          <button
            key={`${board.id}-${index}`}
            type="button"
            onClick={() => onImageSelect(index)}
            className="group mb-3 w-full cursor-pointer break-inside-avoid text-left sm:mb-4"
          >
            <img
              src={image}
              alt={`${board.title} — photo ${index + 1}`}
              className="w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function InspirationDetailModal({ board, onClose }) {
  const [shouldRender, setShouldRender] = useState(Boolean(board));
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (board) {
      setShouldRender(true);
      setViewMode("grid");
      setActiveIndex(0);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timer = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timer);
  }, [board]);

  useEffect(() => {
    if (!board) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (viewMode !== "single" || board.images.length <= 1) return;

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + board.images.length) % board.images.length);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % board.images.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [board, onClose, viewMode]);

  function openSingleView(index) {
    setActiveIndex(index);
    setViewMode("single");
  }

  if (!shouldRender || !board) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close inspiration gallery"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={board.title}
        className={cn(
          "relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl transition-all duration-300 sm:rounded-2xl",
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 sm:translate-y-2",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-xl text-hero-dark">
              {board.title}
            </h2>
            <p className="mt-0.5 text-sm font-light text-hero-muted">
              {board.images.length} photos
            </p>
          </div>

          <ViewToggle viewMode={viewMode} onChange={setViewMode} />

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-50"
          >
            <Icon svg={closeIcon} className="h-5 w-5 text-ink" />
          </button>
        </div>

        {viewMode === "single" ? (
          <SingleImageView
            board={board}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />
        ) : (
          <GridView board={board} onImageSelect={openSingleView} />
        )}
      </div>
    </div>
  );
}
