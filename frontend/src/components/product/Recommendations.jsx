// src/components/product/Recommendations.jsx
import { products } from "../../data/products";
import ProductCard from "./ProductCard";

export default function Recommendations({ currentProductId }) {
  const recommendations = products
    .filter(p => p.id !== currentProductId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
