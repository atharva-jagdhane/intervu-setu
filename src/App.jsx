import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RootLayout from './layouts/RootLayout';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InterviewConfigPage from './pages/InterviewConfigPage';
import QuestionListPage from './pages/QuestionListPage';
import VoiceInterviewPage from './pages/VoiceInterviewPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * Defines public routes (Landing, Register, Login) and protected student routes
 * (Dashboard, Interview Configuration, AI Question Bank, Real-Time Voice Interview).
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

            {/* Protected AI Question Bank (Phase 3) */}
            <Route
              path="interview/:configId/questions"
              element={
                <ProtectedRoute>
                  <QuestionListPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Real-Time Voice Mock Interview (Phase 4) */}
            <Route
              path="interview/:configId/live"
              element={
                <ProtectedRoute>
                  <VoiceInterviewPage />
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
