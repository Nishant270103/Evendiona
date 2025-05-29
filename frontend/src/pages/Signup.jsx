// src/pages/Signup.jsx - COMPLETE FRONTEND SIGNUP WITH GOOGLE OAUTH
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, and number';
        } else {
          delete errors.password;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
        
      case 'phone':
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          errors.phone = 'Phone number must be 10 digits';
        } else {
          delete errors.phone;
        }
        break;
        
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Real-time validation
    if (name !== 'agreeToTerms') {
      validateField(name, inputValue);
    }
    
    // Clear general error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ REGULAR EMAIL SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Submitting registration:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });

      const result = await register(formData);
      
      if (result.success) {
        console.log('✅ Registration successful, redirecting to OTP verification');
        
        // ✅ REDIRECT TO OTP VERIFICATION PAGE
        navigate('/verify-email', { 
          state: { 
            userId: result.data.userId, 
            email: result.data.email,
            message: result.message
          } 
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGNUP SUCCESS HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('🔐 Processing Google signup...');
      
      // Decode the JWT credential to get user info
      const userInfo = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      console.log('👤 Google user info:', userInfo);
      
      // Send Google user data to backend
      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // ✅ AUTO LOGIN USER WITH TOKEN
        localStorage.setItem('token', data.data.token);
        
        console.log('✅ Google signup/login successful');
        
        // Show success message
        if (data.data.isNewUser) {
          alert('🎉 Account created successfully! Welcome to Evendiona!');
        } else {
          alert('✅ Welcome back to Evendiona!');
        }
        
        // ✅ REDIRECT TO HOME PAGE (USER IS NOW LOGGED IN)
        navigate('/', { 
          replace: true,
          state: { 
            welcomeMessage: `Welcome to Evendiona, ${data.data.user.name}! 🎉` 
          }
        });
      } else {
        setError(data.message || 'Google signup failed');
      }
    } catch (error) {
      console.error('❌ Google signup error:', error);
      setError('Google signup failed. Please try again.');
    }
  };

  // ✅ GOOGLE SIGNUP ERROR HANDLER
  const handleGoogleError = (error) => {
    console.error('❌ Google signup error:', error);
    setError('Google signup failed. Please try again.');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || ''
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
          </Link>
          <h2 className="text-3xl font-light text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join Evendiona and start shopping premium T-shirts</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          {/* General Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* ✅ GOOGLE SIGNUP BUTTON */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
              width="100%"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    validationErrors.firstName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Enter first name"
                  disabled={loading}
                />
                {validationErrors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    validationErrors.lastName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Enter last name"
                  disabled={loading}
                />
                {validationErrors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                  validationErrors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                  validationErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Enter 10-digit phone number"
                disabled={loading}
              />
              {validationErrors.phone && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors pr-12 ${
                    validationErrors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
              
              {validationErrors.password && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors pr-12 ${
                    validationErrors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-gray-300 text-gray-900 focus:ring-gray-200"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-gray-900 hover:underline font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-gray-900 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {validationErrors.agreeToTerms && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.agreeToTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(validationErrors).length > 0 || !formData.agreeToTerms}
              className={`w-full py-3 font-medium rounded-lg transition-colors ${
                loading || Object.keys(validationErrors).length > 0 || !formData.agreeToTerms
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
