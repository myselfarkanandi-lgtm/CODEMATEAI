import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Logo } from '../components/common/Logo.tsx';
import { Background3D } from '../components/common/Background3D.tsx';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#050816] overflow-hidden">
      <Background3D />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome Back to CodeMate AI
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Sign in to access your AI personalized assignments, syllabus progress, and viva drills.
          </p>
        </div>

        {/* Demo Login Callout */}
        <div className="rounded-3xl border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 p-5 text-center space-y-2 backdrop-blur-md">
          <p className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
            Evaluating for College Seminar / Presentation?
          </p>
          <p className="text-[11px] text-[#94A3B8]">
            Sign in instantly with 1-click as Arka Nandi (Pre-loaded with assignments, lab progress, and syllabus metrics).
          </p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            <span>Sign In as Demo Student</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#050816] px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            or credentials
          </span>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Student University Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#4F8CFF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#94A3B8]">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup" className="font-bold text-[#4F8CFF] hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
};
