import { useEffect } from "react";
import { SideModal } from "@/components/ui/SideModal";
import {
  FilterCheckbox,
  FilterRadio,
  FilterSection,
  useFilterState,
} from "@/components/shop/FilterControls";
import { PriceRangeSlider } from "@/components/shop/PriceRangeSlider";
import {
  SHOP_AVAILABILITY,
  SHOP_CATEGORIES,
  SHOP_PRICE_RANGE,
  SHOP_SIZES,
  SHOP_SORT_OPTIONS,
  SHOP_STYLES,
} from "@/constants/shop";

export function FilterModal({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  onClear,
}) {
  const {
    filters,
    toggleCategory,
    toggleSize,
    toggleAvailability,
    toggleStyle,
    setSort,
    setPriceRange,
    reset,
  } = useFilterState(initialFilters);

  useEffect(() => {
    if (isOpen) {
      reset(initialFilters);
    }
  }, [isOpen]);

  function handleApply() {
    onApply(filters);
    onClose();
  }

  function handleClear() {
    onClear();
    reset({
      categories: [],
      sizes: [],
      availability: [],
      styles: [],
      priceMin: SHOP_PRICE_RANGE.min,
      priceMax: SHOP_PRICE_RANGE.max,
      sort: "newest",
    });
    onClose();
  }

  return (
    <SideModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtering"
      footer={
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleApply}
            className="w-full cursor-pointer rounded-lg bg-hero-green py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full cursor-pointer rounded-lg border border-hero-green py-3 text-sm font-medium text-hero-green transition-colors hover:bg-hero-green/5"
          >
            Clear Filter
          </button>
        </div>
      }
    >
      <div className="px-5">
        <FilterSection title="Categories">
          {SHOP_CATEGORIES.map((category) => (
            <FilterCheckbox
              key={category.id}
              label={category.label}
              checked={filters.categories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Size & dimensions">
          {SHOP_SIZES.map((size) => (
            <FilterCheckbox
              key={size.id}
              label={size.label}
              checked={filters.sizes.includes(size.id)}
              onChange={() => toggleSize(size.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Availability">
          {SHOP_AVAILABILITY.map((option) => (
            <FilterCheckbox
              key={option.id}
              label={option.label}
              checked={filters.availability.includes(option.id)}
              onChange={() => toggleAvailability(option.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Style & Design" defaultOpen={false}>
          {SHOP_STYLES.map((style) => (
            <FilterCheckbox
              key={style.id}
              label={style.label}
              checked={filters.styles.includes(style.id)}
              onChange={() => toggleStyle(style.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Pricing">
          <PriceRangeSlider
            min={SHOP_PRICE_RANGE.min}
            max={SHOP_PRICE_RANGE.max}
            valueMin={filters.priceMin}
            valueMax={filters.priceMax}
            onChange={setPriceRange}
          />
        </FilterSection>

        <FilterSection title="Sorting">
          {SHOP_SORT_OPTIONS.map((option) => (
            <FilterRadio
              key={option.id}
              name="sort"
              label={option.label}
              checked={filters.sort === option.id}
              onChange={() => setSort(option.id)}
            />
          ))}
        </FilterSection>
      </div>
    </SideModal>
  );
}
