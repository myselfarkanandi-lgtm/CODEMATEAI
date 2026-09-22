import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api.ts';
import { AssignmentResultData } from '../types/index.ts';
import { AssignmentResultCard } from '../components/common/AssignmentResultCard.tsx';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const AssignmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<AssignmentResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchAssignment = async () => {
      try {
        const data = await apiRequest<{ assignment: AssignmentResultData }>(`/api/assignments/${id}`);
        setAssignment(data.assignment);
      } catch (err: any) {
        setError(err.message || 'Assignment not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-12">
        <AiThinkingLoader title="Loading Assignment Solution..." />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="space-y-4 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-xs text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error || 'Unable to find assignment record.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1026] px-4 py-2 text-xs font-bold text-white hover:border-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assignments</span>
        </button>
      </div>

      <AssignmentResultCard assignment={assignment} isFavorite={assignment.isFavorite} />
    </div>
  );
};
