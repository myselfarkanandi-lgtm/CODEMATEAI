import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  Sparkles,
  School,
  BrainCircuit,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { SyllabusData } from '../types/index.ts';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const SyllabusPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [syllabus, setSyllabus] = useState<SyllabusData | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const data = await apiRequest<SyllabusData>('/api/syllabus');
        setSyllabus(data);

        // Pre-fill completed topics
        const initialCompleted = new Set<string>();
        data.units.forEach((u: any) => {
          u.topics.forEach((t: any) => {
            if (t.completed) initialCompleted.add(t.name);
          });
        });
        setCompletedTopics(initialCompleted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSyllabus();
  }, []);

  const handleToggleTopic = (topicName: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

  const totalTopics = syllabus?.units.reduce((acc: number, u: any) => acc + u.topics.length, 0) || 1;
  const completedCount = completedTopics.size;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Academic Curriculum Mapping</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {syllabus?.subject || 'Computer Programming & Systems'}
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {user?.course || 'B.Tech CS / BCA'} • Semester {user?.semester || 1} • {user?.college || 'University Syllabus Board'}
          </p>
        </div>

        {/* Progress Bar Badge */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Curriculum Completion</span>
            <span className="text-lg font-black text-white">{completedCount}/{totalTopics} Topics ({progressPct}%)</span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-xs shadow-md">
            {progressPct}%
          </div>
        </div>
      </div>

      {isLoading && <AiThinkingLoader title="Loading Curriculum Syllabus &amp; Mapping" />}

      {/* Syllabus Units Accordion / List */}
      {!isLoading && syllabus && (
        <div className="space-y-6">
          {syllabus.units.map((unit: any, idx: number) => (
            <div key={idx} className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F8CFF]/20 text-xs font-black text-[#4F8CFF]">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Unit {idx + 1}: {unit.title}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">{unit.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/practice?topic=${encodeURIComponent(unit.title.split(' ')[0])}`)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
                >
                  <span>Practice Unit</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {unit.topics.map((t: any, tIdx: number) => {
                  const isDone = completedTopics.has(t.name);
                  return (
                    <div
                      key={tIdx}
                      onClick={() => handleToggleTopic(t.name)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-white'
                          : 'border-white/10 bg-[#0B1026]/70 text-[#94A3B8] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-[#94A3B8] shrink-0" />
                        )}
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-white/70' : ''}`}>
                          {t.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-[#4F8CFF]">
                        {t.weightage || 'Medium'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
