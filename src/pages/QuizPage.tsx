import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { PracticeQuestion } from '../types/index.ts';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const QuizPage: React.FC = () => {
  const { user } = useAuth();

  const [topic, setTopic] = useState('All Topics');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    let timer: any;
    if (isQuizActive && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isQuizActive && !isSubmitted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeft, isSubmitted]);

  const startQuiz = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ questions: PracticeQuestion[] }>('/api/quiz/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic: topic === 'All Topics' ? undefined : topic,
          count: 5,
        }),
      });
      setQuestions(res.questions || []);
      setSelectedAnswers({});
      setTimeLeft(300);
      setIsQuizActive(true);
      setIsSubmitted(false);
      setResult(null);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitted(true);
    setIsQuizActive(false);

    try {
      const res = await apiRequest<any>('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          topic,
          questions,
          answers: selectedAnswers,
          timeSpentSeconds: 300 - timeLeft,
        }),
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Academic Semester Assessment</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Timed Programming Examination
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Timed multiple-choice and conceptual code output questions designed for exam readiness under test conditions.
          </p>
        </div>

        {isQuizActive && !isSubmitted && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
            <Clock className="h-4 w-4 animate-pulse" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {isLoading && <AiThinkingLoader title="Generating Timed Assessment Papers" />}

      {/* Start Quiz Card */}
      {!isQuizActive && !isSubmitted && !isLoading && (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white shadow-xl shadow-blue-500/25">
            <FileCheck2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Ready to Test Your Knowledge?
            </h2>
            <p className="mt-2 text-xs text-[#94A3B8]">
              5 timed questions based on your university curriculum. Instant accuracy breakdown and explanation for every answer.
            </p>
          </div>

          <div className="text-left space-y-2 max-w-xs mx-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Assessment Scope
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0B1026] p-3.5 text-xs font-bold text-white focus:outline-none"
            >
              <option value="All Topics">All Syllabus Units</option>
              <option value="Pointers">Pointers &amp; Memory</option>
              <option value="Arrays">Arrays &amp; Strings</option>
              <option value="Functions">Functions &amp; Recursion</option>
              <option value="Loops">Loops &amp; Iteration</option>
            </select>
          </div>

          <button
            onClick={startQuiz}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] p-4 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            <span>Start 5-Minute Timed Quiz</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Active Quiz Question Box */}
      {isQuizActive && !isSubmitted && currentQ && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Question Tracker & Category tag */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                    currentIndex === i
                      ? 'bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white shadow-lg'
                      : selectedAnswers[i]
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border border-white/10 bg-[#151D36] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-[#151D36] px-3 py-1 text-xs text-[#94A3B8]">
                Tracker: <strong className="text-white">{currentIndex + 1}/{questions.length}</strong>
              </span>
              <span className="rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
                {currentQ.topic || topic}
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                {currentQ.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          {/* Active Question Container */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h3>

            {/* Options with Smooth Selection */}
            <div className="space-y-3">
              {currentQ.options?.map((opt: string, i: number) => {
                const isSelected = selectedAnswers[currentIndex] === opt;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-xs transition-all ${
                      isSelected
                        ? 'border-[#4F8CFF] bg-[#4F8CFF]/15 text-white ring-1 ring-[#4F8CFF]/50 shadow-lg'
                        : 'border-white/10 bg-[#0B1026]/70 text-[#94A3B8] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-extrabold ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white'
                          : 'border border-white/10 bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium text-white/90">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentIndex + 1 < questions.length ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white shadow-md"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
                >
                  <span>Submit Exam</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submitted Score Summary & Immediate Explanations */}
      {isSubmitted && (
        <div className="glass-card rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl">
            <Award className="h-8 w-8" />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white">Assessment Results</h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Completed in {formatTime(300 - timeLeft)} • Scope: {topic}
            </p>
          </div>

          {/* Score Stat Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-white/10 bg-[#0B1026] p-4">
              <span className="text-[10px] uppercase text-[#94A3B8] block">Total Questions</span>
              <span className="text-xl font-bold text-white">{questions.length}</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <span className="text-[10px] uppercase text-emerald-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-300">
                {result?.score || 80}%
              </span>
            </div>
            <div className="rounded-2xl border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 p-4">
              <span className="text-[10px] uppercase text-[#4F8CFF] block">XP Earned</span>
              <span className="text-xl font-bold text-[#A78BFA]">+50 XP</span>
            </div>
          </div>

          {/* Question Review & Explanations */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Detailed Question Explanations
            </h4>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        Question {idx + 1}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle className="h-3.5 w-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#F8FAFC]">{q.questionText}</p>

                    <div className="text-[11px] space-y-1">
                      <p className="text-[#94A3B8]">
                        Your Answer: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userChoice || 'Unanswered'}</strong>
                      </p>
                      <p className="text-emerald-400">
                        Correct Answer: <strong>{q.correctAnswer}</strong>
                      </p>
                    </div>

                    {q.explanation && (
                      <div className="rounded-xl border border-white/5 bg-[#060A1A] p-3 text-[11px] text-[#94A3B8]">
                        💡 <strong>Concept Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setIsQuizActive(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3.5 text-xs font-bold text-white shadow-xl"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Take Another Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
