import { cn } from "@/utils";

export function Spinner({ className, size = "sm" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-5 w-5",
        className,
      )}
    />
  );
}
