// src/components/DealSection.jsx
import React from 'react';
import { products } from '../data/products';
import ProductCard from './product/ProductCard';

export default function DealSection() {
  const deals = products.slice(8, 16); // pick 8 deals

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-[#8A6552] mb-4">Deals of the Day</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {deals.map(p => (
            <div key={p.id} className="flex-shrink-0 w-40">
              <ProductCard product={p} hideActions compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
