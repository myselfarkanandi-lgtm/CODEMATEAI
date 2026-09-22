import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { AppLayout } from './components/common/AppLayout.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AssignmentAssistantPage } from './pages/AssignmentAssistantPage.tsx';
import { AssignmentDetailPage } from './pages/AssignmentDetailPage.tsx';
import { DoubtSolverPage } from './pages/DoubtSolverPage.tsx';
import { DebuggerPage } from './pages/DebuggerPage.tsx';
import { PracticePage } from './pages/PracticePage.tsx';
import { QuizPage } from './pages/QuizPage.tsx';
import { VivaPage } from './pages/VivaPage.tsx';
import { SyllabusPage } from './pages/SyllabusPage.tsx';
import { ProgressPage } from './pages/ProgressPage.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { DownloadsPage } from './pages/DownloadsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading CodeMate AI...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected Student Layout Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignment"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AssignmentAssistantPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignment/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AssignmentDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doubt-solver"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DoubtSolverPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/debugger"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DebuggerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PracticePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <QuizPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/viva"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <VivaPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/syllabus"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SyllabusPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProgressPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HistoryPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FavoritesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/downloads"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DownloadsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
