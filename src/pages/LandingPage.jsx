import React from 'react';
import {
  Mic,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const coreModules = [
    {
      icon: <BrainCircuit className="module-icon text-indigo" />,
      title: "1. AI Question Synthesis",
      tech: "Google Gemini API",
      description: "Generates context-aware, domain-specific technical and behavioral questions tailored to candidate target roles and experience levels."
    },
    {
      icon: <Mic className="module-icon text-violet" />,
      title: "2. Voice-Based Interview Room",
      tech: "Vapi Web SDK",
      description: "Ultra-low latency speech-to-speech voice agent simulating live interviewers with turn-taking, active listening, and transcript streaming."
    },
    {
      icon: <Award className="module-icon text-blue" />,
      title: "3. Multi-Metric Rubric Scoring",
      tech: "Gemini Structured JSON",
      description: "Scores candidate responses across technical depth, communication clarity, problem-solving structure, and key industry competencies."
    },
    {
      icon: <BarChart3 className="module-icon text-emerald" />,
      title: "4. Actionable Performance Reports",
      tech: "Analytics Engine",
      description: "Detailed diagnostic feedback identifying specific knowledge gaps, candidate strengths, and personalized study roadmaps."
    },
    {
      icon: <ShieldCheck className="module-icon text-cyan" />,
      title: "5. Student Auth & Session History",
      tech: "JWT + MongoDB",
      description: "Secure, stateless authentication protecting student profiles, past session replays, and long-term score trajectories."
    },
    {
      icon: <Layers className="module-icon text-purple" />,
      title: "6. Role-Based Catalog",
      tech: "Modular Taxonomy",
      description: "Targeted interview tracks for Software Engineers, Data Scientists, Machine Learning Engineers, and Frontend/Backend specialists."
    }
  ];

  const techStack = [
    { name: "React 19", role: "UI Component Library" },
    { name: "Vite 6", role: "Next-Gen Bundler & Dev Server" },
    { name: "React Router DOM", role: "Client-Side Routing" },
    { name: "Lucide React", role: "Accessible Icon System" },
    { name: "Vanilla CSS Tokens", role: "Design System & Theme" },
    { name: "Node.js & Express", role: "Backend REST API (Phase 1)" },
    { name: "MongoDB & Mongoose", role: "Database (Phase 1)" },
    { name: "Google Gemini API", role: "LLM Intelligence (Phase 3 & 5)" },
    { name: "Vapi Web SDK", role: "Real-Time Voice AI (Phase 4)" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" id="overview">
        <div className="container hero-container">
          <div className="badge hero-badge">
            <span className="badge-dot"></span>
            <span>AI-Powered Technical & Behavioral Assessment</span>
          </div>

          <h1 className="hero-title">
            Bridge the Gap to Your Tech Career with <span className="gradient-text">IntervuSetu</span>
          </h1>

          <p className="hero-tagline">
            An intelligent, voice-first interview preparation and assessment platform engineered for students and fresh graduates. Master real-time technical questions, build interview confidence, and receive diagnostic, rubric-based feedback.
          </p>

          <div className="hero-actions">
            <a href="#features" className="btn btn-primary">
              <span>Explore Platform Modules</span>
              <ArrowRight size={18} />
            </a>
            <a href="#tech-stack" className="btn btn-secondary">
              <Terminal size={18} />
              <span>Inspect Architecture</span>
            </a>
          </div>

          {/* Phase 0 Status Callout */}
          <div className="phase-callout">
            <div className="phase-callout-header">
              <span className="phase-pill">Phase 0 Complete</span>
              <span className="phase-text">Vite + React Baseline Environment Initialized & Verified</span>
            </div>
            <p className="phase-desc">
              All foundational dependencies installed, router configured, zero-leak gitignore active, and clean SaaS design tokens established.
            </p>
          </div>
        </div>
      </section>

      {/* Core Planned Modules Section */}
      <section className="modules-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Platform Roadmap</span>
            <h2 className="section-title">Engineered for Realistic Interview Simulation</h2>
            <p className="section-subtitle">
              Each module is built incrementally across planned phases to ensure production stability and zero simulated integrations.
            </p>
          </div>

          <div className="modules-grid">
            {coreModules.map((item, index) => (
              <div key={index} className="card module-card">
                <div className="module-header">
                  <div className="module-icon-wrapper">
                    {item.icon}
                  </div>
                  <span className="module-tech-badge">{item.tech}</span>
                </div>
                <h3 className="module-title">{item.title}</h3>
                <p className="module-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="tech-section" id="tech-stack">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Engineering Specifications</span>
            <h2 className="section-title">Modern Full-Stack Technology Stack</h2>
            <p className="section-subtitle">
              Strict separation of concerns: React frontend handles state and streaming voice WebRTC, while the Node.js backend protects Gemini keys and orchestrates database transactions.
            </p>
          </div>

          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-pill-card">
                <div className="tech-indicator"></div>
                <div className="tech-details">
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-role">{tech.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Security Principles */}
      <section className="architecture-section" id="status">
        <div className="container">
          <div className="card architecture-card">
            <div className="architecture-content">
              <div className="badge">
                <Code2 size={14} />
                <span>Zero-Trust API Security</span>
              </div>
              <h2 className="arch-title">Full-Stack Mentorship Architecture</h2>
              <p className="arch-text">
                As part of our B.Tech Data Science learning journey, IntervuSetu follows enterprise-grade software engineering patterns:
              </p>
              <ul className="arch-list">
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Zero Frontend Secret Exposure</strong>: Gemini API keys and Vapi private tokens reside strictly on the server behind environment variables.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Component Reusability</strong>: Modular, pure presentation components decoupled from business logic and data fetching.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span><strong>Phase-by-Phase Verification</strong>: Every layer is compiled, linted, tested, and approved before progression.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
