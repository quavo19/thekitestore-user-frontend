import { cn } from "@/utils";

export function ArchedImage({ src, alt, className, imageClassName }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-t-[999px] rounded-b-2xl bg-hero-sage/25",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
