// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/layout/Footer";
import { 
  HeartIcon, 
  ShareIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0].size);
      }
      if (product.colors?.length > 0) {
        setSelectedColor(product.colors[0].color);
      }
    }
  }, [product]);

  const validateSelection = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return false;
    }
    if (!selectedColor) {
      alert("Please select a color");
      return false;
    }
    if (!isAuthenticated) {
      alert("Please login to continue");
      navigate('/login');
      return false;
    }
    if (!product?._id) {
      alert("Product information is missing");
      return false;
    }
    return true;
  };

  const getSelectedSizeStock = () => {
    if (!selectedSize || !product?.sizes) return 0;
    const sizeOption = product.sizes.find(s => s.size === selectedSize);
    return sizeOption?.stock || 0;
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return;
    const stock = getSelectedSizeStock();
    if (quantity > stock) {
      alert(`Only ${stock} items available in stock`);
      return;
    }
    setAddingToCart(true);
    try {
      const result = await addToCart(product, quantity, { 
        size: selectedSize, 
        color: selectedColor 
      });
      if (result && result.success) {
        alert(`✅ Added ${quantity} x ${product.name} to cart!`);
      } else {
        alert(result?.error || 'Failed to add to cart');
      }
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!validateSelection()) return;
    const stock = getSelectedSizeStock();
    if (quantity > stock) {
      alert(`Only ${stock} items available in stock`);
      return;
    }
    setBuyingNow(true);
    try {
      const result = await addToCart(product, quantity, { 
        size: selectedSize, 
        color: selectedColor 
      });
      if (result && result.success) {
        navigate('/checkout', { 
          state: { 
            buyNow: true,
            product: product,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
          }
        });
      } else {
        alert(result?.error || 'Failed to process order');
      }
    } catch (error) {
      alert('Failed to process order. Please try again.');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      alert("Please login to add to wishlist");
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Use evendiona-tshirt1.png for Highland Mountains Tee, else use product images as usual
  const isHighlandMountainsTee = product.name === "Highland Mountains Tee";
  const images = isHighlandMountainsTee
    ? ["/images/evendiona-tshirt1.png"]
    : (product.images && product.images.length > 0
        ? product.images
        : ["/images/evendiona-tshirt1.png"]);
  const currentPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/collection')} className="hover:text-gray-900">Collection</button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img 
                src={images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover rounded-2xl"
                onError={(e) => {
                  e.target.src = "/images/evendiona-tshirt1.png";
                }}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {discount}% OFF
                </div>
              )}
              <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'
                }`}
              >
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/evendiona-tshirt1.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</span>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
              <h1 className="text-4xl font-light text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-light text-gray-900">₹{currentPrice.toLocaleString()}</span>
              {originalPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Save ₹{(originalPrice - currentPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Size</h3>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes?.map(sizeOption => (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={sizeOption.stock === 0}
                    className={`h-12 border-2 rounded-lg font-medium transition-colors relative ${
                      selectedSize === sizeOption.size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : sizeOption.stock === 0
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {sizeOption.size}
                    {sizeOption.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-600 mt-2">
                  {getSelectedSizeStock()} items available in {selectedSize}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Color</h3>
              <div className="flex space-x-3">
                {product.colors?.map(colorOption => (
                  <button
                    key={colorOption.color}
                    onClick={() => setSelectedColor(colorOption.color)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-colors ${
                      selectedColor === colorOption.color
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {colorOption.color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(getSelectedSizeStock(), quantity + 1))}
                  disabled={quantity >= getSelectedSizeStock()}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !selectedColor || getSelectedSizeStock() === 0}
                className={`w-full py-4 font-medium rounded-lg transition-colors ${
                  addingToCart || !selectedSize || !selectedColor || getSelectedSizeStock() === 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buyingNow || !selectedSize || !selectedColor || getSelectedSizeStock() === 0}
                className={`w-full py-4 font-medium rounded-lg border-2 transition-colors ${
                  buyingNow || !selectedSize || !selectedColor || getSelectedSizeStock() === 0
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {buyingNow ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Validation Messages */}
            {(!selectedSize || !selectedColor) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Please select {!selectedSize && 'size'} {!selectedSize && !selectedColor && 'and'} {!selectedColor && 'color'} to continue
                </p>
              </div>
            )}

            {getSelectedSizeStock() === 0 && selectedSize && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Sorry, {selectedSize} is out of stock. Please select a different size.
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <TruckIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders above ₹999</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">7-Day Returns</p>
                <p className="text-xs text-gray-600">Easy return policy</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 100% Premium Cotton</li>
                  <li>• Pre-shrunk and Machine Washable</li>
                  <li>• Comfortable Regular Fit</li>
                  <li>• High-Quality Print that won't fade</li>
                  <li>• Breathable and Soft Fabric</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Machine wash cold with like colors</li>
                  <li>• Do not bleach or use fabric softener</li>
                  <li>• Tumble dry low or hang to dry</li>
                  <li>• Iron on reverse side if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
