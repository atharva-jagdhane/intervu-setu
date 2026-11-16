import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the originally requested page if redirected from a ProtectedRoute
  const destination = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Please enter your student email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errors.password = 'Please enter your password';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await login(formData.email.trim(), formData.password);
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={20} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to continue your mock interviews and performance tracking.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-alert error-alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Student Email</label>
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${clientErrors.email ? 'input-error' : ''}`}
                autoComplete="email"
              />
            </div>
            {clientErrors.email && <span className="field-error">{clientErrors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">Password</label>
            </div>
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your account password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${clientErrors.password ? 'input-error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {clientErrors.password && <span className="field-error">{clientErrors.password}</span>}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            New to IntervuSetu?{' '}
            <Link to="/register" className="auth-link">
              Create a free student account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
