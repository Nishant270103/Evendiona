// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data.user);
              setIsAuthenticated(true);
            } else {
              throw new Error('Invalid token response');
            }
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ✅ REGULAR LOGIN WITH EMAIL/PASSWORD
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.data.user, message: data.message };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // ✅ AUTO LOGIN WITH TOKEN (FOR OTP VERIFICATION)
  const loginWithToken = async (token, userData = null) => {
    try {
      setError(null);
      localStorage.setItem('token', token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      } else {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data.user);
            setIsAuthenticated(true);
            return { success: true, user: data.data.user };
          }
        }
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: 'Auto login failed' };
    }
  };

  // ✅ REGISTER FUNCTION (FIXED)
  const register = async (userData) => {
    try {
      setError(null);
      // 👇 This must match your backend route!
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, data: data.data, message: data.message };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // ✅ UPDATE USER PROFILE
  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  // ✅ CLEAR ERROR
  const clearError = () => setError(null);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    loginWithToken,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
