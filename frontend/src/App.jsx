// src/App.jsx

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Header from './components/layout/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmailVerification from './pages/EmailVerification';
import Wishlist from "./pages/Wishlist";
import EditProfile from './pages/EditProfile';

// User Protected Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Utility Pages
import NotFound from './pages/NotFound';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Environment Variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID && import.meta.env.MODE === 'development') {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set in .env file');
  console.log('💡 Add VITE_GOOGLE_CLIENT_ID=your_client_id to your .env file');
}

// Public Layout Wrapper using Outlet
function PublicLayout({ showHeader = true }) {
  return (
    <>
      {showHeader && <Header />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account/edit" element={<EditProfile />} />
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Auth Routes (No Header) */}
              <Route element={<PublicLayout showHeader={false} />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<EmailVerification />} />
              </Route>

              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<PublicLayout />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/orders" element={<UserOrders />} />
                </Route>
              </Route>

              {/* Admin Auth (No Header) */}
              <Route element={<PublicLayout showHeader={false} />}>
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

              {/* Admin Dashboard Routes (Nested) */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProducts />} />
                <Route path="products/edit/:id" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customers/:id" element={<AdminCustomers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="settings/profile" element={<AdminSettings />} />
                <Route path="settings/security" element={<AdminSettings />} />
                {/* Admin 404 */}
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-light text-gray-900 mb-4">Admin Page Not Found</h2>
                    <p className="text-gray-600">The admin page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Route>

              {/* Redirects */}
              <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/shop" element={<Navigate to="/collection" replace />} />
              <Route path="/products" element={<Navigate to="/collection" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
