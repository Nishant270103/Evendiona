// src/components/layout/Header.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBagIcon, 
  UserIcon, 
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  
  // State management
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalItems = getCartItemCount();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  // Search functionality
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const closeAllMenus = () => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-sm font-medium">
            ✨ Free shipping worldwide • Premium quality guaranteed • 30-day returns
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm' 
          : 'bg-white'
      } border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={closeAllMenus}>
              <img 
                src="/images/logo.png" 
                alt="Evendiona Logo" 
                className="h-16"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="font-bold text-xl text-gray-900 hidden">
                EvenDiona
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-12">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm tracking-wide"
              >
                HOME
              </Link>
              <Link 
                to="/products"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm tracking-wide"
              >
                COLLECTION
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm tracking-wide"
              >
                ABOUT
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              
              {/* Search Button */}
              <button
                onClick={handleSearchToggle}
                className="hidden md:block p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative group" onClick={closeAllMenus}>
                <ShoppingBagIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="User Menu"
                >
                  <UserIcon className="h-5 w-5" />
                  {isAuthenticated && user && (
                    <span className="hidden sm:inline font-medium text-sm">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                    {!isAuthenticated ? (
                      <>
                        <Link 
                          to="/login" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors" 
                          onClick={closeAllMenus}
                        >
                          Sign In
                        </Link>
                        <Link 
                          to="/signup" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors" 
                          onClick={closeAllMenus}
                        >
                          Create Account
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors" 
                          onClick={closeAllMenus}
                        >
                          👤 My Account
                        </Link>
                        
                        <Link 
                          to="/orders" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors" 
                          onClick={closeAllMenus}
                        >
                          📦 Order History
                        </Link>
                        
                        <Link 
                          to="/wishlist" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors" 
                          onClick={closeAllMenus}
                        >
                          ❤️ Wishlist
                        </Link>
                        
                        <hr className="my-2" />
                        
                        <button 
                          onClick={() => { 
                            logout(); 
                            closeAllMenus();
                            console.log('User logged out');
                          }} 
                          className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-sm transition-colors"
                        >
                          🚪 Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2"
                aria-label="Menu"
              >
                {showMobileMenu ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar (Desktop) */}
        {isSearchOpen && (
          <div className="hidden md:block bg-white border-t border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="ml-3 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="ml-2 p-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-6 py-6 space-y-4">
              
              {/* Mobile Search */}
              <div className="pb-4 border-b border-gray-200">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </form>
              </div>

              {/* Mobile User Info */}
              {isAuthenticated && user && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              )}
              
              {/* Navigation Links */}
              <Link 
                to="/" 
                className="block text-gray-700 font-medium py-2" 
                onClick={closeAllMenus}
              >
                HOME
              </Link>
              <Link 
                to="/products" 
                className="block text-gray-700 font-medium py-2" 
                onClick={closeAllMenus}
              >
                COLLECTION
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 font-medium py-2" 
                onClick={closeAllMenus}
              >
                ABOUT
              </Link>
              
              {/* Mobile Auth/User Links */}
              {!isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    to="/login" 
                    className="block bg-gray-900 text-white text-center py-3 font-medium rounded-lg" 
                    onClick={closeAllMenus}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block border border-gray-300 text-gray-700 text-center py-3 font-medium rounded-lg" 
                    onClick={closeAllMenus}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link 
                    to="/profile" 
                    className="block text-gray-700 py-2" 
                    onClick={closeAllMenus}
                  >
                    👤 My Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block text-gray-700 py-2" 
                    onClick={closeAllMenus}
                  >
                    📦 Orders
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="block text-gray-700 py-2" 
                    onClick={closeAllMenus}
                  >
                    ❤️ Wishlist
                  </Link>
                  <button 
                    onClick={() => { 
                      logout(); 
                      closeAllMenus();
                    }} 
                    className="block w-full text-left text-red-600 py-2"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
