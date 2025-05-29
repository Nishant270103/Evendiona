// components/LoginSignupModal.jsx
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

export default function LoginSignupModal({ closeModal }) {
  const [isSignupMode, setIsSignupMode] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>
          ✖
        </button>

        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setIsSignupMode(false)}
            className={isSignupMode ? '' : 'active'}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignupMode(true)}
            className={isSignupMode ? 'active' : ''}
          >
            Sign Up
          </button>
        </div>

        {isSignupMode ? (
          /* Signup Form */
          <form className="auth-form">
            <h2>Create an Account</h2>
            <div className="form-group">
              <label>Email Address</label>
              <div className="form-input-wrapper">
                <Mail className="input-icon" />
                <input type="email" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="form-input-wrapper">
                <Lock className="input-icon" />
                <input type="password" placeholder="Enter your password" required />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
          </form>
        ) : (
          /* Login Form */
          <form className="auth-form">
            <h2>Welcome Back</h2>
            <div className="form-group">
              <label>Email Address</label>
              <div className="form-input-wrapper">
                <Mail className="input-icon" />
                <input type="email" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="form-input-wrapper">
                <Lock className="input-icon" />
                <input type="password" placeholder="Enter your password" required />
              </div>
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#" className="auth-link">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <p>or continue with</p>
          <div className="social-buttons">
            <button className="social-btn">Google</button>
            <button className="social-btn">GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}