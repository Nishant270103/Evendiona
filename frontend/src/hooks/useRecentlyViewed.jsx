// src/hooks/useRecentlyViewed.jsx
import { useState, useEffect } from "react";
export function useRecentlyViewed(max = 4) {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) setRecent(JSON.parse(stored));
  }, []);
  const add = (product) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, max);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      return updated;
    });
  };
  return { recent, add };
}
