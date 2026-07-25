export const CAROUSEL_ITEMS_PER_VIEW_DEFAULT = [
  { minWidth: 768, count: 3 },
  { minWidth: 0, count: 2 },
];

export const CAROUSEL_ITEMS_PER_VIEW_WIDE = [
  { minWidth: 1280, count: 5 },
  { minWidth: 1024, count: 4 },
  { minWidth: 768, count: 3 },
  { minWidth: 0, count: 2 },
];

export function resolveItemsPerView(breakpoints) {
  const width = window.innerWidth;

  for (const breakpoint of breakpoints) {
    if (width >= breakpoint.minWidth) {
      return breakpoint.count;
    }
  }

  return 2;
}
