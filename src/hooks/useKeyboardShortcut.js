import { useEffect } from "react";

export function useKeyboardShortcut(key, callback, { meta = true } = {}) {
  useEffect(() => {
    function handleKeyDown(event) {
      const isMeta = meta ? event.metaKey || event.ctrlKey : true;
      if (!isMeta) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      event.preventDefault();
      callback();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, key, meta]);
}
