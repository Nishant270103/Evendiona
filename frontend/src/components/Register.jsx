// components/Register.jsx
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PasswordStrength } from './PasswordStrength';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions', {
        className: 'toast toast-error',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Account created successfully!', {
        className: 'toast toast-success',
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.', {
        className: 'toast toast-error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-card"
    >
      {/* Header */}
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us to start shopping</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="form-input-wrapper">
            <User className="input-icon" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="form-input-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrapper">
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              placeholder="Create a password"
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formData.password && <PasswordStrength password={formData.password} />}
        </div>

        {/* Terms & Conditions */}
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="terms"
            className="checkbox-input"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the <a href="#" className="auth-link">Terms & Conditions</a> and{' '}
            <a href="#" className="auth-link">Privacy Policy</a>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner" />
              <span style={{ marginLeft: '0.5rem' }}>Creating account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text)' }}>
        Already have an account?{' '}
        <a href="#" className="auth-link">
          Sign in
        </a>
      </p>
    </motion.div>
  );
}