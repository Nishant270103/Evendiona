// src/pages/EmailVerification.jsx - COMPLETE REWRITTEN WITH AUTO LOGIN
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EmailVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  
  const { userId, email, message } = location.state || {};

  // Redirect if no user data
  useEffect(() => {
    if (!userId || !email) {
      navigate('/signup', { replace: true });
      return;
    }
  }, [userId, email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    const firstInput = document.getElementById('otp-0');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    
    // Handle paste
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      lastInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔐 Verifying OTP:', { userId, otp: otpString });

      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpString
        })
      });

      const data = await response.json();
      console.log('📥 OTP verification response:', data);
      
      if (data.success) {
        setSuccess('Email verified successfully! Logging you in...');
        
        // ✅ AUTO LOGIN WITH TOKEN
        const loginResult = await loginWithToken(data.data.token, data.data.user);
        
        if (loginResult.success) {
          console.log('✅ Auto login successful');
          
          // Show success message briefly
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                welcomeMessage: `Welcome to Evendiona, ${data.data.user.name}! 🎉` 
              }
            });
          }, 1500);
        } else {
          setError('Verification successful but login failed. Please login manually.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || timeLeft > 540) return; // Allow resend after 1 minute

    setResending(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Resending OTP for user:', userId);

      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('New verification code sent to your email!');
        setTimeLeft(600); // Reset timer
        setOtp(['', '', '', '', '', '']);
        
        // Focus first input
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const canResend = timeLeft <= 540 && !resending; // Can resend after 1 minute

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">📧</span>
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Initial Message */}
          {message && !error && !success && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm text-center">{message}</p>
            </div>
          )}

          <div className="space-y-6">
            
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex space-x-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                    className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Tip: You can paste the entire code at once
              </p>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Code has expired</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || !isOtpComplete || timeLeft <= 0}
              className={`w-full py-3 font-medium rounded-lg transition-colors ${
                loading || !isOtpComplete || timeLeft <= 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email & Continue'
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-sm font-medium transition-colors ${
                  canResend
                    ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
              {!canResend && timeLeft > 540 && (
                <p className="text-xs text-gray-500">
                  You can resend in {formatTime(timeLeft - 540)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back to Signup */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Sign Up
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact us at{' '}
            <a href="mailto:support@evendiona.com" className="text-blue-600 hover:underline">
              support@evendiona.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
