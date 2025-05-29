// src/pages/NotFound.jsx - MODERN MINIMALIST 404
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-light text-gray-200 mb-4">404</h1>
          <div className="text-6xl mb-6">🧭</div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-wide">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            Go Home
          </Link>
          <Link
            to="/collection"
            className="border border-gray-300 text-gray-700 px-8 py-4 font-medium hover:border-gray-400 transition-colors rounded-lg"
          >
            Browse Collection
          </Link>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Need help? Try these:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact Support
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About Us
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-gray-900 font-medium">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
