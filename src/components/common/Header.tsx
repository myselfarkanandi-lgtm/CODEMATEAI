import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  User,
  LogOut,
  LineChart,
  Settings,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { NotificationItem } from '../../types/index.ts';
import { apiRequest } from '../../lib/api.ts';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiStatus, setAiStatus] = useState<{ isUsingRealGemini: boolean; modelName: string }>({
    isUsingRealGemini: true,
    modelName: 'gemini-3.8-flash',
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      apiRequest<NotificationItem[]>('/api/notifications')
        .then(setNotifications)
        .catch(() => {});
      apiRequest<{ isUsingRealGemini: boolean; modelName: string }>('/api/ai/status')
        .then(setAiStatus)
        .catch(() => {});
    }
  }, [user]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !(n.isRead ?? n.is_read)).length;

  const markAllAsRead = async () => {
    try {
      await apiRequest('/api/notifications/mark-all-read', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, is_read: true })));
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get user initials (e.g. "Arka Nandi" -> "AN")
  const getInitials = (name?: string) => {
    if (!name) return 'AN';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-white/10 bg-[#0B1026]/90 px-4 sm:px-6 backdrop-blur-2xl text-[#F8FAFC]">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151D36]/80 text-[#94A3B8] hover:border-[#4F8CFF]/40 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <form onSubmit={handleSearch} className="relative hidden w-72 md:block lg:w-96">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search assignments, concepts, doubts... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#11182D]/80 py-2 pl-10 pr-4 text-xs text-white placeholder-[#94A3B8]/60 transition-all focus:border-[#4F8CFF] focus:bg-[#151D36] focus:outline-none focus:ring-1 focus:ring-[#4F8CFF]/50"
          />
        </form>
      </div>

      {/* Right Controls: AI Engine Status, Notifications, Theme, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Gemini Engine Active Pill */}
        <div
          id="ai-engine-badge"
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-[#151D36]/80 px-3 py-1.5 text-[11px] font-medium text-[#F8FAFC] shadow-sm sm:flex"
          title={`CodeMate AI Engine Active: ${aiStatus.modelName}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
          <span className="font-semibold text-white">Gemini 3.8 Flash</span>
          <span className="text-[10px] text-[#22C55E]">Online</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151D36]/80 text-[#94A3B8] transition-all hover:border-[#4F8CFF]/40 hover:text-white"
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-[#4F8CFF]" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-menu-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151D36]/80 text-[#94A3B8] transition-all hover:border-[#4F8CFF]/40 hover:text-white"
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-white/10 bg-[#0B1026]/95 p-3.5 shadow-2xl backdrop-blur-2xl sm:w-96">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#4F8CFF]/20 px-2 py-0.5 text-[10px] font-semibold text-[#4F8CFF]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-[#4F8CFF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2.5 max-h-72 space-y-2 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#94A3B8]">No notifications right now</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.link) navigate(notif.link);
                        setShowNotifications(false);
                      }}
                      className={`cursor-pointer rounded-xl p-2.5 transition-all ${
                        (notif.isRead ?? notif.is_read)
                          ? 'bg-white/[0.02] hover:bg-white/[0.06]'
                          : 'border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 hover:bg-[#4F8CFF]/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-white">{notif.title}</p>
                        {!(notif.isRead ?? notif.is_read) && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#22D3EE]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#94A3B8]">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Premium User Avatar & Status */}
        <div className="relative" ref={profileRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#151D36]/80 p-1.5 pr-2.5 transition-all hover:border-[#4F8CFF]/40 hover:bg-[#151D36]"
          >
            {/* Avatar with subtle gradient border */}
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-tr from-[#4F8CFF] via-[#8B5CF6] to-[#22D3EE] p-[2px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0B1026] text-xs font-bold text-white shadow-inner">
                  {getInitials(user?.name)}
                </div>
              </div>
              {/* Online status indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-[#0B1026] bg-[#22C55E]"></span>
              </span>
            </div>

            {/* Student Name & Meta */}
            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold text-white max-w-[120px]">
                  {user?.name || 'Student'}
                </p>
                <ChevronDown className="h-3 w-3 text-[#94A3B8]" />
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                {user?.course || 'CS'} • Sem {user?.semester || 1}
              </p>
            </div>
          </button>

          {/* Avatar Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-white/10 bg-[#0B1026]/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 p-2.5">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="truncate text-[11px] text-[#94A3B8]">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Active Student Session
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#F8FAFC] transition-colors hover:bg-white/10"
                >
                  <User className="h-4 w-4 text-[#4F8CFF]" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/progress');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#F8FAFC] transition-colors hover:bg-white/10"
                >
                  <LineChart className="h-4 w-4 text-[#8B5CF6]" />
                  My Progress
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#F8FAFC] transition-colors hover:bg-white/10"
                >
                  <Settings className="h-4 w-4 text-[#22D3EE]" />
                  Settings
                </button>
              </div>

              <div className="border-t border-white/10 pt-1">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
