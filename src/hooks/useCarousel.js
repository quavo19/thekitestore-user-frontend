import { useCallback, useEffect, useState } from "react";

export function useCarousel(length, { autoPlayInterval = 5000 } = {}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((current) => (current + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((current) => (current - 1 + length) % length);
  }, [length]);

  const goTo = useCallback((nextIndex) => {
    setIndex((current) => {
      setDirection(nextIndex > current ? 1 : -1);
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    if (!autoPlayInterval) {
      return undefined;
    }

    const interval = setInterval(next, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, next]);

  return { index, direction, next, prev, goTo };
}
