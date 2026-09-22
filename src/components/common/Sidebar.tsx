import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCode,
  HelpCircle,
  Bug,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  LineChart,
  History,
  Bookmark,
  DownloadCloud,
  Settings,
  Flame,
  UserCheck,
  Timer,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Logo } from './Logo.tsx';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'LEARN',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
        { to: '/practice', label: 'Practice', icon: BrainCircuit, badge: 'Adaptive' },
        { to: '/quiz', label: 'Quiz', icon: Timer, badge: 'Timed' },
        { to: '/viva', label: 'Viva', icon: GraduationCap, badge: 'Oral' },
      ],
    },
    {
      title: 'CREATE',
      items: [
        { to: '/assignment', label: 'Assignment Assistant', icon: FileCode, badge: 'AI' },
        { to: '/doubt-solver', label: 'Doubt Solver', icon: HelpCircle },
        { to: '/debugger', label: 'Code Debugger', icon: Bug, badge: 'IDE' },
      ],
    },
    {
      title: 'TRACK',
      items: [
        { to: '/progress', label: 'Progress', icon: LineChart },
        { to: '/history', label: 'History', icon: History },
        { to: '/favorites', label: 'Favorites', icon: Bookmark },
        { to: '/downloads', label: 'Downloads', icon: DownloadCloud },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { to: '/profile', label: 'Profile', icon: UserCheck },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-[#0B1026]/95 backdrop-blur-2xl text-[#F8FAFC]">
      {/* Brand Header */}
      <div className="flex h-18 items-center border-b border-white/10 px-5">
        <Logo size="md" />
      </div>

      {/* Student Pro Status Card */}
      {user && (
        <div className="mx-3.5 mt-3.5 rounded-2xl border border-white/10 bg-[#151D36]/80 p-3 shadow-md shadow-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-[11px] font-bold text-white shadow-sm">
                {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-[#94A3B8]">
                  {user.course} • Sem {user.semester}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{profile?.currentStreak ?? profile?.current_streak ?? 5}d</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>Level {profile?.level || 1}</span>
              <span className="font-mono text-[#4F8CFF]">{profile?.xp || 280} / 500 XP</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6]"
                style={{ width: `${Math.min(100, (((profile?.xp || 280) % 500) / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-[#94A3B8]/70">
              {section.title}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-l-2 border-[#4F8CFF] bg-gradient-to-r from-[#4F8CFF]/20 via-[#8B5CF6]/15 to-transparent text-white font-semibold shadow-sm'
                          : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-gradient-to-r from-[#4F8CFF]/20 to-[#8B5CF6]/20 border border-[#4F8CFF]/30 px-1.5 py-0.5 text-[9px] font-bold text-[#A78BFA]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Logout Button in Account Section */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400/90 transition-all hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Footer Pro Badge */}
      <div className="border-t border-white/10 p-3 text-center text-[10px] text-[#94A3B8]/60 flex items-center justify-center gap-1.5">
        <Sparkles className="h-3 w-3 text-[#22D3EE]" />
        <span>CodeMate AI v2.4 SaaS Edition</span>
      </div>
    </aside>
  );
};
