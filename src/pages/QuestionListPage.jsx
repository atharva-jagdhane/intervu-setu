import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  ChevronDown,
  Layers
} from 'lucide-react';
import './QuestionListPage.css';

export default function QuestionListPage() {
  const { configId } = useParams();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fetch configuration & questions on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const qData = await api.getQuestions(configId);
        if (isMounted) {
          setConfig(qData.config);
          setQuestions(qData.questions || []);
        }
      } catch (err) {
        // If questions not generated yet, fetch config details so user can trigger generation
        try {
          const cfgData = await api.getInterviewConfigById(configId);
          if (isMounted) {
            setConfig(cfgData.config);
            setQuestions([]);
          }
        } catch (cfgErr) {
          if (isMounted) {
            setError(cfgErr.message || 'Failed to load interview session.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [configId]);

  // Handle Generate / Regenerate
  const handleGenerate = async (regenerate = false) => {
    setGenerating(true);
    setError('');

    try {
      const data = await api.generateQuestions(configId, regenerate);
      if (data.success) {
        setQuestions(data.questions || []);
        if (data.config) setConfig(data.config);
      }
    } catch (err) {
      setError(err.message || 'Question generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-view">
        <Loader2 size={32} className="icon-spin text-emerald" />
        <h2 className="loading-title">Loading Interview Session...</h2>
        <p className="loading-subtitle">Retrieving configuration and questions</p>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="container error-view">
        <div className="card error-card">
          <AlertCircle size={36} className="text-vermilion" />
          <h2 className="error-title">Unable to Load Interview</h2>
          <p className="error-desc">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-list-page container">
      {/* Back Link */}
      <div className="question-nav-bar">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="question-page-header">
        <div className="header-meta">
          <span className="domain-label">{config?.domain}</span>
          <h1 className="header-title">{config?.role}</h1>
          <div className="session-specs">
            <span>{config?.experienceLevel}</span>
            <span className="dot-sep">•</span>
            <span>{config?.category} Focus</span>
            <span className="dot-sep">•</span>
            <span className={`diff-badge diff-${config?.difficulty?.toLowerCase()}`}>
              {config?.difficulty}
            </span>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="header-actions">
            <button
              onClick={() => handleGenerate(true)}
              disabled={generating}
              className="btn btn-secondary btn-sm"
              title="Regenerate all 10 questions"
            >
              <RotateCw size={14} className={generating ? 'icon-spin' : ''} />
              <span>{generating ? 'Regenerating...' : 'Regenerate Questions'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Generating Alert */}
      {generating && (
        <div className="card generating-callout">
          <Loader2 size={20} className="icon-spin text-emerald" />
          <div>
            <h4 className="callout-title">Synthesizing 10 Interview Questions...</h4>
            <p className="callout-desc">Formulating role-tailored questions, expected answers, and evaluation rubrics.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="auth-alert error-alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State: Prompt to generate */}
      {!generating && questions.length === 0 && (
        <div className="card empty-questions-card">
          <div className="empty-badge">
            <Sparkles size={16} />
            <span>Ready to Generate</span>
          </div>
          <h2 className="empty-title">Generate Your 10-Question Bank</h2>
          <p className="empty-desc">
            Your interview parameters for <strong>{config?.role}</strong> are locked in.
            Click below to generate 10 tailored questions with concepts and rubrics.
          </p>
          <button
            onClick={() => handleGenerate(false)}
            disabled={generating}
            className="btn btn-primary"
          >
            <Sparkles size={16} />
            <span>Generate Questions with Gemini</span>
          </button>
        </div>
      )}

      {/* Question Bank List */}
      {!generating && questions.length > 0 && (
        <div className="questions-section">
          <div className="questions-section-header">
            <h2 className="questions-section-title">Interview Questions ({questions.length})</h2>
            <span className="questions-section-note">Click any question's details to view rubrics & concepts</span>
          </div>

          <div className="questions-list">
            {questions.map((q) => (
              <div key={q._id || q.questionNumber} className="card question-card">
                <div className="question-header">
                  <span className="question-idx">Q{q.questionNumber < 10 ? `0${q.questionNumber}` : q.questionNumber}</span>
                  <div className="question-tags">
                    <span className="competency-tag">
                      <Tag size={12} />
                      <span>{q.competency}</span>
                    </span>
                    <span className={`diff-badge diff-${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="question-text">{q.questionText}</h3>

                {/* Collapsible Rubric & Concepts */}
                {((q.expectedKeyConcepts && q.expectedKeyConcepts.length > 0) ||
                  (q.evaluationCriteria && q.evaluationCriteria.length > 0)) && (
                  <details className="rubric-accordion">
                    <summary className="rubric-summary">
                      <span>View Expected Concepts & Rubric</span>
                      <ChevronDown size={14} className="accordion-chevron" />
                    </summary>

                    <div className="rubric-content">
                      {q.expectedKeyConcepts && q.expectedKeyConcepts.length > 0 && (
                        <div className="rubric-block">
                          <h4 className="rubric-subheading">Expected Key Concepts</h4>
                          <div className="concepts-pill-wrap">
                            {q.expectedKeyConcepts.map((concept, idx) => (
                              <span key={idx} className="concept-chip">
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.evaluationCriteria && q.evaluationCriteria.length > 0 && (
                        <div className="rubric-block">
                          <h4 className="rubric-subheading">Evaluation Rubric</h4>
                          <ul className="criteria-list">
                            {q.evaluationCriteria.map((criterion, idx) => (
                              <li key={idx} className="criteria-item">
                                <CheckCircle2 size={14} className="text-emerald" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>

          {/* Clean Next Phase Note */}
          <div className="card upcoming-phase-card">
            <div>
              <span className="phase-badge">Next: Phase 4</span>
              <h3 className="phase-title">Real-Time Voice Mock Interview</h3>
              <p className="phase-desc">
                In Phase 4, our voice agent will dynamically conduct this interview, evaluate spoken answers, and deliver real-time feedback.
              </p>
            </div>
            <Link to="/dashboard" className="btn btn-secondary btn-sm">
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
