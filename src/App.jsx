import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './layouts/RootLayout';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InterviewConfigPage from './pages/InterviewConfigPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * Wraps routes in AuthProvider for global authentication state.
 * Defines public routes (Landing, Register, Login) and protected student routes (Dashboard, Interview Config).
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Public Pages */}
            <Route index element={<LandingPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />

            {/* Protected Student Portal */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Interview Configuration Studio (Phase 2) */}
            <Route
              path="interview/configure"
              element={
                <ProtectedRoute>
                  <InterviewConfigPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 redirect */}
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
