import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Compass, BrainCircuit, CheckSquare, ShieldCheck } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Domain & Role Tracks",
      desc: "Tailored preparation paths for Software Engineering, Data Science, Machine Learning, Data Engineering, and Cloud/DevOps."
    },
    {
      title: "AI Question Generation",
      desc: "Dynamic, role-specific questions generated using Google Gemini with key concepts and evaluation criteria."
    },
    {
      title: "Targeted Difficulty Levels",
      desc: "Configure questions calibrated specifically for Internships, Fresh Graduates, or Junior Engineers."
    }
  ];

  return (
    <div className="landing-view">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">
            <span>Engineering Interview Preparation</span>
          </div>

          <h1 className="hero-title">
            Bridge the gap between college and technical interviews.
          </h1>

          <p className="hero-description">
            IntervuSetu is an AI-powered mock interview and assessment platform designed for students and fresh graduates. Master role-specific technical questions, understand expected concepts, and build interview confidence.
          </p>

          <div className="hero-cta-group">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn btn-primary btn-lg"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Preparing'}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Feature Overview */}
      <section className="features-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-heading">How IntervuSetu Works</h2>
            <p className="section-subtext">A focused, structured way to practice for technical and behavioral interviews.</p>
          </div>

          <div className="features-grid">
            {features.map((f, idx) => (
              <div key={idx} className="card feature-card">
                <span className="feature-num">0{idx + 1}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
