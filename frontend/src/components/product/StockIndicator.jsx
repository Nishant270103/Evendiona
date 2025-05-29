// components/product/StockIndicator.jsx
export default function StockIndicator({ stock }) {
  if (stock <= 0) {
    return <span className="text-red-500 text-sm">Out of Stock</span>;
  }
  if (stock <= 5) {
    return <span className="text-orange-500 text-sm">Only {stock} left!</span>;
  }
  return <span className="text-green-500 text-sm">In Stock</span>;
}
