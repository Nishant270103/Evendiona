import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <img src="/images/logo.png" alt="Evendiona Logo" className="h-16" />
            <p className="text-gray-600 font-light leading-relaxed">
              Premium T-shirts designed for comfort and style. Crafted with love in India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Facebook">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
                <span className="text-xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Twitter">
                <span className="text-xl">🐦</span>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900 tracking-wide">SHOP</h4>
            <div className="space-y-3">
              <Link to="/products?category=t-shirts" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                T-Shirts
              </Link>
              <Link to="/catalog" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                All Products
              </Link>
              <Link to="/new-arrivals" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                New Arrivals
              </Link>
              <Link to="/sale" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                Sale
              </Link>
            </div>
          </div>
          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900 tracking-wide">SUPPORT</h4>
            <div className="space-y-3">
              <Link to="/contact" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                Contact Us
              </Link>
              <Link to="/size-guide" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                Size Guide
              </Link>
              <Link to="/shipping" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                Shipping Info
              </Link>
              <Link to="/returns" className="block text-gray-600 hover:text-gray-900 transition-colors font-light">
                Returns
              </Link>
            </div>
          </div>
          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900 tracking-wide">NEWSLETTER</h4>
            <p className="text-gray-600 font-light">
              Get updates on new arrivals and exclusive offers
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors font-light"
              />
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm font-light">
              © 2025 Evendiona. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
