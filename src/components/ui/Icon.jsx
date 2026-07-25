import { cn } from "@/utils";

export function Icon({ svg, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 [&_svg]:h-full [&_svg]:w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
