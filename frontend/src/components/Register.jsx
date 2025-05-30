import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agreeToTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/request-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('OTP sent to your email!');
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
    setIsLoading(false);
  };

  // Step 2: Verify OTP (register)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        toast.success("Account created and logged in!");
        window.location.href = "/";
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="auth-card"
    >
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us to start shopping</p>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              className="checkbox-input"
              checked={formData.agreeToTerms}
              onChange={e => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the <a href="/terms" className="auth-link">Terms & Conditions</a> and{' '}
              <a href="/privacy" className="auth-link">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="form-input"
                placeholder="Enter the OTP sent to your email"
                autoFocus
                maxLength={6}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </button>
          <button
            type="button"
            className="auth-link mt-2"
            onClick={() => setStep(1)}
            disabled={isLoading}
          >
            Change email
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text)' }}>
        Already have an account?{' '}
        <a href="/login" className="auth-link">
          Sign in
        </a>
      </p>
    </motion.div>
  );
}
