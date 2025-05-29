// src/components/RecentlyViewed.jsx
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
export default function RecentlyViewed() {
  // Ensure `recentlyViewed` is always an array
  const { recentlyViewed = [] } = useRecentlyViewed();
  if (!recentlyViewed.length) return null;
  return (
    <section className="recently-viewed py-12">
      <h2 className="text-2xl font-bold mb-6 text-[#8A6552]">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 product-grid">
        {recentlyViewed.map(product => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <img src={product.image} alt={product.name} loading="lazy" className="w-full h-40 object-cover rounded" />
            <div className="mt-2 text-[#4A4A4A]">{product.name}</div>
            <div className="text-[#8A6552]">₹{product.salePrice || product.regularPrice || product.price}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
