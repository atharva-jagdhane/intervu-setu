import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    education: 'B.Tech Data Science',
    targetRole: 'Software Engineer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetRoles = [
    'Software Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Engineer',
    'DevOps Engineer'
  ];

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Please create a password';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      errors.password = 'Password must include at least one letter and one number';
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
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-heading">Create Account</h1>
          <p className="auth-subheading">
            Sign up to start configuring and practicing AI mock interviews.
          </p>
        </div>

        {serverError && (
          <div className="alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Atharva Jagdhane"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${clientErrors.name ? 'input-error' : ''}`}
            />
            {clientErrors.name && <span className="error-text">{clientErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Student Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@college.edu"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${clientErrors.email ? 'input-error' : ''}`}
            />
            {clientErrors.email && <span className="error-text">{clientErrors.email}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="education" className="form-label">Degree / Stream</label>
              <input
                id="education"
                name="education"
                type="text"
                placeholder="B.Tech Data Science"
                value={formData.education}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetRole" className="form-label">Target Role</label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="form-select"
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters (letter + number)"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${clientErrors.password ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {clientErrors.password && <span className="error-text">{clientErrors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem' }}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-note">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-switch-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
