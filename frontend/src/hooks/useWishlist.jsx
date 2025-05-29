// src/hooks/useWishlist.jsx
import { useState, useEffect } from "react";
export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);
  const toggle = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      const updated = exists
        ? prev.filter(p => p.id !== product.id)
        : [product, ...prev];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };
  return { wishlist, toggle };
}
