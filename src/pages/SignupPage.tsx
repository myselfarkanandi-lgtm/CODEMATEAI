import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, User, School, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Logo } from '../components/common/Logo.tsx';
import { Background3D } from '../components/common/Background3D.tsx';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: 'BCA',
    semester: 1,
    college: 'Adamas University',
    programmingLevel: 'Beginner',
    preferredLanguage: 'c',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await signup(formData);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#050816] overflow-hidden py-12">
      <Background3D />

      <div className="relative z-10 w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Create Your Student SaaS Account
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Calibrate CodeMate AI to your academic program, syllabus topics, and exam goals.
          </p>
        </div>

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Arka Nandi"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  University Email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Degree Program
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="BCA">BCA</option>
                  <option value="B.Pharm">B.Pharm</option>
                  <option value="B.Tech CS/IT">B.Tech CS/IT</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc CS">B.Sc CS</option>
                  <option value="Diploma Engineering">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs font-bold text-white focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Target Language
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="c">C Language</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  University / College
                </label>
                <div className="relative mt-1.5">
                  <School className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    name="college"
                    placeholder="Adamas University"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-3 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Current Level
                </label>
                <select
                  name="programmingLevel"
                  value={formData.programmingLevel}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="Beginner">Beginner (Starting fresh)</option>
                  <option value="Intermediate">Intermediate (Know syntax &amp; loops)</option>
                  <option value="Advanced">Advanced (Proficient with pointers &amp; DS)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
            >
              <span>{submitting ? 'Creating Student Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#94A3B8]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#4F8CFF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
