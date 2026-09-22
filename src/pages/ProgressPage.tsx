import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  BrainCircuit,
  Target,
  BarChart2,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { DashboardAnalytics } from '../types/index.ts';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<DashboardAnalytics>('/api/progress')
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const topicData = analytics?.topicPerformance || [
    { topic: 'Operators & Expressions', accuracy: 91, status: 'Strong', solved: 14 },
    { topic: 'Loops & Iteration', accuracy: 84, status: 'Strong', solved: 18 },
    { topic: 'Functions & Recursion', accuracy: 68, status: 'Average', solved: 9 },
    { topic: 'Arrays & Strings', accuracy: 56, status: 'Needs Review', solved: 7 },
    { topic: 'Pointers & Dynamic Memory', accuracy: 34, status: 'Critical Revision', solved: 4 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            <LineChart className="h-3.5 w-3.5" />
            <span>Academic Performance &amp; Diagnostic Analytics</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Syllabus Mastery Spectrum
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Continuous assessment metrics evaluating conceptual depth, debugging agility, and lab viva preparedness.
          </p>
        </div>

        <button
          onClick={() => navigate('/practice?topic=Pointers')}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-rose-500/20 hover:scale-105 transition-all"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Remediate Weakest Topic</span>
        </button>
      </div>

      {/* High-Level SaaS Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-3xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Total Solved</span>
          <p className="mt-2 text-3xl font-black text-white">
            {analytics?.questionsSolved || 48}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> +6 this week
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Overall Accuracy</span>
          <p className="mt-2 text-3xl font-black text-[#4F8CFF]">
            {analytics?.accuracy || 81}%
          </p>
          <p className="mt-1 text-xs font-medium text-[#22D3EE]">
            University Pass Bar: 40%
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Active Streak</span>
          <p className="mt-2 text-3xl font-black text-amber-400 flex items-center gap-1.5">
            <Flame className="h-6 w-6 fill-amber-400" />
            {analytics?.currentStreak || 7} Days
          </p>
          <p className="mt-1 text-xs font-medium text-amber-400">
            Top 10% Consistency
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">Concepts Clarified</span>
          <p className="mt-2 text-3xl font-black text-[#A78BFA]">
            {analytics?.doubtsCleared || 12}
          </p>
          <p className="mt-1 text-xs font-medium text-[#A78BFA]">
            Mental models mapped
          </p>
        </div>
      </div>

      {/* Weak Topics Diagnostic Breakdown Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-[#22D3EE]" />
              Curriculum Unit Mastery Matrix
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Targeted drills calibrated to your university exam syllabus
            </p>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">
            Updated in real-time
          </span>
        </div>

        <div className="space-y-4">
          {topicData.map((t, idx) => {
            const isWeak = t.accuracy < 60;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 transition-all hover:border-white/20"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.topic}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.accuracy >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : t.accuracy >= 60
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {t.status} ({t.accuracy}%)
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        t.accuracy >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : t.accuracy >= 60
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-[#94A3B8]">
                    {t.solved || 10} drill sets
                  </span>
                  <button
                    onClick={() => navigate(`/practice?topic=${encodeURIComponent(t.topic.split(' ')[0])}`)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                  >
                    <span>Drill Unit</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
