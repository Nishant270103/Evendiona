// src/components/ProtectedAdminRoute.jsx - ADMIN PROTECTION
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.success && data.data.user.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
