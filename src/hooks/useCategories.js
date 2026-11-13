import { useEffect, useState } from "react";
import { api } from "@/api";
import { API_BASE_URL } from "@/constants/app";
import { CATALOG_CATEGORIES, categorySlug } from "@/constants/catalog";
import { displayText } from "@/utils/displayText";
let cached;
let pending;
export function useCategories() {
  const [categories, setCategories] = useState(cached || CATALOG_CATEGORIES);
  useEffect(() => {
    let active = true;
    pending ||= api.get("/categories").then(response => {
      cached = (response.data || []).map(category => ({
        id: categorySlug(category.name), apiId: category.id, label: displayText(category.name),
        description: displayText(category.description),
        image: category.image_url?.startsWith("/") ? new URL(category.image_url, API_BASE_URL).href : category.image_url || `/catalog/${categorySlug(category.name)}.svg`,
      }));
      cached.sort((a, b) => {
        const rank = id => { const i = CATALOG_CATEGORIES.findIndex(item => item.id === id); return i < 0 ? 999 : i; };
        return rank(a.id) - rank(b.id) || a.label.localeCompare(b.label);
      });
      return cached;
    }).catch(() => { pending = null; return CATALOG_CATEGORIES; });
    pending.then(result => { if (active) setCategories(result); });
    return () => { active = false; };
  }, []);
  return categories;
}
