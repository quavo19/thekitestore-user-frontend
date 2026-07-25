import { useState } from "react";
import arrowIcon from "@/assets/svgs/arrow-Up.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils";

export function FilterSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-gray-100 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-hero-dark">{title}</span>
        <Icon
          svg={arrowIcon}
          className={cn(
            "h-4 w-4 text-hero-muted transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </section>
  );
}

export function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-light text-hero-dark">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-hero-green bg-hero-green text-white"
            : "border-gray-300 bg-white",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

export function FilterRadio({ label, checked, onChange, name }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-light text-hero-dark">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked ? "border-hero-green" : "border-gray-300",
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-hero-green" />}
      </span>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function toggleListItem(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function useFilterState(initial) {
  const [filters, setFilters] = useState(initial);

  function toggleCategory(id) {
    setFilters((current) => ({
      ...current,
      categories: toggleListItem(current.categories, id),
    }));
  }

  function toggleSize(id) {
    setFilters((current) => ({
      ...current,
      sizes: toggleListItem(current.sizes, id),
    }));
  }

  function toggleAvailability(id) {
    setFilters((current) => ({
      ...current,
      availability: toggleListItem(current.availability, id),
    }));
  }

  function toggleStyle(id) {
    setFilters((current) => ({
      ...current,
      styles: toggleListItem(current.styles, id),
    }));
  }

  function setSort(sort) {
    setFilters((current) => ({ ...current, sort }));
  }

  function setPriceRange({ min, max }) {
    setFilters((current) => ({ ...current, priceMin: min, priceMax: max }));
  }

  function reset(next) {
    setFilters(next);
  }

  return {
    filters,
    toggleCategory,
    toggleSize,
    toggleAvailability,
    toggleStyle,
    setSort,
    setPriceRange,
    reset,
  };
}
