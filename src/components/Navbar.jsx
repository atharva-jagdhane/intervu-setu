import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, GitBranch } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
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
          <a href="#overview" className="nav-link">Overview</a>
          <a href="#features" className="nav-link">Core Modules</a>
          <a href="#tech-stack" className="nav-link">Tech Stack</a>
          <a href="#status" className="nav-link">Phase Status</a>
        </nav>

        <div className="navbar-actions">
          <a
            href="https://github.com/atharva-jagdhane/intervu-setu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <GitBranch size={16} />
            <span>Repository</span>
          </a>
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>Phase 0 Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
