import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  ArrowRight,
  FileCode,
  Bug,
  GraduationCap,
  Download,
  BookOpen,
  LineChart,
  Target,
  TrendingUp,
  Timer,
  Zap,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { AssignmentResultData, DashboardAnalytics } from '../types/index.ts';
import { generateAssignmentPDF } from '../lib/pdf.ts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<AssignmentResultData[]>([]);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, asgData] = await Promise.all([
          apiRequest<DashboardAnalytics>('/api/progress'),
          apiRequest<AssignmentResultData[]>('/api/assignments'),
        ]);
        setAnalytics(statsData);
        setRecentAssignments(asgData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const topicDetails = [
    {
      topic: 'Operators',
      accuracy: 91,
      attempts: 42,
      correct: 38,
      recent: 'Strong & Consistent',
      recommendation: 'Ready for nested ternary & bitwise drills',
      color: '#22C55E',
      barClass: 'from-emerald-500 to-teal-400',
    },
    {
      topic: 'Loops',
      accuracy: 82,
      attempts: 36,
      correct: 30,
      recent: 'High Proficiency',
      recommendation: 'Try complex nested loop pattern drills',
      color: '#4F8CFF',
      barClass: 'from-blue-500 to-cyan-400',
    },
    {
      topic: 'Functions',
      accuracy: 67,
      attempts: 28,
      correct: 19,
      recent: 'Moderate Understanding',
      recommendation: 'Review call-by-reference vs call-by-value',
      color: '#8B5CF6',
      barClass: 'from-purple-500 to-indigo-400',
    },
    {
      topic: 'Arrays',
      accuracy: 54,
      attempts: 24,
      correct: 13,
      recent: 'Needs Improvement',
      recommendation: 'Practice 2D array traversal & boundary checking',
      color: '#F59E0B',
      barClass: 'from-amber-500 to-orange-400',
    },
    {
      topic: 'Pointers',
      accuracy: 31,
      attempts: 16,
      correct: 5,
      recent: 'High Error Rate',
      recommendation: 'Urgent: Review memory address operators & dereferencing',
      color: '#EF4444',
      barClass: 'from-rose-500 to-red-400',
    },
  ];

  const overallMastery = analytics?.accuracy || 76;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. AI Command Center Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0B1026] via-[#11182D] to-[#151D36] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#4F8CFF]/15 to-[#8B5CF6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#A78BFA]">
              <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
              <span>AI Command Center • Term 2026</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Arka'} 👋
            </h1>

            <p className="text-sm font-medium text-[#94A3B8]">
              "Continue your coding journey."
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Target className="h-3.5 w-3.5 text-[#4F8CFF]" />
                Target: {user?.course || 'B.Pharm'} Sem {user?.semester || 1} Practical Exam
              </span>
              <span className="text-white/20">•</span>
              <span>Institution: {user?.college || 'Institute of Technology'}</span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 shadow-md backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="h-6 w-6 fill-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Current Streak
                </p>
                <p className="text-lg font-black text-white">
                  {profile?.currentStreak ?? profile?.current_streak ?? 5} Consecutive Days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#4F8CFF]/25 bg-[#4F8CFF]/10 px-4 py-3 shadow-md backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F8CFF]/20 text-[#4F8CFF]">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">
                  Academic Rank &amp; XP
                </p>
                <p className="text-lg font-black text-white">
                  Level {profile?.level || 1} • {profile?.xp || 280} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Premium AI Learning Recommendation Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-r from-[#11182D] via-[#151D36] to-[#11182D] p-6 shadow-xl backdrop-blur-2xl">
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#8B5CF6]/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B5CF6]/20 text-[#A78BFA]">
                <Sparkles className="h-4 w-4 text-[#22D3EE]" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                ✨ AI Learning Recommendation
              </h2>
            </div>

            <p className="text-base font-semibold text-white">
              "You are strong in Loops and Operators, but Arrays need more practice."
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
              <div>
                <span className="text-[#94A3B8]">Weak Topic: </span>
                <span className="font-bold text-amber-400">Arrays</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#94A3B8]">Current Accuracy: </span>
                <span className="font-bold text-rose-400">54%</span>
              </div>
              <div>
                <span className="text-[#94A3B8]">Recommended Difficulty: </span>
                <span className="font-bold text-[#22D3EE]">Medium</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/practice?topic=Arrays&difficulty=Medium')}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            <span>Start Personalized Practice</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Premium Animated Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Questions Solved */}
        <div className="glass-card group rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Questions Solved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {analytics?.questionsSolved || 24}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>↑ 8 solved this week</span>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="glass-card group rounded-2xl p-5 border border-[#4F8CFF]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Accuracy</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-[#4F8CFF]">
              <LineChart className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            87%
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#4F8CFF]">
            <TrendingUp className="h-3 w-3" />
            <span>↑ 6.4% this week</span>
          </div>
        </div>

        {/* Card 3: Doubts Cleared */}
        <div className="glass-card group rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Doubts Cleared</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-[#A78BFA]">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {analytics?.doubtsCleared || 12}
          </p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">
            AI concepts clarified
          </p>
        </div>

        {/* Card 4: Practice Completed */}
        <div className="glass-card group rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Practice Drills</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-[#22D3EE]">
              <BrainCircuit className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {analytics?.practiceCompleted || 18}
          </p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">
            Adaptive test runs
          </p>
        </div>

        {/* Card 5: Current Streak */}
        <div className="glass-card group rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Current Streak</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Flame className="h-4 w-4 fill-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            5 Days
          </p>
          <p className="mt-2 text-[11px] text-amber-400 font-semibold">
            Consistency badge active
          </p>
        </div>
      </div>

      {/* 4. Circular Progress & Topic Performance Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: 3D Animated Progress Ring (Coding Mastery) */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-4 flex flex-col items-center justify-between text-center">
          <div className="w-full text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Coding Mastery
              </h3>
              <span className="rounded-md bg-[#4F8CFF]/20 px-2 py-0.5 text-[10px] font-bold text-[#4F8CFF]">
                Term Progress
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Weighted overall syllabus proficiency
            </p>
          </div>

          {/* SVG Animated Circular Ring */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#masteryGradient)"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - 0.72)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="masteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F8CFF" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Stats */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">72%</span>
              <span className="text-[11px] font-semibold text-[#A78BFA]">Proficient</span>
            </div>
          </div>

          <div className="w-full space-y-2 border-t border-white/10 pt-4 text-xs text-left">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Beginner Foundation</span>
              <span className="font-bold text-emerald-400">100% Completed</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Intermediate Concepts</span>
              <span className="font-bold text-[#4F8CFF]">68% In Progress</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Advanced Viva Readiness</span>
              <span className="font-bold text-amber-400">45% Target</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Topic Performance Cards */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Topic Performance Spectrum
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Hover over any concept to inspect attempts, accuracy, and AI recommendations
              </p>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs font-semibold text-[#4F8CFF] hover:underline"
            >
              Full Analytics →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topicDetails.map((item) => (
              <div
                key={item.topic}
                onMouseEnter={() => setHoveredTopic(item.topic)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                  hoveredTopic === item.topic
                    ? 'border-[#4F8CFF] bg-[#151D36] shadow-lg shadow-blue-500/10 scale-[1.02]'
                    : 'border-white/10 bg-[#0B1026]/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.topic}</span>
                  <span
                    className="font-mono text-base font-extrabold"
                    style={{ color: item.color }}
                  >
                    {item.accuracy}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.barClass}`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>

                {/* Hover / Expanded Metadata */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>{item.attempts} Attempts ({item.correct} Correct)</span>
                  <span className="font-medium text-white/80">{item.recent}</span>
                </div>

                {hoveredTopic === item.topic && (
                  <div className="mt-2.5 rounded-xl bg-[#050816] p-2 text-[10px] text-[#22D3EE] border border-[#22D3EE]/20 animate-fadeIn">
                    💡 {item.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Quick Action Launchpad */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-4">
          Quick Action Launchpad
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <button
            onClick={() => navigate('/assignment')}
            className="glass-card group flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-[#4F8CFF] group-hover:bg-[#4F8CFF] group-hover:text-white transition-all shadow-md">
              <FileCode className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-white">Solve Assignment</p>
            <p className="text-[10px] text-[#94A3B8]">Algorithm &amp; dry run</p>
          </button>

          <button
            onClick={() => navigate('/doubt-solver')}
            className="glass-card group flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all shadow-md">
              <HelpCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-white">Doubt Solver</p>
            <p className="text-[10px] text-[#94A3B8]">English &amp; Bengali</p>
          </button>

          <button
            onClick={() => navigate('/debugger')}
            className="glass-card group flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
              <Bug className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-white">Code Debugger</p>
            <p className="text-[10px] text-[#94A3B8]">Syntax &amp; edge cases</p>
          </button>

          <button
            onClick={() => navigate('/practice')}
            className="glass-card group flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-black transition-all shadow-md">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-white">Adaptive Practice</p>
            <p className="text-[10px] text-[#94A3B8]">Curriculum aligned</p>
          </button>

          <button
            onClick={() => navigate('/viva')}
            className="glass-card group flex flex-col items-center justify-center rounded-2xl p-5 text-center transition-all hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-white">Oral Viva Drill</p>
            <p className="text-[10px] text-[#94A3B8]">Examiner simulation</p>
          </button>
        </div>
      </div>

      {/* 6. Recent Lab Assignments with 1-Click PDF Export */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Lab Solutions &amp; Assignments
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Download academic lab manual PDFs or re-examine code and dry-run execution
            </p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-[#4F8CFF] hover:underline"
          >
            View History →
          </button>
        </div>

        {recentAssignments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-[#94A3B8]">No assignments generated yet.</p>
            <button
              onClick={() => navigate('/assignment')}
              className="mt-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white"
            >
              Create Your First Assignment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentAssignments.map((asg) => (
              <div
                key={asg.id}
                className="flex flex-wrap items-center justify-between gap-4 py-3.5 transition-colors hover:bg-white/[0.02] px-2 rounded-xl"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#4F8CFF]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#4F8CFF]">
                      {asg.language}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate max-w-md">
                      {asg.title || asg.question}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                    {asg.question}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/assignment/${asg.id}`)}
                    className="rounded-xl border border-white/10 bg-[#151D36] px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] hover:border-[#4F8CFF]/40"
                  >
                    View Solution
                  </button>

                  <button
                    onClick={() => generateAssignmentPDF(asg, user)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                    title="Export Lab Manual PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Lab PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
