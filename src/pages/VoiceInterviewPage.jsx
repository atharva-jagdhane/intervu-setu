import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useVapi } from '../hooks/useVapi';
import {
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import './VoiceInterviewPage.css';

export default function VoiceInterviewPage() {
  const { configId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Backend session & config state
  const [session, setSession] = useState(null);
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [initError, setInitError] = useState('');

  // Call timer state
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  // Vapi Voice Hook
  const {
    callStatus,
    isSpeaking,
    isMuted,
    error: vapiError,
    transcripts,
    liveUtterance,
    startCall,
    stopCall,
    toggleMute
  } = useVapi();

  // Track synced transcript length to avoid repeated network sends
  const lastSyncedLengthRef = useRef(0);
  const transcriptScrollRef = useRef(null);

  // 1. Fetch Configuration & Questions on Mount
  useEffect(() => {
    let isMounted = true;

    const loadSessionData = async () => {
      setLoadingData(true);
      setInitError('');

      try {
        const qData = await api.getQuestions(configId);
        if (isMounted) {
          setConfig(qData.config);
          setQuestions(qData.questions || []);
          if (!qData.questions || qData.questions.length === 0) {
            setInitError('No questions generated for this configuration. Please generate questions first.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setInitError(err.message || 'Failed to load interview session details.');
        }
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    loadSessionData();

    return () => {
      isMounted = false;
    };
  }, [configId]);

  // 2. Call Duration Timer
  useEffect(() => {
    if (callStatus === 'active') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  // Format timer as mm:ss
  const formattedTimer = useMemo(() => {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [duration]);

  // 3. Question Progression Tracking from Transcript Events
  const { currentQuestionIdx, answeredQuestions } = useMemo(() => {
    if (!questions || questions.length === 0) {
      return { currentQuestionIdx: 0, answeredQuestions: new Set() };
    }

    let activeIdx = 0;
    const answered = new Set();
    let hasCandidateSpokenForCurrent = false;

    for (const entry of transcripts) {
      if (entry.speaker === 'interviewer') {
        const lower = entry.text.toLowerCase();
        // Check if interviewer explicitly transitions to a specific question number
        for (let i = 0; i < questions.length; i++) {
          const qNum = questions[i].questionNumber;
          const matchPattern = new RegExp(`question\\s+${qNum}\\b`, 'i');
          if (matchPattern.test(lower)) {
            if (i > activeIdx) {
              if (hasCandidateSpokenForCurrent) {
                answered.add(activeIdx);
              }
              activeIdx = i;
              hasCandidateSpokenForCurrent = false;
            }
            break;
          }
        }
      } else if (entry.speaker === 'candidate') {
        // Candidate is answering the active question
        hasCandidateSpokenForCurrent = true;
      }
    }

    // If candidate spoke on current question, mark it answered when interview ends
    if (hasCandidateSpokenForCurrent && callStatus === 'ended') {
      answered.add(activeIdx);
    }

    return { currentQuestionIdx: activeIdx, answeredQuestions: answered };
  }, [transcripts, questions, callStatus]);

  // 4. Auto-scroll transcript container to bottom on new messages
  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [transcripts, liveUtterance]);

  // 5. Sync Transcripts to Backend incrementally
  useEffect(() => {
    if (!session?._id || transcripts.length === 0) return;

    if (transcripts.length > lastSyncedLengthRef.current) {
      const newEntries = transcripts.slice(lastSyncedLengthRef.current);
      lastSyncedLengthRef.current = transcripts.length;

      api.saveSessionTranscript(session._id, newEntries).catch((err) => {
        console.warn('[Session Transcript Sync Warning]:', err.message);
      });
    }
  }, [transcripts, session]);

  // 6. Handle Call End Cleanup & Final Persistence
  useEffect(() => {
    if (callStatus === 'ended' && session?._id) {
      api
        .endInterviewSession(session._id, {
          status: 'completed',
          metadata: {
            callDurationSeconds: duration,
            endReason: 'call_ended',
            questionsAnswered: answeredQuestions.size
          }
        })
        .catch((err) => {
          console.warn('[Session Finalize Warning]:', err.message);
        });
    }
  }, [callStatus, session, duration, answeredQuestions.size]);

  // Start Real-Time Interview Action
  const handleStartInterview = async () => {
    try {
      setInitError('');
      // 1. Initialize session in backend
      const sessionData = await api.startInterviewSession(configId);
      if (!sessionData.success || !sessionData.session) {
        throw new Error(sessionData.message || 'Failed to initialize interview session.');
      }

      setSession(sessionData.session);
      setDuration(0);
      lastSyncedLengthRef.current = 0;

      // 2. Launch Vapi Call with Dynamic Context Overrides
      await startCall(sessionData.assistantOverrides);
    } catch (err) {
      console.error('[Start Interview Error]:', err);
      setInitError(err.message || 'Failed to connect to AI interviewer. Please try again.');
    }
  };

  // End Interview Action
  const handleEndInterview = async () => {
    await stopCall();
    if (session?._id) {
      try {
        await api.endInterviewSession(session._id, {
          status: 'interrupted',
          metadata: {
            callDurationSeconds: duration,
            endReason: 'user_terminated',
            questionsAnswered: answeredQuestions.size
          }
        });
      } catch (err) {
        console.warn('Failed to end session cleanly:', err.message);
      }
    }
  };

  if (loadingData) {
    return (
      <div className="container voice-loading-view">
        <Loader2 size={36} className="icon-spin text-emerald" />
        <h2>Preparing Voice Interview Room...</h2>
        <p className="text-secondary">Retrieving question bank and initializing session parameters.</p>
      </div>
    );
  }

  if (initError && !config) {
    return (
      <div className="container voice-error-view">
        <div className="card voice-error-card">
          <AlertCircle size={40} className="text-vermilion" />
          <h2>Unable to Load Interview</h2>
          <p>{initError}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx] || questions[0];

  return (
    <div className="voice-room-page container">
      {/* Top Header & Navigation */}
      <header className="voice-room-header">
        <div className="header-left">
          <Link to={`/interview/${configId}/questions`} className="back-link">
            <ArrowLeft size={16} />
            <span>Question Bank</span>
          </Link>
          <div className="room-title-group">
            <span className="room-domain-badge">{config?.domain}</span>
            <h1 className="room-title">{config?.role} Mock Interview</h1>
          </div>
        </div>

        {/* Status Pill & Timer */}
        <div className="header-right">
          <div className="session-timer-pill">
            <Clock size={14} className={callStatus === 'active' ? 'text-emerald' : 'text-muted'} />
            <span className="timer-text">{formattedTimer}</span>
          </div>

          <div className={`status-pill status-${callStatus}`}>
            <span className="status-dot"></span>
            <span className="status-label">
              {callStatus === 'idle' && 'Ready'}
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'active' && 'Live Call'}
              {callStatus === 'ended' && 'Session Concluded'}
              {callStatus === 'error' && 'Connection Issue'}
            </span>
          </div>
        </div>
      </header>

      {/* Global Error Banner */}
      {(initError || vapiError) && (
        <div className="auth-alert error-alert voice-alert">
          <AlertCircle size={18} />
          <span>{initError || vapiError}</span>
        </div>
      )}

      {/* VIEW A: Pre-Call Launchpad (Call Status == Idle) */}
      {callStatus === 'idle' && (
        <div className="card launchpad-card">
          <div className="launchpad-badge">
            <Sparkles size={16} />
            <span>AI Voice Interviewer Ready</span>
          </div>

          <h2 className="launchpad-title">Ready to start your voice interview?</h2>
          <p className="launchpad-desc">
            You are about to begin a real-time voice interview with <strong>IntervuSetu AI Interviewer</strong> for the{' '}
            <strong>{config?.role}</strong> role ({config?.experienceLevel}, {config?.difficulty} difficulty).
          </p>

          <div className="launchpad-checklist">
            <div className="check-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>10 role-tailored questions will be asked in structured order.</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>The AI interviewer speaks first and listens to your verbal responses.</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={16} className="text-emerald" />
              <span>Ensure your microphone is enabled and you are in a quiet room.</span>
            </div>
          </div>

          <div className="launchpad-actions">
            <button
              onClick={handleStartInterview}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px' }}
            >
              <Mic size={18} />
              <span>Start Real-Time Interview</span>
            </button>

            <Link to={`/interview/${configId}/questions`} className="btn btn-secondary">
              <span>Review Question Bank</span>
            </Link>
          </div>
        </div>
      )}

      {/* VIEW B: Active or Connecting Call */}
      {(callStatus === 'active' || callStatus === 'connecting') && (
        <div className="voice-stage-layout">
          {/* Left Column: Progress & Current Question */}
          <div className="stage-left-panel">
            {/* Question Stepper / Progress Bar */}
            <div className="card progress-card">
              <div className="progress-card-header">
                <span className="progress-card-title">Interview Progress</span>
                <span className="progress-fraction">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </span>
              </div>

              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`
                  }}
                ></div>
              </div>

              {/* Progress step dots */}
              <div className="progress-dots">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const isAnswered = answeredQuestions.has(idx);
                  return (
                    <div
                      key={q._id || idx}
                      className={`progress-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'completed' : ''}`}
                      title={`Question ${idx + 1}: ${q.competency}`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Question Focus Card */}
            {currentQ && (
              <div className="card active-question-card">
                <div className="active-question-header">
                  <span className="active-question-tag">Active Question</span>
                  <span className="active-competency">{currentQ.competency}</span>
                </div>

                <h3 className="active-question-prompt">{currentQ.questionText}</h3>

                {currentQ.expectedKeyConcepts && currentQ.expectedKeyConcepts.length > 0 && (
                  <div className="active-concepts-preview">
                    <span className="preview-label">Focus Areas:</span>
                    <div className="preview-pills">
                      {currentQ.expectedKeyConcepts.map((concept, idx) => (
                        <span key={idx} className="preview-pill">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Speaking Indicator & Audio Controls */}
            <div className="card voice-controls-card">
              <div className="interviewer-voice-state">
                <div className={`voice-avatar ${isSpeaking ? 'speaking-pulse' : ''}`}>
                  <Volume2 size={24} className={isSpeaking ? 'text-emerald' : 'text-muted'} />
                </div>
                <div className="voice-state-text">
                  <span className="interviewer-name">IntervuSetu AI Interviewer</span>
                  <span className="speaking-status">
                    {callStatus === 'connecting'
                      ? 'Connecting WebRTC audio stream...'
                      : isSpeaking
                      ? 'Interviewer is speaking...'
                      : 'Listening to candidate...'}
                  </span>
                </div>
              </div>

              <div className="control-buttons-row">
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isMuted ? 'Microphone Muted' : 'Mute Mic'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleEndInterview}
                  className="btn btn-secondary btn-sm end-btn"
                  title="End Mock Interview Session"
                >
                  <PhoneOff size={16} className="text-vermilion" />
                  <span>End Interview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Conversation Transcript */}
          <div className="stage-right-panel">
            <div className="card transcript-card">
              <div className="transcript-card-header">
                <h3 className="transcript-title">Real-Time Conversation</h3>
                <span className="transcript-count">{transcripts.length} exchanges</span>
              </div>

              <div className="transcript-stream" ref={transcriptScrollRef}>
                {transcripts.length === 0 && !liveUtterance.text && (
                  <div className="transcript-empty">
                    <Volume2 size={32} className="text-muted" />
                    <p>The conversation stream will appear here in real time as you and the AI speak.</p>
                  </div>
                )}

                {/* Finalized Transcripts */}
                {transcripts.map((entry, idx) => {
                  const isInterviewer = entry.speaker === 'interviewer';
                  return (
                    <div
                      key={entry.messageId || idx}
                      className={`transcript-message ${isInterviewer ? 'msg-interviewer' : 'msg-candidate'}`}
                    >
                      <div className="message-meta">
                        <span className="speaker-name">{isInterviewer ? 'Interviewer' : user?.name || 'You'}</span>
                        <span className="message-time">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="message-body">{entry.text}</p>
                    </div>
                  );
                })}

                {/* Live In-Progress Utterance */}
                {liveUtterance.text && (
                  <div
                    className={`transcript-message live-utterance ${
                      liveUtterance.speaker === 'interviewer' ? 'msg-interviewer' : 'msg-candidate'
                    }`}
                  >
                    <div className="message-meta">
                      <span className="speaker-name">
                        {liveUtterance.speaker === 'interviewer' ? 'Interviewer' : user?.name || 'You'}
                        <span className="speaking-tag"> (speaking...)</span>
                      </span>
                    </div>
                    <p className="message-body">{liveUtterance.text}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: Call Ended Summary View */}
      {callStatus === 'ended' && (
        <div className="card session-ended-card">
          <div className="ended-icon-wrap">
            <Award size={36} className="text-emerald" />
          </div>

          <h2 className="ended-title">Mock Interview Concluded</h2>
          <p className="ended-desc">
            Great job! You completed your live mock interview session for the <strong>{config?.role}</strong> role.
          </p>

          <div className="ended-stats-grid">
            <div className="ended-stat">
              <span className="stat-label">Total Duration</span>
              <span className="stat-value">{formattedTimer}</span>
            </div>
            <div className="ended-stat">
              <span className="stat-label">Questions Handled</span>
              <span className="stat-value">
                {currentQuestionIdx + 1} / {questions.length}
              </span>
            </div>
            <div className="ended-stat">
              <span className="stat-label">Transcript Exchanges</span>
              <span className="stat-value">{transcripts.length}</span>
            </div>
          </div>

          <div className="ended-actions">
            <Link to="/dashboard" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Link>

            <button onClick={handleStartInterview} className="btn btn-secondary">
              <RefreshCw size={16} />
              <span>Start New Attempt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
