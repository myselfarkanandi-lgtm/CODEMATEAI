import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  MessageSquare,
  Send,
  AlertCircle,
  Volume2,
  Mic,
  Activity,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { VivaQuestion } from '../types/index.ts';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const VivaPage: React.FC = () => {
  const { user } = useAuth();

  const [topic, setTopic] = useState('Pointers and Dynamic Memory');
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [sessionLog, setSessionLog] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<any | null>(null);

  const startViva = async () => {
    setIsLoading(true);
    setSessionLog([]);
    setEvaluation(null);
    setCurrentIndex(0);
    setIsFinished(false);
    setFinalReport(null);

    try {
      const res = await apiRequest<{ questions: VivaQuestion[] }>('/api/viva/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic,
          course: user?.course,
          count: 3,
        }),
      });
      setQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateViva = async () => {
    if (!studentAnswer.trim() || !questions[currentIndex]) return;
    setIsEvaluating(true);

    try {
      const currentQ = questions[currentIndex];
      const res = await apiRequest<any>('/api/viva/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          question: currentQ.question,
          studentAnswer: studentAnswer.trim(),
          expectedAnswer: currentQ.expectedAnswer,
          topic: currentQ.topic,
        }),
      });

      setEvaluation(res);
      setSessionLog((prev) => [
        ...prev,
        {
          question: currentQ.question,
          answer: studentAnswer.trim(),
          score: res.score,
          feedback: res.examinerFeedback,
          clarity: res.clarityScore || 85,
          accuracy: res.accuracyScore || res.score || 88,
          confidence: res.confidenceScore || 80,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setStudentAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed viva
      setIsFinished(true);
      const avgScore = Math.round(
        sessionLog.reduce((acc, curr) => acc + (curr.score || 0), 0) / (sessionLog.length || 1)
      );
      setFinalReport({
        averageScore: avgScore,
        totalQuestions: questions.length,
        examinerConclusion:
          avgScore >= 75
            ? 'Demonstrated strong conceptual grasp and clear academic articulation. Lab viva passed with distinction.'
            : 'Basic awareness present, but review of memory management and standard terminology is recommended before university practicals.',
      });
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Simulated University Viva Voce Examination</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Oral Practical Exam Simulation
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Simulates external academic examiners asking probing technical questions to evaluate your oral confidence, conceptual clarity, and rigor.
          </p>
        </div>

        {questions.length > 0 && !isFinished && (
          <button
            onClick={() => {
              setQuestions([]);
              setEvaluation(null);
              setStudentAnswer('');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#151D36] px-3.5 py-2 text-xs font-bold text-white hover:border-white/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>End Session</span>
          </button>
        )}
      </div>

      {isLoading && <AiThinkingLoader title="Preparing Oral Viva Examination Board" />}

      {/* Setup Screen (if no questions yet) */}
      {!isLoading && questions.length === 0 && !isFinished && (
        <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto space-y-6 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/25">
            <Volume2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">
              Configure Your Lab Viva Voce
            </h2>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              Select a syllabus subject domain to face challenging conceptual questions from the AI Examiner.
            </p>
          </div>

          <div className="text-left space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Viva Voce Domain
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3.5 text-xs font-bold text-white focus:outline-none"
            >
              <option value="Pointers and Dynamic Memory">Pointers &amp; Dynamic Memory</option>
              <option value="Arrays, Matrices & Strings">Arrays, Matrices &amp; Strings</option>
              <option value="Functions, Recursion & Storage Classes">Functions, Recursion &amp; Scope</option>
              <option value="Structures, Unions & Bitfields">Structures &amp; Unions</option>
              <option value="File Handling & Streams">File Handling &amp; System Streams</option>
            </select>
          </div>

          <button
            onClick={startViva}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-xs font-bold text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
          >
            <span>Enter Viva Voce Room</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Active Viva Session Screen */}
      {!isLoading && currentQ && !isFinished && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Examiner Panel with Audio Wave Aesthetic */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Examiner Profile Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold shadow-md">
                      EX
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0B1026] bg-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">External Academic Examiner</h3>
                    <p className="text-[10px] text-amber-400">Board of University Examiners • Active Oral Exam</p>
                  </div>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-mono text-[#94A3B8]">
                  Q {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Pulsing Audio Visualizer Wave */}
              <div className="flex items-center justify-center gap-1.5 py-4 rounded-2xl border border-white/5 bg-[#060A1A]">
                {[18, 32, 48, 24, 56, 38, 42, 60, 30, 45, 20, 52, 28, 40, 16].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-orange-400 animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${(i * 0.1).toFixed(1)}s`,
                      animationDuration: '1.2s',
                    }}
                  />
                ))}
              </div>

              {/* Examiner's Question */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Examiner Query:
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  &ldquo;{currentQ.question}&rdquo;
                </p>
              </div>

              {/* Syllabus Context */}
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <BookOpen className="h-3.5 w-3.5 text-[#4F8CFF]" />
                <span>Unit: {currentQ.topic || topic}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B1026]/70 p-3 text-[11px] text-[#94A3B8]">
              💡 Tip: Explain memory implications, boundary cases, and technical keywords clearly.
            </div>
          </div>

          {/* Right Column: Student Answer & AI Grading Breakdown */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Your Spoken / Typed Defense
              </span>
              <span className="text-[11px] text-[#22D3EE] flex items-center gap-1">
                <Mic className="h-3 w-3" /> Voice &amp; Text Enabled
              </span>
            </div>

            {/* Answer Input */}
            <textarea
              rows={6}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="State your answer clearly (e.g. When an array is passed to a function in C, it decays into a pointer to its first element. Therefore, any modification inside the function affects the original array...)"
              className="w-full rounded-2xl border border-white/10 bg-[#060A1A] p-4 text-xs text-white placeholder-[#94A3B8]/60 focus:border-amber-500 focus:outline-none"
            />

            {/* Submit Action */}
            <div className="flex justify-end">
              <button
                onClick={handleEvaluateViva}
                disabled={isEvaluating || !studentAnswer.trim()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <span>Assessing Response...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Oral Answer</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Grading Breakdown (Confidence, Clarity, Technical Accuracy, Model Answer) */}
            {evaluation && (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0B1026] p-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Examiner Assessment &amp; Metrics
                  </h4>
                  <span className="font-bold text-amber-400">Score: {evaluation.score || 85}/100</span>
                </div>

                {/* 3 Metric Pills: Accuracy, Clarity, Confidence */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] uppercase text-[#94A3B8] block">Technical Accuracy</span>
                    <span className="text-sm font-bold text-[#22D3EE]">{evaluation.accuracyScore || evaluation.score || 88}%</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] uppercase text-[#94A3B8] block">Conceptual Clarity</span>
                    <span className="text-sm font-bold text-emerald-400">{evaluation.clarityScore || 85}%</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] uppercase text-[#94A3B8] block">Oral Confidence</span>
                    <span className="text-sm font-bold text-purple-400">{evaluation.confidenceScore || 82}%</span>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h5 className="text-[11px] font-bold text-white">Examiner Feedback:</h5>
                  <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                    {evaluation.examinerFeedback}
                  </p>
                </div>

                {/* Model Answer Display */}
                <div className="rounded-xl border border-[#4F8CFF]/20 bg-[#4F8CFF]/10 p-3.5 space-y-1">
                  <h5 className="text-[11px] font-bold text-[#4F8CFF]">High-Scoring Model Answer:</h5>
                  <p className="text-xs text-white/90 leading-relaxed font-mono">
                    {currentQ.expectedAnswer}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white shadow-lg"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary Report */}
      {isFinished && finalReport && (
        <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto space-y-6 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-[#22C55E] to-teal-400 text-white shadow-xl shadow-emerald-500/25">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Viva Examination Concluded</h2>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              Final Assessment from the Board of Examiners
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1026] p-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Composite Performance
            </span>
            <p className="text-4xl font-black text-amber-400">
              {finalReport.averageScore}%
            </p>
            <p className="text-xs text-[#F8FAFC] leading-relaxed max-w-lg mx-auto">
              {finalReport.examinerConclusion}
            </p>
          </div>

          <button
            onClick={() => {
              setQuestions([]);
              setIsFinished(false);
            }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl mx-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Practice Another Topic</span>
          </button>
        </div>
      )}
    </div>
  );
};
