import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Code2,
  GraduationCap,
  Target,
  School,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { Logo } from '../components/common/Logo.tsx';
import { Background3D } from '../components/common/Background3D.tsx';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(user?.course || 'B.Pharm');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [language, setLanguage] = useState(user?.preferredLanguage || 'c');
  const [level, setLevel] = useState(user?.programmingLevel || 'Beginner');
  const [subject, setSubject] = useState('Remedial Mathematical & Computer Applications in Pharmacy');
  const [goal, setGoal] = useState('Score high in lab practicals and viva, master coding fundamentals');
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 6;

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          course,
          semester,
          preferredLanguage: language,
          programmingLevel: level,
          learningGoal: goal,
        }),
      });

      updateUser({
        course,
        semester,
        preferredLanguage: language,
        programmingLevel: level,
      });

      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
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
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Calibrate Your Learning Profile
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Configure your curriculum targets so AI can synthesize tailored explanations and assignments.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span>
              Phase {step} of {totalSteps}
            </span>
            <span className="text-[#4F8CFF] font-bold">{Math.round((step / totalSteps) * 100)}% Configured</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4F8CFF]/20 text-[#4F8CFF]">
                <School className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">What is your course of study?</h3>
              <p className="text-xs text-[#94A3B8]">Select your current academic program</p>

              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                {['B.Pharm', 'BCA', 'B.Tech CS', 'MCA', 'B.Sc CS', 'Diploma'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCourse(c)}
                    className={`rounded-2xl border p-4 text-center text-xs font-bold transition-all ${
                      course === c
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/20 text-white shadow-lg shadow-blue-500/20'
                        : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white hover:border-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8B5CF6]/20 text-[#A78BFA]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Which semester are you in?</h3>
              <p className="text-xs text-[#94A3B8]">CodeMate AI automatically syncs this semester&apos;s curriculum</p>

              <div className="grid grid-cols-4 gap-2.5 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSemester(s)}
                    className={`rounded-2xl border p-3.5 text-center text-xs font-bold transition-all ${
                      semester === s
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/20 text-white shadow-lg'
                        : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Sem {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Choose your primary language</h3>
              <p className="text-xs text-[#94A3B8]">The language primarily evaluated in your lab practicals</p>

              <div className="space-y-2.5 pt-2">
                {[
                  { id: 'c', label: 'C Programming', desc: 'Core language for university syllabi and system fundamentals' },
                  { id: 'cpp', label: 'C++ (with OOP)', desc: 'Object-oriented structures, memory control, and STL' },
                  { id: 'java', label: 'Java', desc: 'Enterprise patterns, object-oriented concepts, and JVM' },
                  { id: 'python', label: 'Python 3', desc: 'Algorithms, data parsing, and scientific computations' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLanguage(l.id as any)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs transition-all ${
                      language === l.id
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/20 text-white shadow-md'
                        : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-white">{l.label}</p>
                      <p className="mt-0.5 text-[11px] text-[#94A3B8]">{l.desc}</p>
                    </div>
                    {language === l.id && <Check className="h-4 w-4 text-[#4F8CFF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Current coding comfort level</h3>
              <p className="text-xs text-[#94A3B8]">AI adapts explanation depth to this baseline</p>

              <div className="space-y-2.5 pt-2">
                {[
                  { id: 'Beginner', title: 'Beginner', desc: 'Starting out, need analogies and step-by-step intuition' },
                  { id: 'Intermediate', title: 'Intermediate', desc: 'Know syntax; need help with pointers & algorithms' },
                  { id: 'Advanced', title: 'Advanced', desc: 'Focus on time complexity, edge cases, and exam-grade viva' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id as any)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs transition-all ${
                      level === lvl.id
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/20 text-white shadow-md'
                        : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-white">{lvl.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#94A3B8]">{lvl.desc}</p>
                    </div>
                    {level === lvl.id && <Check className="h-4 w-4 text-[#4F8CFF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#22D3EE]/20 text-[#22D3EE]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Subject Title</h3>
              <p className="text-xs text-[#94A3B8]">The title of your course syllabus module</p>

              <div className="pt-2">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">What is your primary goal this semester?</h3>
              <p className="text-xs text-[#94A3B8]">CodeMate AI will tailor daily recommendations toward this</p>

              <div className="space-y-2.5 pt-2">
                {[
                  'Score 90%+ in Lab Practical Exams & Viva',
                  'Finish all College Assignments on time with complete understanding',
                  'Clear doubts in Bengali & English with simple analogies',
                  'Build strong fundamentals from scratch',
                ].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs transition-all ${
                      goal === g
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/20 text-white shadow-md'
                        : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-white">{g}</span>
                    {goal === g && <Check className="h-4 w-4 text-[#4F8CFF]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 rounded-2xl border border-white/10 px-4 py-2.5 text-xs font-bold text-[#94A3B8] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/25 hover:scale-105 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-7 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 hover:scale-105 transition-all disabled:opacity-50"
              >
                <span>{submitting ? 'Calibrating...' : 'Launch Dashboard'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
