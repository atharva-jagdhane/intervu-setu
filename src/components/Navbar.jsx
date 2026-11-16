import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, GitBranch, LogIn, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <Sparkles size={20} className="icon-pulse" />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-name">IntervuSetu</span>
            <span className="brand-sub">Platform</span>
          </div>
        </Link>

        <nav className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
          <a href="/#features" className="nav-link">Core Modules</a>
          <a href="/#tech-stack" className="nav-link">Tech Stack</a>
        </nav>

        <div className="navbar-actions">
          <a
            href="https://github.com/atharva-jagdhane/intervu-setu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <GitBranch size={16} />
            <span>Repo</span>
          </a>

          {isAuthenticated ? (
            <div className="user-nav-group">
              <Link to="/dashboard" className="user-profile-pill">
                <User size={15} />
                <span>{user?.name?.split(' ')[0] || 'Student'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign Out">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
