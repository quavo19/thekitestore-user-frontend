import { cn } from "@/utils";

export function SectionHeading({ children, className, as: Tag = "h2" }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 sm:gap-4", className)}
    >
      <span
        className="h-px max-w-16 flex-1 bg-hero-green/35 sm:max-w-24"
        aria-hidden="true"
      />
      <Tag className="shrink-0 font-serif text-xl text-hero-dark sm:text-2xl">
        {children}
      </Tag>
      <span
        className="h-px max-w-16 flex-1 bg-hero-green/35 sm:max-w-24"
        aria-hidden="true"
      />
    </div>
  );
}
