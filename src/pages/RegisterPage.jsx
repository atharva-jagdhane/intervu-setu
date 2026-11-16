import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
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
    'Backend Developer'
  ];

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errors.password = 'Please create a password';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      errors.password = 'Password must contain at least one letter and one number';
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
      setServerError(err.message || 'Registration failed. Please check your details.');
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
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">
            Begin your AI-powered interview preparation journey with IntervuSetu.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-alert error-alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Atharva Jagdhane"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${clientErrors.name ? 'input-error' : ''}`}
                autoComplete="name"
              />
            </div>
            {clientErrors.name && <span className="field-error">{clientErrors.name}</span>}
          </div>

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

          {/* Education / Stream */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="education" className="form-label">Degree / Branch</label>
              <div className="input-group">
                <GraduationCap size={18} className="input-icon" />
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
            </div>

            {/* Target Job Role */}
            <div className="form-group flex-1">
              <label htmlFor="targetRole" className="form-label">Target Role</label>
              <div className="input-group">
                <Briefcase size={18} className="input-icon" />
                <select
                  id="targetRole"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  {targetRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Create Password</label>
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters (letter + number)"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${clientErrors.password ? 'input-error' : ''}`}
                autoComplete="new-password"
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

            {/* Password Requirement Hint */}
            <div className="password-rules">
              <span className={formData.password.length >= 8 ? 'rule-met' : 'rule-pending'}>
                • Minimum 8 chars
              </span>
              <span className={/[a-zA-Z]/.test(formData.password) ? 'rule-met' : 'rule-pending'}>
                • 1 letter
              </span>
              <span className={/\d/.test(formData.password) ? 'rule-met' : 'rule-pending'}>
                • 1 number
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Creating your profile...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
