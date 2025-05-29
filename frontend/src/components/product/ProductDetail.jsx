import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { products } from "../../data/products";
// Fix the import path to match the actual location of the Reviews component
import Reviews from "../../components/Reviews";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => String(p.id) === String(id));
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize);
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize);
    navigate("/checkout");
  };

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[#F9F7F5]">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Product Image + Wishlist */}
        <div className="relative">
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-[#E7B7A3] transition"
            aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted(product.id) ? (
              <HeartSolid className="h-7 w-7 text-[#E7B7A3]" />
            ) : (
              <HeartOutline className="h-7 w-7 text-[#8A6552]" />
            )}
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light text-[#4A4A4A] mb-2">{product.name}</h1>
            <p className="text-2xl text-[#8A6552] mb-6">₹{product.price}</p>
          </div>
          
          {/* Size selector */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 text-[#4A4A4A]">SIZE</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  className={`w-12 h-12 flex items-center justify-center border transition-all duration-200 ${
                    selectedSize === size 
                      ? 'border-[#8A6552] bg-[#8A6552] text-white' 
                      : 'border-[#D4C8BE] hover:border-[#8A6552] hover:bg-[#F5F1ED]'
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity selector */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 text-[#4A4A4A]">QUANTITY</h3>
            <div className="flex items-center border border-[#D4C8BE] inline-block">
              <button
                className="px-4 py-2 text-[#8A6552] hover:bg-[#F5F1ED] transition-colors"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-4 py-2 border-l border-r border-[#D4C8BE] min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                className="px-4 py-2 text-[#8A6552] hover:bg-[#F5F1ED] transition-colors"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#8A6552] text-white py-3 hover:bg-[#7A5542] transition-colors"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-full bg-[#E7B7A3] text-white py-3 hover:bg-[#D4A692] transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          {/* Product description */}
          <div className="pt-8 border-t border-[#D4C8BE]">
            <h3 className="text-sm uppercase tracking-wider mb-4 text-[#4A4A4A]">PRODUCT DETAILS</h3>
            <p className="text-[#4A4A4A] leading-relaxed">
              {product.description || "Product description not available."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <Reviews productId={product.id} />
    </div>
  );
}
