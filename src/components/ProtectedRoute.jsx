import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Wrapper
 * Ensures only authenticated students can access private routes.
 * Preserves the intended destination so user is redirected back after logging in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={36} className="icon-pulse" style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Verifying student session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
