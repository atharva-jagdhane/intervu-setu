import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Code2,
  BrainCircuit,
  Database,
  Cloud,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import './InterviewConfigPage.css';

const domainMetadata = {
  'Software Engineering': {
    icon: <Code2 size={20} />,
    description: 'System design, web technologies, algorithms, and full-stack software development.',
    roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer']
  },
  'Data Science & AI': {
    icon: <BrainCircuit size={20} />,
    description: 'Machine learning, statistics, data analytics, neural networks, and AI architectures.',
    roles: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer']
  },
  'Data Engineering': {
    icon: <Database size={20} />,
    description: 'ETL pipelines, big data systems, distributed computing, and data warehouse modeling.',
    roles: ['Data Engineer']
  },
  'Cloud & DevOps': {
    icon: <Cloud size={20} />,
    description: 'CI/CD pipelines, containerization, cloud infrastructure (AWS/GCP), and reliability.',
    roles: ['DevOps Engineer']
  },
  'HR & Behavioral': {
    icon: <Users size={20} />,
    description: 'Culture fit, STAR method situational challenges, teamwork, and leadership judgment.',
    roles: ['General HR & Culture Fit', 'Leadership & Situational']
  }
};

const experienceLevels = [
  { id: 'Internship', label: 'Internship', desc: 'Students seeking internship roles' },
  { id: 'Fresher / Entry-level', label: 'Fresher / Entry', desc: 'Graduates & engineers in year 1' },
  { id: 'Junior Engineer', label: 'Junior (1-2 yrs)', desc: '1–2 years practical experience' }
];

const categories = [
  { id: 'Technical', label: 'Technical', desc: 'Core fundamentals & system problem solving' },
  { id: 'HR', label: 'HR', desc: 'Career motivations, cultural values, and ethics' },
  { id: 'Behavioral', label: 'Behavioral', desc: 'Situational judgment & teamwork challenges' },
  { id: 'Mixed', label: 'Mixed', desc: 'Comprehensive technical and behavioral blend' }
];

const difficulties = [
  { id: 'Easy', label: 'Easy', tag: 'Core Fundamentals' },
  { id: 'Medium', label: 'Medium', tag: 'Industry Standard' },
  { id: 'Hard', label: 'Hard', tag: 'Complex & Edge Cases' }
];

export default function InterviewConfigPage() {
  const navigate = useNavigate();

  const [selectedDomain, setSelectedDomain] = useState('Software Engineering');
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [selectedExperience, setSelectedExperience] = useState('Fresher / Entry-level');
  const [selectedCategory, setSelectedCategory] = useState('Mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    const roles = domainMetadata[domain]?.roles || [];
    if (!roles.includes(selectedRole)) {
      setSelectedRole(roles[0] || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        domain: selectedDomain,
        role: selectedRole,
        experienceLevel: selectedExperience,
        category: selectedCategory,
        difficulty: selectedDifficulty
      };

      const result = await api.createInterviewConfig(payload);
      if (result.success && result.config) {
        navigate(`/interview/${result.config._id}/questions`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save configuration. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="config-page container">
      {/* Top Header */}
      <div className="config-header">
        <Link to="/dashboard" className="config-back-link">
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
        <h1 className="config-title">Configure Interview</h1>
        <p className="config-subtitle">
          Select your target parameters to generate a 10-question interview session.
        </p>
      </div>

      {error && (
        <div className="auth-alert error-alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="config-grid-layout">
        {/* Left Column: Form Controls */}
        <div className="config-form-column">
          {/* Section 1: Domain */}
          <div className="config-group">
            <label className="config-group-label">1. Career Domain</label>
            <div className="domain-pill-list">
              {Object.keys(domainMetadata).map((domain) => {
                const isSelected = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleDomainChange(domain)}
                    className={`domain-pill-btn ${isSelected ? 'active' : ''}`}
                  >
                    <span className="pill-icon">{domainMetadata[domain].icon}</span>
                    <span className="pill-text">{domain}</span>
                    {isSelected && <Check size={16} className="pill-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Job Role */}
          <div className="config-group">
            <label className="config-group-label">2. Target Role</label>
            <div className="role-pill-list">
              {domainMetadata[selectedDomain]?.roles.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`role-pill-btn ${isSelected ? 'active' : ''}`}
                  >
                    <span>{role}</span>
                    {isSelected && <Check size={14} className="pill-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Experience Level */}
          <div className="config-group">
            <label className="config-group-label">3. Experience Level</label>
            <div className="option-row">
              {experienceLevels.map((exp) => {
                const isSelected = selectedExperience === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedExperience(exp.id)}
                    className={`choice-card ${isSelected ? 'active' : ''}`}
                  >
                    <div className="choice-title">{exp.label}</div>
                    <div className="choice-desc">{exp.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Category & Difficulty */}
          <div className="config-split-group">
            <div className="config-half-group">
              <label className="config-group-label">4. Focus Category</label>
              <div className="compact-choices">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`compact-choice-btn ${isSelected ? 'active' : ''}`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="config-half-group">
              <label className="config-group-label">5. Difficulty</label>
              <div className="compact-choices">
                {difficulties.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`compact-choice-btn diff-btn ${diff.id.toLowerCase()} ${isSelected ? 'active' : ''}`}
                    >
                      <span>{diff.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary Card & Primary Action */}
        <aside className="config-summary-column">
          <div className="card summary-card">
            <h2 className="summary-title">Session Summary</h2>
            <p className="summary-subtitle">Review before generating questions</p>

            <div className="summary-specs">
              <div className="summary-spec-row">
                <span className="spec-label">Domain</span>
                <span className="spec-value">{selectedDomain}</span>
              </div>
              <div className="summary-spec-row">
                <span className="spec-label">Role</span>
                <span className="spec-value highlight">{selectedRole}</span>
              </div>
              <div className="summary-spec-row">
                <span className="spec-label">Experience</span>
                <span className="spec-value">{selectedExperience}</span>
              </div>
              <div className="summary-spec-row">
                <span className="spec-label">Category</span>
                <span className="spec-value">{selectedCategory}</span>
              </div>
              <div className="summary-spec-row">
                <span className="spec-label">Difficulty</span>
                <span className={`diff-badge diff-${selectedDifficulty.toLowerCase()}`}>
                  {selectedDifficulty}
                </span>
              </div>
            </div>

            <div className="summary-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block"
              >
                {isSubmitting ? (
                  <span>Saving Configuration...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Save & Generate Questions</span>
                  </>
                )}
              </button>

              <Link to="/dashboard" className="btn btn-secondary btn-block">
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
