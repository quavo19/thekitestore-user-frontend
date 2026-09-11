import { cn } from "@/utils";

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <label
      className={cn(
        "relative inline-flex cursor-pointer items-center",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border-2 transition-colors",
          checked
            ? "border-hero-green bg-hero-green text-white"
            : "border-gray-300 bg-white",
          !disabled && "hover:border-hero-green",
        )}
      >
        {checked && (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3 w-3"
            fill="none"
          >
            <path
              d="M3.5 8.2 6.6 11 12.5 5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  );
}
