import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  BrainCircuit,
  Sparkles,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  HelpCircle,
  Loader2,
  Tag,
  ListChecks,
  Sliders,
  ChevronRight
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
        // 1. Fetch questions for this config
        const qData = await api.getQuestions(configId);
        if (isMounted) {
          setConfig(qData.config);
          setQuestions(qData.questions || []);
        }
      } catch (err) {
        // If no questions generated yet, fetch config details to allow generating
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
      setError(err.message || 'Gemini Question generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-view">
        <Loader2 size={40} className="icon-spin text-indigo" />
        <h2>Loading Interview Session...</h2>
        <p className="text-secondary">Retrieving question bank and session parameters.</p>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="container error-view">
        <div className="card error-card">
          <AlertCircle size={40} className="text-error" />
          <h2>Unable to Load Questions</h2>
          <p>{error}</p>
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
      {/* Back Link & Breadcrumb */}
      <div className="breadcrumb-row">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <ChevronRight size={14} className="text-muted" />
        <span className="breadcrumb-current">AI Question Bank</span>
      </div>

      {/* Header Banner */}
      <div className="question-page-header">
        <div className="header-meta">
          <div className="badge session-badge">
            <BrainCircuit size={14} />
            <span>Gemini AI Question Bank</span>
          </div>
          <h1 className="header-title">
            Target Role: <span className="gradient-text">{config?.role}</span>
          </h1>
          <div className="session-spec-tags">
            <span className="spec-tag">Domain: <strong>{config?.domain}</strong></span>
            <span className="spec-tag">Level: <strong>{config?.experienceLevel}</strong></span>
            <span className="spec-tag">Category: <strong>{config?.category}</strong></span>
            <span className={`spec-tag diff-${config?.difficulty?.toLowerCase()}`}>
              Difficulty: <strong>{config?.difficulty}</strong>
            </span>
          </div>
        </div>

        <div className="header-actions">
          {questions.length > 0 && (
            <button
              onClick={() => handleGenerate(true)}
              disabled={generating}
              className="btn btn-secondary btn-sm"
              title="Regenerate all 10 questions using Gemini AI"
            >
              <RotateCw size={15} className={generating ? 'icon-spin' : ''} />
              <span>{generating ? 'Regenerating...' : 'Regenerate Questions'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Generating State Overlay / Notice */}
      {generating && (
        <div className="card generating-callout">
          <Loader2 size={24} className="icon-spin text-indigo" />
          <div className="callout-text">
            <h4>Google Gemini is synthesizing 10 interview questions...</h4>
            <p>Analyzing role competencies, difficulty constraints, and evaluation rubrics.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="auth-alert error-alert" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State: No questions generated yet */}
      {!generating && questions.length === 0 && (
        <div className="card empty-questions-card">
          <Sparkles size={44} className="empty-sparkle-icon" />
          <h2>Ready to Generate Interview Questions</h2>
          <p>
            Your configuration for <strong>{config?.role}</strong> ({config?.difficulty}) is locked in.
            Click below to generate 10 context-aware questions with expected key concepts and evaluation criteria.
          </p>
          <button
            onClick={() => handleGenerate(false)}
            disabled={generating}
            className="btn btn-primary btn-lg"
          >
            <Sparkles size={18} />
            <span>Generate 10 Questions with Gemini</span>
          </button>
        </div>
      )}

      {/* Questions List */}
      {!generating && questions.length > 0 && (
        <div className="questions-container">
          <div className="questions-meta-row">
            <span className="questions-count-label">
              Showing all <strong>{questions.length}</strong> AI-Generated Questions
            </span>
            <span className="notice-badge">
              <CheckCircle2 size={13} className="text-emerald" />
              <span>Structured Rubric Validated</span>
            </span>
          </div>

          <div className="questions-list">
            {questions.map((q) => (
              <div key={q._id || q.questionNumber} className="card question-item-card">
                <div className="question-item-top">
                  <div className="question-badge-group">
                    <span className="question-number-pill">Q{q.questionNumber}</span>
                    <span className="competency-badge">
                      <Tag size={12} />
                      <span>{q.competency}</span>
                    </span>
                  </div>
                  <span className={`diff-pill diff-${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="question-text">{q.questionText}</h3>

                {/* Expected Key Concepts */}
                {q.expectedKeyConcepts && q.expectedKeyConcepts.length > 0 && (
                  <div className="concepts-section">
                    <span className="section-mini-heading">Expected Key Concepts:</span>
                    <div className="concepts-pills">
                      {q.expectedKeyConcepts.map((concept, idx) => (
                        <span key={idx} className="concept-pill">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation Criteria */}
                {q.evaluationCriteria && q.evaluationCriteria.length > 0 && (
                  <div className="criteria-section">
                    <span className="section-mini-heading">Evaluation Rubric:</span>
                    <ul className="criteria-list">
                      {q.evaluationCriteria.map((criterion, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} className="text-emerald" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Next Phase Teaser Banner */}
          <div className="card voice-interview-teaser">
            <div className="teaser-content">
              <span className="badge">
                <Sparkles size={13} />
                <span>Upcoming Phase 4</span>
              </span>
              <h3>Real-Time Voice Mock Interview with Vapi AI</h3>
              <p>
                In the next phase, our real-time voice conversational agent will ask you these questions dynamically, listen to your spoken answers, and track your voice turn-taking.
              </p>
            </div>
            <Link to="/dashboard" className="btn btn-secondary">
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
