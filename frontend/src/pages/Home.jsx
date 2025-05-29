// src/pages/Home.jsx - WORKING SLIDESHOW WITHOUT BLACK SCREEN
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import Footer from "../components/layout/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);

  // ✅ WORKING SLIDESHOW WITH DEMO IMAGES
  const slideImages = [
    {
      url: '/images/tshirt1.jpg',
      caption: 'Highland Mountains Collection'
    },
    {
      url: '/images/tshirt2.jpg', 
      caption: 'Urban Streetwear Collection'
    }
  ];

  // Featured Products 
  const featuredProducts = [
    {
      _id: "68330e20090035819d39994c", // Added correct _id field
      id: 1,
      name: "Evendiona Premium T-Shirt",
      image: "/images/evendiona-tshirt1.png", // Updated file extension to .png
      salePrice: 999,
      regularPrice: 1299,
      badge: "BESTSELLER"
    }
  ];

  // Customer Reviews
  const customerReviews = [
    {
      text: "Absolutely loved the tshirt, its my favourite one now. Quality is amazing!",
      name: "Arjun S.",
      rating: 5
    },
    {
      text: "Perfect fit and super comfortable. Highly recommend!",
      name: "Priya M.",
      rating: 5
    },
    {
      text: "Best tee I've bought this year. Worth every penny!",
      name: "Rohit K.",
      rating: 5
    }
  ];

  // ✅ AUTO SLIDESHOW
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slideImages.length]);

  // Auto-rotate reviews
  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length);
    }, 4000);
    return () => clearInterval(reviewInterval);
  }, [customerReviews.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ WORKING HERO SLIDESHOW */}
      <section className="relative h-screen overflow-hidden bg-gray-900">
        
        {/* Slideshow Images */}
        <div className="relative w-full h-screen overflow-hidden">
          {slideImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + slideImages.length) % slideImages.length)}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % slideImages.length)}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>

        {/* ✅ TEXT OVERLAY WITH BLUR EFFECT */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-6 max-w-4xl mx-auto">
            
            {/* Blur container */}
            <div className="bg-white/20 rounded-xl p-6 md:p-8 border border-white/10 shadow-lg">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wider leading-tight mb-4">
                <span className="block font-extralight">Discover</span>
                <span className="block font-light">Your</span>
                <span className="block font-normal">Style</span>
              </h1>
              
              <p className="text-md md:text-lg font-light opacity-80 mb-6 max-w-xl mx-auto leading-relaxed">
                Elevate your wardrobe with our premium collection of T-shirts, crafted for comfort and style.
              </p>
              
              <Link
                to="/collection"
                className="inline-block bg-white/30 text-white px-6 py-3 font-medium text-md hover:bg-white/40 transition-all duration-300 rounded-lg border border-white/20"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-light border border-white/20">
            {currentSlide + 1} / {slideImages.length}
          </div>
        </div>
      </section>

      {/* ✅ FEATURED PRODUCTS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">Featured Collection</h2>
            <p className="text-gray-600 text-lg font-light">Handpicked favorites for modern lifestyle</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product._id}`} className="group cursor-pointer"> {/* Updated to use product._id */}
                <div className="relative bg-white rounded-2xl overflow-hidden mb-6 shadow-sm hover:shadow-lg transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-60 h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                    {product.badge}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">₹{product.salePrice}</span>
                  <span className="text-gray-400 line-through text-sm">₹{product.regularPrice}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CUSTOMER REVIEWS */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">What People Say</h2>
            <p className="text-gray-600 font-light">Honest feedback from our community</p>
          </div>

          <div className="relative">
            <div className="bg-gray-50 p-12 rounded-3xl text-center">
              <div className="flex justify-center mb-6">
                {[...Array(customerReviews[currentReview].rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-gray-900 fill-current" />
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed font-light">
                "{customerReviews[currentReview].text}"
              </p>
              <p className="font-medium text-gray-900">
                {customerReviews[currentReview].name}
              </p>
            </div>

            {/* Review Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {customerReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReview ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ TRUST INDICATORS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <TruckIcon className="h-8 w-8 text-gray-600 mx-auto" />
              <h3 className="font-medium text-gray-900">Free Shipping</h3>
              <p className="text-gray-600 text-sm font-light">On orders above ₹999</p>
            </div>
            <div className="space-y-4">
              <ShieldCheckIcon className="h-8 w-8 text-gray-600 mx-auto" />
              <h3 className="font-medium text-gray-900">30-Day Returns</h3>
              <p className="text-gray-600 text-sm font-light">Easy returns & exchanges</p>
            </div>
            <div className="space-y-4">
              <CurrencyRupeeIcon className="h-8 w-8 text-gray-600 mx-auto" />
              <h3 className="font-medium text-gray-900">Secure Payment</h3>
              <p className="text-gray-600 text-sm font-light">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
