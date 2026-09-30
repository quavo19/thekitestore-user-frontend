import { cn } from "@/utils";

function money(value) {
  return `GHS ${Number(value || 0).toFixed(0)}`;
}

export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  className,
}) {
  const range = max - min;
  const leftPercent = ((valueMin - min) / range) * 100;
  const rightPercent = 100 - ((valueMax - min) / range) * 100;

  function handleMinChange(event) {
    const next = Math.min(Number(event.target.value), valueMax - 1);
    onChange({ min: next, max: valueMax });
  }

  function handleMaxChange(event) {
    const next = Math.max(Number(event.target.value), valueMin + 1);
    onChange({ min: valueMin, max: next });
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-gray-200" />
        <div
          className="absolute inset-y-0 rounded-full bg-hero-green"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={handleMinChange}
          className="range-thumb pointer-events-none absolute inset-0 z-10 h-full w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={handleMaxChange}
          className="range-thumb pointer-events-none absolute inset-0 z-20 h-full w-full appearance-none bg-transparent"
        />
      </div>

      <div className="flex items-center justify-between text-xs font-light text-hero-muted">
        <span>{money(min)}</span>
        <span>{money(Math.round((max - min) / 2))}</span>
        <span>{money(max)}+</span>
      </div>
    </div>
  );
}
