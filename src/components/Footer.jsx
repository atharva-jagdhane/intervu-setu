import React from 'react';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="brand-title">IntervuSetu</span>
            <span className="brand-dot">•</span>
            <span className="brand-badge">B.Tech Technical Mentorship</span>
          </div>
          <p className="footer-tagline">
            Bridging the gap between academic preparation and industry technical interviews through real-time voice AI and structured rubrics.
          </p>
        </div>

        <div className="footer-meta">
          <div className="meta-item">
            <Layers size={15} />
            <span>Architecture: React 19 + Express + Gemini + Vapi</span>
          </div>
          <div className="meta-item">
            <Cpu size={15} />
            <span>Phase 0: Environment Initialized</span>
          </div>
          <div className="meta-item">
            <ShieldCheck size={15} />
            <span>Zero-Trust Credential Security</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} IntervuSetu. Designed for engineering students & fresh graduates.</p>
        <p className="footer-subtext">Built with modern React, Vite, and Node.js.</p>
      </div>
    </footer>
  );
}
