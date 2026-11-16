import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-info">
          <span className="footer-brand">IntervuSetu</span>
          <span className="footer-sep">•</span>
          <span className="footer-tag">AI-Powered Interview Assessment for Students & Fresh Graduates</span>
        </div>

        <div className="footer-meta">
          <span>© {new Date().getFullYear()} IntervuSetu</span>
        </div>
      </div>
    </footer>
  );
}
