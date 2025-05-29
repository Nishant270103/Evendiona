// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Public Layout Wrapper
const PublicLayout = ({ children, showHeader = true }) => (
  <>
    {showHeader && <Header />}
    {children}
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/collection" element={<PublicLayout><Catalog /></PublicLayout>} />
                <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                {/* Auth Routes (No Header) */}
                <Route path="/login" element={<PublicLayout showHeader={false}><Login /></PublicLayout>} />
                <Route path="/signup" element={<PublicLayout showHeader={false}><Signup /></PublicLayout>} />
                <Route path="/verify-email" element={<PublicLayout showHeader={false}><EmailVerification /></PublicLayout>} />
                <Route path="/account/edit" element={<EditProfile />} />


                {/* User Protected Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <PublicLayout><Cart /></PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <PublicLayout><Checkout /></PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                  <ProtectedRoute>
                    <PublicLayout><OrderConfirmation /></PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PublicLayout><UserProfile /></PublicLayout>
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <PublicLayout><UserOrders /></PublicLayout>
                  </ProtectedRoute>
                } />

                <Route path="/wishlist" element={<Wishlist />} />

                {/* Admin Auth (No Header) */}
                <Route path="/admin/login" element={<PublicLayout showHeader={false}><AdminLogin /></PublicLayout>} />

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

                {/* Legal Pages */}
                <Route path="/terms" element={<PublicLayout><TermsAndConditions /></PublicLayout>} />
                <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />

                {/* Redirects */}
                <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="/shop" element={<Navigate to="/collection" replace />} />
                <Route path="/products" element={<Navigate to="/collection" replace />} />

                {/* 404 Not Found */}
                <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
