import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, FileCode, Download, ArrowRight, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { AssignmentResultData } from '../types/index.ts';
import { generateAssignmentPDF } from '../lib/pdf.ts';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<AssignmentResultData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<any[]>('/api/favorites')
      .then((data) => {
        setFavorites(data.map((f) => f.assignment).filter(Boolean));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (assignmentId: string) => {
    try {
      await apiRequest(`/api/favorites/${assignmentId}`, { method: 'DELETE' });
      setFavorites((prev) => prev.filter((f) => f.id !== assignmentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>Saved Academic Resources</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Bookmarked Solutions
        </h1>
        <p className="mt-1 text-xs text-[#94A3B8]">
          Curated lab assignments and algorithm templates saved for swift revision before practical and viva examinations.
        </p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {favorites.length > 0 ? (
          favorites.map((asg) => (
            <div
              key={asg.id}
              className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <Bookmark className="h-4 w-4 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {asg.question}
                  </h4>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    <span className="font-mono uppercase text-[#4F8CFF] font-bold">{asg.language || 'C'}</span> • {asg.topic || 'Lab Practical'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => generateAssignmentPDF(asg, user)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-all"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>

                <button
                  onClick={() => asg.id && handleRemove(asg.id)}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-300 hover:bg-rose-500/20 transition-all"
                  title="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate(`/assignment/${asg.id}`)}
                  className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  <span>Open Solution</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center space-y-2">
            <Bookmark className="h-10 w-10 mx-auto text-[#94A3B8]/60" />
            <h4 className="text-sm font-bold text-white">No Bookmarked Assignments</h4>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Save key assignments by clicking the bookmark icon on any generated lab report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
