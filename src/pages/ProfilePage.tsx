import React, { useState } from 'react';
import {
  User,
  School,
  BookOpen,
  Code2,
  Flame,
  Award,
  CheckCircle2,
  Save,
  Sparkles,
  TrendingUp,
  Calendar,
  Layers,
  Zap,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Arijit Mondal');
  const [course, setCourse] = useState(user?.course || 'B.Tech Computer Science');
  const [semester, setSemester] = useState(user?.semester || 4);
  const [college, setCollege] = useState(user?.college || 'Institute of Engineering & Technology');
  const [programmingLevel, setProgrammingLevel] = useState(user?.programmingLevel || 'Intermediate');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'c');
  const [bio, setBio] = useState(profile?.bio || 'CS undergrad preparing for university lab practicals, algorithmic problem solving and technical vivas.');

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');

    try {
      await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          course,
          semester,
          college,
          programmingLevel,
          preferredLanguage,
          bio,
        }),
      });

      updateUser({
        name,
        course,
        semester,
        college,
        programmingLevel,
        preferredLanguage,
      });

      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 16-week simulated GitHub-style heatmap data
  const weeks = Array.from({ length: 16 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const val = (w * 3 + d * 5 + 2) % 6;
      return val > 3 ? val : val === 2 ? 1 : 0;
    })
  );

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-white/5';
      case 1:
        return 'bg-[#4F8CFF]/30';
      case 2:
        return 'bg-[#4F8CFF]/60';
      case 3:
        return 'bg-[#4F8CFF]';
      case 4:
      case 5:
        return 'bg-[#22D3EE] shadow-sm shadow-cyan-500/50';
      default:
        return 'bg-white/5';
    }
  };

  const skillMetrics = [
    { skill: 'Syntax Mastery', score: 92, color: 'from-[#4F8CFF] to-[#22D3EE]' },
    { skill: 'Algorithmic Logic', score: 84, color: 'from-[#8B5CF6] to-[#A78BFA]' },
    { skill: 'Debugging & Static Trace', score: 78, color: 'from-rose-500 to-amber-500' },
    { skill: 'Time Management', score: 86, color: 'from-emerald-500 to-teal-400' },
    { skill: 'Oral Exam & Viva Defense', score: 81, color: 'from-amber-500 to-orange-400' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            <User className="h-3.5 w-3.5" />
            <span>Developer Profile &amp; Performance Analytics</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Student SaaS Profile
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Academic records, curriculum milestones, learning streaks, and 5-dimension skill radar.
          </p>
        </div>
      </div>

      {/* Profile Overview Card with Avatar & Academic Details */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#4F8CFF] via-[#8B5CF6] to-[#22D3EE] text-3xl font-extrabold text-white shadow-xl shadow-blue-500/25">
              {name.charAt(0) || 'U'}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0B1026] bg-[#22C55E] text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{name}</h2>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs font-bold text-purple-300">
                Level {profile?.level || 4} Scholar
              </span>
              <span className="rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-0.5 text-xs font-bold text-[#4F8CFF]">
                Rank #14 Global
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-[#22D3EE]" />
                {college}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#8B5CF6]" />
                {course} (Sem {semester})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-[#4F8CFF]" />
                Primary: <strong className="text-white uppercase">{preferredLanguage}</strong>
              </span>
            </div>

            <p className="mt-2 text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </div>

      {/* SaaS Performance Metrics 6-Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Solved</span>
          <p className="mt-1 text-xl font-black text-white">48</p>
          <span className="text-[10px] text-emerald-400 font-medium">Problems</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Assignments</span>
          <p className="mt-1 text-xl font-black text-[#4F8CFF]">12</p>
          <span className="text-[10px] text-[#94A3B8] font-medium">Lab Notebooks</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Quizzes</span>
          <p className="mt-1 text-xl font-black text-[#8B5CF6]">9</p>
          <span className="text-[10px] text-[#94A3B8] font-medium">Completed</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Accuracy</span>
          <p className="mt-1 text-xl font-black text-[#22D3EE]">84.6%</p>
          <span className="text-[10px] text-[#22D3EE] font-medium">Top 5%</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Streak</span>
          <p className="mt-1 text-xl font-black text-amber-400 flex items-center justify-center gap-1">
            <Flame className="h-4 w-4 fill-amber-400" />
            {profile?.currentStreak || 7}
          </p>
          <span className="text-[10px] text-amber-400 font-medium">Days Active</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Total XP</span>
          <p className="mt-1 text-xl font-black text-[#A78BFA]">{profile?.total_points || 1420}</p>
          <span className="text-[10px] text-[#A78BFA] font-medium">Level 4</span>
        </div>
      </div>

      {/* Skill Radar / Competency Spectrum & GitHub Heatmap Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Skill Radar & Mastery Spectrum */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#4F8CFF]" />
              5-Dimension Engineering Competency
            </h3>
            <span className="text-[10px] font-bold text-[#22D3EE]">AI Evaluated</span>
          </div>

          <div className="space-y-4">
            {skillMetrics.map((sm, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{sm.skill}</span>
                  <span className="font-bold text-[#94A3B8]">{sm.score}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sm.color} transition-all duration-1000`}
                    style={{ width: `${sm.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 text-[11px] text-[#94A3B8]">
            💡 Diagnostic feedback: Syntax and Time Management are in the 90th percentile. Focus more on pointer memory management and recursion edge cases.
          </div>
        </div>

        {/* Right: GitHub-Style Learning Heatmap */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#22D3EE]" />
              Learning Activity Heatmap (Last 16 Weeks)
            </h3>
            <span className="text-[10px] text-[#94A3B8]">118 Contributions</span>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((level, dIdx) => (
                    <div
                      key={dIdx}
                      title={`Week ${wIdx + 1}, Day ${dIdx + 1}`}
                      className={`h-3.5 w-3.5 rounded-sm ${getHeatmapColor(level)} transition-colors hover:ring-1 hover:ring-white`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-2 text-[10px] text-[#94A3B8]">
            <span>Consistent daily coding elevates memory retention by 4x</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-sm bg-white/5" />
              <div className="h-2.5 w-2.5 rounded-sm bg-[#4F8CFF]/30" />
              <div className="h-2.5 w-2.5 rounded-sm bg-[#4F8CFF]/60" />
              <div className="h-2.5 w-2.5 rounded-sm bg-[#4F8CFF]" />
              <div className="h-2.5 w-2.5 rounded-sm bg-[#22D3EE]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Academic Profile Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
          Edit Academic &amp; University Affiliation
        </h3>

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Student Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                University / College
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Degree / Course
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Programming Skill Level
              </label>
              <select
                value={programmingLevel}
                onChange={(e) => setProgrammingLevel(e.target.value as any)}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              >
                <option value="Beginner">Beginner (No prior coding)</option>
                <option value="Intermediate">Intermediate (Basic syntax known)</option>
                <option value="Advanced">Advanced (Data structures &amp; memory)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
              >
                <option value="c">C Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Academic Bio &amp; Goals
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-8 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
