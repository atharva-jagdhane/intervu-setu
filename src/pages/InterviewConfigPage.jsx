import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Code2,
  BrainCircuit,
  Database,
  Cloud,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sliders,
  AlertCircle,
  Briefcase,
  Layers,
  Award,
  Zap,
  Info
} from 'lucide-react';
import './InterviewConfigPage.css';

export default function InterviewConfigPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Static fallback taxonomy matching backend
  const domainMetadata = {
    'Software Engineering': {
      icon: <Code2 size={24} className="domain-card-icon text-indigo" />,
      description: 'System design, web technologies, algorithms, and full-stack software development.',
      roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer']
    },
    'Data Science & AI': {
      icon: <BrainCircuit size={24} className="domain-card-icon text-violet" />,
      description: 'Machine learning, statistics, data analytics, neural networks, and AI architectures.',
      roles: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer']
    },
    'Data Engineering': {
      icon: <Database size={24} className="domain-card-icon text-blue" />,
      description: 'ETL pipelines, big data systems, distributed computing, and data warehouse modeling.',
      roles: ['Data Engineer']
    },
    'Cloud & DevOps': {
      icon: <Cloud size={24} className="domain-card-icon text-cyan" />,
      description: 'CI/CD pipelines, containerization, cloud infrastructure (AWS/GCP), and reliability.',
      roles: ['DevOps Engineer']
    },
    'HR & Behavioral': {
      icon: <Users size={24} className="domain-card-icon text-purple" />,
      description: 'Culture fit, STAR method situational challenges, teamwork, and leadership judgment.',
      roles: ['General HR & Culture Fit', 'Leadership & Situational']
    }
  };

  const experienceLevels = [
    { id: 'Internship', label: 'Internship', desc: 'College students seeking summer or off-campus internships' },
    { id: 'Fresher / Entry-level', label: 'Fresher / Entry-level', desc: 'Graduates & engineers in their first year of industry work' },
    { id: 'Junior Engineer', label: 'Junior Engineer', desc: 'Early-career professionals with 1–2 years of practical experience' }
  ];

  const categories = [
    { id: 'Technical', label: 'Technical', desc: 'Deep technical questions, problem-solving, and architecture concepts' },
    { id: 'HR', label: 'HR', desc: 'Career motivations, salary expectations, company culture, and ethics' },
    { id: 'Behavioral', label: 'Behavioral', desc: 'Real-world conflict resolution, STAR-method scenarios, and adaptability' },
    { id: 'Mixed', label: 'Mixed (Comprehensive)', desc: 'Balanced combination of technical depth and situational evaluation' }
  ];

  const difficulties = [
    { id: 'Easy', label: 'Easy', tag: 'Fundamental Concepts', colorClass: 'diff-easy' },
    { id: 'Medium', label: 'Medium', tag: 'Standard Industry Level', colorClass: 'diff-medium' },
    { id: 'Hard', label: 'Hard', tag: 'Edge Cases & Optimization', colorClass: 'diff-hard' }
  ];

  // Selection state
  const [selectedDomain, setSelectedDomain] = useState('Software Engineering');
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [selectedExperience, setSelectedExperience] = useState('Fresher / Entry-level');
  const [selectedCategory, setSelectedCategory] = useState('Mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '', savedConfig: null });

  // Update default role when domain changes
  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    const availableRoles = domainMetadata[domain]?.roles || [];
    if (!availableRoles.includes(selectedRole)) {
      setSelectedRole(availableRoles[0] || '');
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '', savedConfig: null });
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
      setFeedback({
        error: '',
        success: 'Interview configuration saved and locked in successfully!',
        savedConfig: result.config
      });
    } catch (err) {
      setFeedback({
        error: err.message || 'Failed to save configuration. Please try again.',
        success: '',
        savedConfig: null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="config-page container">
      {/* Header */}
      <div className="config-header">
        <div className="badge">
          <Sliders size={15} />
          <span>Interview Configuration</span>
        </div>
        <h1 className="config-page-title">
          Customize Your <span className="gradient-text">Mock Interview</span>
        </h1>
        <p className="config-page-subtitle">
          Configure the exact domain, role specifications, and difficulty parameters to tailor your AI interview session.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="config-layout">
        {/* Left: Configuration Steps */}
        <div className="config-steps">
          {/* Step 1: Domain Selection */}
          <section className="step-section">
            <div className="step-title-row">
              <span className="step-number">01</span>
              <div>
                <h2 className="step-heading">Select Career Domain</h2>
                <p className="step-subtext">Choose the primary field you are targeting.</p>
              </div>
            </div>

            <div className="domain-grid">
              {Object.keys(domainMetadata).map((domain) => {
                const isSelected = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleDomainChange(domain)}
                    className={`domain-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="domain-card-header">
                      {domainMetadata[domain].icon}
                      {isSelected && <CheckCircle2 size={18} className="selected-check" />}
                    </div>
                    <span className="domain-card-title">{domain}</span>
                    <span className="domain-card-desc">{domainMetadata[domain].description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Job Role Selection */}
          <section className="step-section">
            <div className="step-title-row">
              <span className="step-number">02</span>
              <div>
                <h2 className="step-heading">Select Specific Job Role</h2>
                <p className="step-subtext">Target roles associated with {selectedDomain}.</p>
              </div>
            </div>

            <div className="role-pills-container">
              {domainMetadata[selectedDomain]?.roles.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`role-pill ${isSelected ? 'selected' : ''}`}
                  >
                    <Briefcase size={15} />
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Experience Level */}
          <section className="step-section">
            <div className="step-title-row">
              <span className="step-number">03</span>
              <div>
                <h2 className="step-heading">Target Experience Level</h2>
                <p className="step-subtext">Adjusts question expectations and complexity.</p>
              </div>
            </div>

            <div className="option-cards-grid">
              {experienceLevels.map((lvl) => {
                const isSelected = selectedExperience === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedExperience(lvl.id)}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="option-card-top">
                      <span className="option-title">{lvl.label}</span>
                      {isSelected && <CheckCircle2 size={16} className="selected-check" />}
                    </div>
                    <span className="option-desc">{lvl.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 4: Interview Category */}
          <section className="step-section">
            <div className="step-title-row">
              <span className="step-number">04</span>
              <div>
                <h2 className="step-heading">Interview Category</h2>
                <p className="step-subtext">Focus area for the interview questions.</p>
              </div>
            </div>

            <div className="option-cards-grid">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="option-card-top">
                      <span className="option-title">{cat.label}</span>
                      {isSelected && <CheckCircle2 size={16} className="selected-check" />}
                    </div>
                    <span className="option-desc">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 5: Difficulty */}
          <section className="step-section">
            <div className="step-title-row">
              <span className="step-number">05</span>
              <div>
                <h2 className="step-heading">Difficulty Rating</h2>
                <p className="step-subtext">Determines the depth and rigor of evaluation.</p>
              </div>
            </div>

            <div className="difficulty-grid">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`difficulty-card ${diff.colorClass} ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="diff-name">{diff.label}</span>
                    <span className="diff-tag">{diff.tag}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: Sticky Summary Card & Action */}
        <aside className="config-summary-sidebar">
          <div className="card summary-card">
            <div className="summary-header">
              <h3 className="summary-title">Configuration Summary</h3>
              <span className="badge">
                <Sparkles size={13} />
                <span>Ready to Lock</span>
              </span>
            </div>

            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-label">Candidate</span>
                <span className="summary-value">{user?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Target Domain</span>
                <span className="summary-value">{selectedDomain}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Job Role</span>
                <span className="summary-value highlight-role">{selectedRole}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Experience Level</span>
                <span className="summary-value">{selectedExperience}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Category</span>
                <span className="summary-value">{selectedCategory}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Difficulty</span>
                <span className="summary-value highlight-diff">{selectedDifficulty}</span>
              </div>
            </div>

            {/* Error Message */}
            {feedback.error && (
              <div className="auth-alert error-alert" style={{ marginTop: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{feedback.error}</span>
              </div>
            )}

            {/* Success Card */}
            {feedback.success && (
              <div className="saved-success-box">
                <div className="success-header">
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span>Configuration Saved!</span>
                </div>
                <p className="success-sub">
                  Saved with ID: <code>{feedback.savedConfig?._id.slice(-8)}</code>
                </p>
                <div className="next-phase-notice">
                  <Info size={15} />
                  <span>Phase 3 (AI Question Generation) is ready to generate 10 tailored questions for this configuration.</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/interview/${feedback.savedConfig._id}/questions`)}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '0.85rem' }}
                >
                  <Sparkles size={16} />
                  <span>View & Generate Questions</span>
                </button>
              </div>
            )}

            {/* Action CTA */}
            <button
              onClick={handleStartInterview}
              disabled={isSubmitting}
              className="btn btn-primary btn-block start-btn"
            >
              {isSubmitting ? (
                <span>Locking in Configuration...</span>
              ) : (
                <>
                  <span>Save & Start Mock Interview</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary btn-block"
              style={{ marginTop: '0.75rem' }}
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
