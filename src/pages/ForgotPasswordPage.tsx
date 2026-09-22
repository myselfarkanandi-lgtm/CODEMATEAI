import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../lib/api.ts';
import { Logo } from '../components/common/Logo.tsx';
import { Background3D } from '../components/common/Background3D.tsx';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await apiRequest<{ message: string; demoToken?: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccess(res.message);
      if (res.demoToken) {
        setResetToken(res.demoToken);
      }
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, resetToken, newPassword, confirmPassword }),
      });
      setSuccess(res.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#050816] overflow-hidden">
      <Background3D />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Reset Account Password
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {step === 'request'
              ? 'Enter your student email to receive an instant recovery token'
              : 'Enter recovery token and configure your new secure credentials'}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Registered Email
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

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                <span>{submitting ? 'Sending Request...' : 'Send Recovery Token'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Verification Token
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    placeholder="TOKEN-XXXX"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white font-mono focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                <span>{submitting ? 'Updating...' : 'Update Password & Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs font-bold text-[#4F8CFF] hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
