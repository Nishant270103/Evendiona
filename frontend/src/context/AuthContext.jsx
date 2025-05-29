// src/context/AuthContext.jsx - COMPLETE REWRITTEN WITH AUTO LOGIN
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
          console.log('🔍 Checking existing authentication...');
          
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data.user);
              setIsAuthenticated(true);
              console.log('✅ User authenticated from stored token:', data.data.user.email);
            } else {
              throw new Error('Invalid token response');
            }
          } else {
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.error('❌ Auth check failed:', error);
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
      console.log('🔐 Attempting login for:', email);

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        setIsAuthenticated(true);
        console.log('✅ Login successful:', data.data.user.email);
        
        return { 
          success: true, 
          user: data.data.user,
          message: data.message 
        };
      } else {
        setError(data.message);
        return { 
          success: false, 
          error: data.message 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = 'Network error. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // ✅ AUTO LOGIN WITH TOKEN (FOR OTP VERIFICATION)
  const loginWithToken = async (token, userData = null) => {
    try {
      setError(null);
      console.log('🔐 Auto login with token...');

      // Store token
      localStorage.setItem('token', token);

      if (userData) {
        // Use provided user data
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Auto login successful with provided data:', userData.email);
        
        return { 
          success: true, 
          user: userData 
        };
      } else {
        // Fetch user data with token
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data.user);
            setIsAuthenticated(true);
            console.log('✅ Auto login successful:', data.data.user.email);
            
            return { 
              success: true, 
              user: data.data.user 
            };
          }
        }
        
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('❌ Auto login error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      return { 
        success: false, 
        error: 'Auto login failed' 
      };
    }
  };

  // ✅ REGISTER FUNCTION
  const register = async (userData) => {
    try {
      setError(null);
      console.log('📝 Attempting registration for:', userData.email);

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Registration successful:', data.data.email);
        return { 
          success: true, 
          data: data.data,
          message: data.message 
        };
      } else {
        setError(data.message);
        return { 
          success: false, 
          error: data.message 
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = 'Network error. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    console.log('🚪 Logging out user:', user?.email);
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
  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    loginWithToken, // ✅ For auto login after OTP verification
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
