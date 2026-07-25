import { cn } from "@/utils";

export function StarRating({ count = 5, className }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="text-xs text-hero-green">
          ★
        </span>
      ))}
    </div>
  );
}
