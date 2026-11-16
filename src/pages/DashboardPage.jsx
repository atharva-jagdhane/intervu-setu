import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  LogOut,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
          <button onClick={logout} className="btn btn-secondary btn-sm logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Student Profile Card & Overview */}
      <div className="dashboard-grid">
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

        {/* Next Phase Preparation Banner */}
        <div className="card next-phase-card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Phase 2: Category & Job Role Selection</h2>
          </div>
          <p className="card-description">
            Authentication and secure session management are fully verified. In Phase 2, we will build the interactive domain & competency taxonomy.
          </p>

          <ul className="phase-checklist">
            <li>
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Secure HTTP-Only Cookie Session Verified</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Mongoose User Profile Loaded From MongoDB Atlas</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Password Hash Excluded from API Response</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
