import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  LogOut,
  Sliders,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [configs, setConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchConfigs = async () => {
      try {
        const data = await api.getMyInterviewConfigs();
        if (isMounted && data.success) {
          setConfigs(data.configs || []);
        }
      } catch (err) {
        console.error('Error loading previous configurations:', err.message);
      } finally {
        if (isMounted) setLoadingConfigs(false);
      }
    };

    fetchConfigs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-container container">
      {/* Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="badge welcome-badge">
            <span className="badge-dot"></span>
            <span>Student Dashboard</span>
          </div>
          <h1 className="dashboard-title">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="dashboard-subtitle">
            Your personalized interview preparation portal. Target Track: <strong>{user?.targetRole}</strong>.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/interview/configure" className="btn btn-primary btn-sm">
            <Sliders size={16} />
            <span>Configure New Interview</span>
            <ArrowRight size={15} />
          </Link>
          <button onClick={logout} className="btn btn-secondary btn-sm logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Profile Card & Saved Configurations */}
      <div className="dashboard-grid">
        {/* Student Profile Card */}
        <div className="card profile-card">
          <div className="card-header">
            <h2 className="card-title">Student Profile</h2>
            <span className="status-pill active-pill">Active Session</span>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <User size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user?.name}</span>
              </div>
            </div>

            <div className="detail-item">
              <GraduationCap size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Education / Degree</span>
                <span className="detail-value">{user?.education || 'B.Tech Data Science'}</span>
              </div>
            </div>

            <div className="detail-item">
              <Briefcase size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Target Job Role</span>
                <span className="detail-value">{user?.targetRole || 'Software Engineer'}</span>
              </div>
            </div>

            <div className="detail-item">
              <Calendar size={18} className="detail-icon" />
              <div>
                <span className="detail-label">Account Created</span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start / Next Action Banner */}
        <div className="card quick-action-card">
          <div className="card-header">
            <h2 className="card-title">Interview Configuration (Phase 2)</h2>
            <span className="badge">
              <Sparkles size={13} />
              <span>Ready</span>
            </span>
          </div>
          <p className="card-description">
            Customize your mock interview domain, job role, experience level, interview category, and evaluation difficulty.
          </p>

          <Link to="/interview/configure" className="btn btn-primary btn-block">
            <Sliders size={18} />
            <span>Launch Configuration Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Previous Configurations Section */}
      <section className="saved-configs-section">
        <div className="section-title-row">
          <h2 className="section-heading">My Configured Interviews</h2>
          <span className="configs-count-badge">{configs.length} Saved</span>
        </div>

        {loadingConfigs ? (
          <p className="loading-text">Loading your saved configurations...</p>
        ) : configs.length === 0 ? (
          <div className="card empty-configs-card">
            <Sliders size={32} className="empty-icon" />
            <h3>No interview configurations yet</h3>
            <p>Select your domain, role, and difficulty level to prepare your first AI interview.</p>
            <Link to="/interview/configure" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              <span>Configure First Interview</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="configs-cards-grid">
            {configs.map((cfg) => (
              <div key={cfg._id} className="card config-history-card">
                <div className="config-history-header">
                  <span className="config-domain-badge">{cfg.domain}</span>
                  <span className={`config-diff-badge diff-${cfg.difficulty.toLowerCase()}`}>
                    {cfg.difficulty}
                  </span>
                </div>
                <h3 className="config-role-title">{cfg.role}</h3>
                <div className="config-history-meta">
                  <span>Level: <strong>{cfg.experienceLevel}</strong></span>
                  <span>Category: <strong>{cfg.category}</strong></span>
                  <span className="config-date">
                    <Clock size={13} />
                    {new Date(cfg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/interview/${cfg._id}/questions`}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.65rem', justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span>View / Generate Questions</span>
                  </span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
