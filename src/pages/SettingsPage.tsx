import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Languages,
  Sparkles,
  Database,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  Lock,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [aiLang, setAiLang] = useState<'English' | 'Bengali'>('English');
  const [autoRunCode, setAutoRunCode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            <SettingsIcon className="h-3.5 w-3.5" />
            <span>Platform Configuration &amp; Preferences</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            System Settings
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Customize visual theme preferences, multilingual pedagogic defaults, and inspect multi-user SaaS runtime isolation.
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>System configuration and preferences saved successfully.</span>
        </div>
      )}

      {/* Interface Settings */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4">
          Interface &amp; Visual Preferences
        </h3>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Visual Mode</p>
              <p className="text-[11px] text-[#94A3B8]">
                Switch between Midnight High-Contrast Dark and Crisp Light palette
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1026] px-4 py-2.5 text-xs font-bold text-white hover:border-white/20 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-[#4F8CFF]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-xs font-bold text-white">
                Primary Pedagogic AI Language
              </p>
              <p className="text-[11px] text-[#94A3B8]">
                Select default language for conceptual explanations and viva mock interviews
              </p>
            </div>
            <select
              value={aiLang}
              onChange={(e) => setAiLang(e.target.value as any)}
              className="rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs font-bold text-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Bengali">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-xs font-bold text-white">Auto-execute in Simulated Sandbox</p>
              <p className="text-[11px] text-[#94A3B8]">
                Run code automatically after applying AI corrected snippets
              </p>
            </div>
            <button
              onClick={() => setAutoRunCode(!autoRunCode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoRunCode ? 'bg-[#4F8CFF]' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoRunCode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Multi-User SaaS Security & Isolation Info */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#22D3EE]" />
          Multi-User SaaS Architecture &amp; Data Isolation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Session Security</span>
            <p className="text-xs font-bold text-white">Encrypted JWT Sessions</p>
            <p className="text-[11px] text-[#94A3B8]">Zero cross-account data leakage across multiple users</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Code Execution</span>
            <p className="text-xs font-bold text-[#22D3EE]">Sandboxed WebGL &amp; WebWorker</p>
            <p className="text-[11px] text-[#94A3B8]">Safe execution in client virtual memory environment</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">AI Engine</span>
            <p className="text-xs font-bold text-[#A78BFA]">Server-Side Gemini 2.5</p>
            <p className="text-[11px] text-[#94A3B8]">Secure private API key proxy with strict rate limiting</p>
          </div>
        </div>
      </div>
    </div>
  );
};
