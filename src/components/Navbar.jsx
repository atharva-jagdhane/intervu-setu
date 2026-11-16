import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <span className="brand-dot"></span>
          <span className="brand-title">IntervuSetu</span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/interview/configure"
                className={`nav-link ${isActive('/interview/configure') ? 'active' : ''}`}
              >
                Configure Interview
              </Link>
            </>
          ) : (
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Overview
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="auth-user-row">
              <span className="user-greeting">
                {user?.name?.split(' ')[0] || 'Student'}
              </span>
              <button
                onClick={handleLogout}
                className="btn-text-signout"
                title="Sign Out"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="public-actions">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Start Preparing
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
