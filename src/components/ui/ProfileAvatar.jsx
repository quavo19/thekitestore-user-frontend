import { useState } from "react";
import userIcon from "@/assets/svgs/User.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";

function initialsFromName(name) {
  const parts = String(name || "")
    .replace(/@.*$/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "";
}

export function ProfileAvatar({ src, name, alt = "Profile", className }) {
  const [failedSrc, setFailedSrc] = useState("");
  const initials = initialsFromName(name);
  const canUseImage = src && failedSrc !== src;

  if (canUseImage) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setFailedSrc(src)}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-label={alt}
      role="img"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-hero-sage/60 text-hero-green",
        className,
      )}
    >
      {initials ? (
        <span className="text-[0.42em] font-semibold leading-none tracking-normal">
          {initials}
        </span>
      ) : (
        <Icon svg={userIcon} className="h-1/2 w-1/2" />
      )}
    </span>
  );
}
