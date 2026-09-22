import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  FileCode,
  HelpCircle,
  Bug,
  BrainCircuit,
  Search,
  Download,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { HistoryItem } from '../types/index.ts';
import { generateAssignmentPDF } from '../lib/pdf.ts';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiRequest<HistoryItem[]>(
          `/api/history${filterType !== 'all' ? `?type=${filterType}` : ''}`
        );
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [filterType]);

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileCode className="h-4 w-4 text-[#4F8CFF]" />;
      case 'doubt':
        return <HelpCircle className="h-4 w-4 text-[#8B5CF6]" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-rose-400" />;
      default:
        return <BrainCircuit className="h-4 w-4 text-[#22D3EE]" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            <History className="h-3.5 w-3.5" />
            <span>Academic Activity Log</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Activity History
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Review past assignment solutions, solved doubts, debug runs, and viva sessions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0B1026] py-2.5 pl-10 pr-4 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'assignment', label: 'Assignments' },
          { id: 'doubt', label: 'Doubts Asked' },
          { id: 'debug', label: 'Debug Logs' },
          { id: 'practice', label: 'Practice Drills' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-lg shadow-blue-500/25'
                : 'border border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#060A1A]">
                {getIcon(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-[#94A3B8] uppercase">
                    {item.language || item.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#94A3B8] line-clamp-1">
                  {item.details}
                </p>
                <span className="mt-1 text-[11px] text-[#94A3B8]/60 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.type === 'assignment' && (
                <button
                  onClick={() => navigate(`/assignment/${item.id}`)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                >
                  <span>View Solution</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && !isLoading && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <History className="h-10 w-10 mx-auto text-[#94A3B8]" />
            <h4 className="mt-3 text-sm font-bold text-white">No Activities Recorded</h4>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Solve assignments or ask doubts to build your study audit history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
