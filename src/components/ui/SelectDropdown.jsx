import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils";

export function SelectDropdown({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select",
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-hero-sage/40 px-4 py-3 text-left text-sm text-ink outline-none transition-colors hover:bg-hero-sage/55 disabled:cursor-not-allowed disabled:opacity-70",
          isOpen && "bg-hero-sage/60",
          buttonClassName,
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-hero-muted")}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
          fill="none"
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute z-40 mt-2 max-h-64 w-full overflow-y-auto bg-white py-1 text-sm text-ink",
            menuClassName,
          )}
        >
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer px-4 py-2 text-left hover:bg-hero-sage/35",
                option.value === value && "bg-hero-sage/55 text-hero-green",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
