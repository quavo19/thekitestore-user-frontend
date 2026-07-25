import closeIcon from "@/assets/svgs/Close.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

export function SideModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  panelClassName,
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timer = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={cn("fixed inset-0 z-[100]", className)}>
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full",
          panelClassName,
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-50"
          >
            <Icon svg={closeIcon} className="h-5 w-5 text-ink" />
          </button>
          <h2 className="text-base font-semibold text-hero-dark">{title}</h2>
          <span className="w-9" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <div className="border-t border-gray-100 p-5">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
