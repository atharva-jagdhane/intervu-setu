import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Plus, ArrowRight, Clock, Sparkles, Mic, CheckCircle2 } from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [configRes, sessionRes] = await Promise.allSettled([
          api.getMyInterviewConfigs(),
          api.getMyInterviewSessions()
        ]);

        if (isMounted) {
          if (configRes.status === 'fulfilled' && configRes.value.success) {
            setConfigs(configRes.value.configs || []);
          }
          if (sessionRes.status === 'fulfilled' && sessionRes.value.success) {
            setSessions(sessionRes.value.sessions || []);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page container">
      {/* Personalized Greeting & Single Clear Action */}
      <div className="dashboard-top-bar">
        <div className="dashboard-welcome">
          <h1 className="welcome-name">Hello, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="welcome-sub">
            {user?.targetRole ? `Targeting ${user.targetRole}` : 'Prepare for your next technical interview'}
          </p>
        </div>

        <Link to="/interview/configure" className="btn btn-primary">
          <Plus size={16} />
          <span>Start New Interview</span>
        </Link>
      </div>

      {/* Recent Sessions Overview */}
      <section className="sessions-section">
        <div className="sessions-header">
          <h2 className="sessions-heading">Recent Interview Configurations</h2>
          {configs.length > 0 && (
            <span className="sessions-count">{configs.length} {configs.length === 1 ? 'configuration' : 'configurations'}</span>
          )}
        </div>

        {loading ? (
          <div className="loading-card">
            <p>Loading your interview sessions...</p>
          </div>
        ) : configs.length === 0 ? (
          /* Clean Empty State */
          <div className="card empty-dashboard-card">
            <h3 className="empty-title">No interviews configured yet</h3>
            <p className="empty-desc">
              Choose your career domain, job role, and difficulty level to generate a custom 10-question interview bank.
            </p>
            <Link to="/interview/configure" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <span>Configure Your First Interview</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Compact, Airy Session Cards */
          <div className="sessions-list">
            {configs.map((cfg) => {
              // Find completed sessions for this config
              const completedForThis = sessions.filter(
                (s) => s.configId?._id === cfg._id || s.configId === cfg._id
              );

              return (
                <div key={cfg._id} className="card session-card">
                  <div className="session-card-main">
                    <div className="session-tags">
                      <span className="session-domain">{cfg.domain}</span>
                      <span className={`diff-badge diff-${cfg.difficulty.toLowerCase()}`}>
                        {cfg.difficulty}
                      </span>
                      {completedForThis.length > 0 && (
                        <span className="voice-completed-tag">
                          <CheckCircle2 size={12} className="text-emerald" />
                          <span>{completedForThis.length} {completedForThis.length === 1 ? 'voice session' : 'voice sessions'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="session-role">{cfg.role}</h3>
                    <div className="session-details">
                      <span>{cfg.experienceLevel}</span>
                      <span className="dot-sep">•</span>
                      <span>{cfg.category} Category</span>
                      <span className="dot-sep">•</span>
                      <span className="session-date">
                        <Clock size={13} />
                        {new Date(cfg.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="session-card-actions-group">
                    <Link
                      to={`/interview/${cfg._id}/questions`}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Questions</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      to={`/interview/${cfg._id}/live`}
                      className="btn btn-primary btn-sm"
                    >
                      <Mic size={14} />
                      <span>Voice Mock</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
