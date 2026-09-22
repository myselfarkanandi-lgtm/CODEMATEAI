import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Award,
  TrendingUp,
  Layers,
  Code2,
  AlertTriangle,
  Play,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { PracticeQuestion } from '../types/index.ts';
import { CodeEditor } from '../components/common/CodeEditor.tsx';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const PracticePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [topic, setTopic] = useState(searchParams.get('topic') || 'Arrays');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'Intermediate');
  const [questionType, setQuestionType] = useState('Code Writing');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [hintStep, setHintStep] = useState(0); // 0 = none, 1 = concept, 2 = logic, 3 = code snippet
  const [answersLog, setAnswersLog] = useState<{ isCorrect: boolean; score: number }[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [adaptiveMsg, setAdaptiveMsg] = useState('');

  const loadQuestions = async (t = topic, d = difficulty, qt = questionType) => {
    setIsGenerating(true);
    setEvaluation(null);
    setUserAnswer('');
    setCurrentIndex(0);
    setHintStep(0);
    setAnswersLog([]);
    setSessionCompleted(false);
    setAdaptiveMsg('');

    try {
      const res = await apiRequest<{ questions: PracticeQuestion[] }>('/api/ai/practice', {
        method: 'POST',
        body: JSON.stringify({
          subject: 'Computer Programming',
          topic: t,
          difficulty: d,
          questionType: qt,
          count: 3,
        }),
      });
      setQuestions(res.questions || []);
      if (res.questions && res.questions[0]?.starterCode) {
        setUserAnswer(res.questions[0].starterCode);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const currentQ = questions[currentIndex];

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || !currentQ) return;
    setIsSubmitting(true);

    try {
      const res = await apiRequest<any>('/api/ai/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          questionText: currentQ.questionText,
          userAnswer: userAnswer.trim(),
          correctAnswer: currentQ.correctAnswer,
          difficulty: currentQ.difficulty,
          topic: currentQ.topic,
        }),
      });

      setEvaluation(res);
      setAnswersLog((prev) => [...prev, { isCorrect: res.isCorrect, score: res.score }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setEvaluation(null);
    setUserAnswer('');
    setHintStep(0);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      if (questions[currentIndex + 1]?.starterCode) {
        setUserAnswer(questions[currentIndex + 1].starterCode!);
      }
    } else {
      // Completed session
      setSessionCompleted(true);
      const correctCount = answersLog.filter((a) => a.isCorrect).length;
      const total = answersLog.length || questions.length;
      const pct = Math.round((correctCount / total) * 100);

      if (pct >= 80 && difficulty === 'Basic') {
        setAdaptiveMsg('🎉 Excellent mastery (≥80%)! Automatically stepping up difficulty to Intermediate.');
        setDifficulty('Intermediate');
      } else if (pct >= 80 && difficulty === 'Intermediate') {
        setAdaptiveMsg('🏆 Outstanding performance! Stepping up to Advanced exam level.');
        setDifficulty('Advanced');
      } else if (pct < 50) {
        setAdaptiveMsg('💡 Topic needs review. Recommended: try our fundamental drills.');
      }
    }
  };

  // 3-step hint ladder texts based on question
  const getHintText = (step: number) => {
    if (!currentQ) return '';
    if (step === 1) {
      return (
        <span>
          <strong>Level 1 (Concept):</strong> Consider the base cases and boundary constraints. Identify which loop or condition naturally terminates the process.
        </span>
      );
    }
    if (step === 2) {
      return (
        <span>
          <strong>Level 2 (Logic Structure):</strong> Initialize variables before the loop. Keep track of iteration index <code>i &lt; n</code>, and handle edge case <code>n &lt;= 0</code>.
        </span>
      );
    }
    if (step === 3) {
      return (
        <span>
          <strong>Level 3 (Syntax Snippet):</strong> {currentQ.hint || 'Check format specifiers (%d for int) and remember array indexing starts at 0.'}
        </span>
      );
    }
    return '';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-3 py-1 text-xs font-semibold text-[#22D3EE]">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Interactive Focus Practice Mode</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Adaptive Syllabus Practice
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Curriculum-calibrated problem sets. Difficulty auto-steps when topic mastery exceeds 80%.
          </p>
        </div>

        {/* Topic & Difficulty Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              loadQuestions(e.target.value, difficulty);
            }}
            className="rounded-xl border border-white/10 bg-[#0B1026] px-3 py-2 text-xs font-bold text-white focus:outline-none"
          >
            <option value="Operators">Operators</option>
            <option value="Loops">Loops &amp; Iteration</option>
            <option value="Functions">Functions &amp; Recursion</option>
            <option value="Arrays">Arrays &amp; Strings</option>
            <option value="Pointers">Pointers &amp; Memory</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              loadQuestions(topic, e.target.value);
            }}
            className="rounded-xl border border-white/10 bg-[#0B1026] px-3 py-2 text-xs font-bold text-white focus:outline-none"
          >
            <option value="Basic">Basic (1st Year)</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced Exam</option>
          </select>
        </div>
      </div>

      {isGenerating && <AiThinkingLoader title="Formulating Adaptive Drill Questions" />}

      {/* Main Focus Practice Screen */}
      {!isGenerating && currentQ && !sessionCompleted && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Problem Description & Constraints */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="rounded-full bg-[#4F8CFF]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#4F8CFF]">
                  {currentQ.difficulty}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {currentQ.topic}: Problem {currentIndex + 1}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                  {currentQ.questionText}
                </p>
              </div>

              {/* Constraints */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                  Constraints &amp; Rules
                </h4>
                <ul className="list-disc pl-4 text-[11px] text-[#94A3B8] space-y-1">
                  <li>Time Limit: 2.0s per test case execution</li>
                  <li>Memory Limit: 256 MB</li>
                  <li>Language: C / C++ Standard 2026</li>
                </ul>
              </div>

              {/* Input / Output Example */}
              <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                  Example I/O
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl bg-[#060A1A] p-2.5">
                    <span className="text-[10px] uppercase text-[#94A3B8] block">Input</span>
                    <span className="text-[#22D3EE]">{currentQ.sampleInput || '5'}</span>
                  </div>
                  <div className="rounded-xl bg-[#060A1A] p-2.5">
                    <span className="text-[10px] uppercase text-[#94A3B8] block">Output</span>
                    <span className="text-emerald-400">{currentQ.expectedOutput || '120'}</span>
                  </div>
                </div>
              </div>

              {/* 3-Step Hint Ladder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    Hint Ladder ({hintStep}/3)
                  </span>
                  {hintStep < 3 && (
                    <button
                      onClick={() => setHintStep((s) => s + 1)}
                      className="text-[11px] font-bold text-[#4F8CFF] hover:underline"
                    >
                      Reveal Next Hint →
                    </button>
                  )}
                </div>

                {hintStep > 0 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    {getHintText(hintStep)}
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-[#94A3B8] border-t border-white/10 pt-3">
              Aim for clean variable naming and edge condition coverage.
            </div>
          </div>

          {/* Right Column: Code Editor & Result Evaluation Panel */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Interactive Solution Editor
              </span>
              <span className="font-mono text-xs text-[#94A3B8]">solution.c</span>
            </div>

            {/* Code Input Editor */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#060A1A]">
              <textarea
                rows={12}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="// Write your code or answer here..."
                className="w-full bg-transparent p-4 font-mono text-xs leading-relaxed text-[#F8FAFC] focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setUserAnswer('')}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                Clear
              </button>

              <button
                onClick={handleEvaluate}
                disabled={isSubmitting || !userAnswer.trim()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Evaluating Tests...</span>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Submit &amp; Run Tests</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Evaluation Panel (Accepted, Wrong Answer, Edge Case Failed) */}
            {evaluation && (
              <div
                className={`mt-4 rounded-2xl border p-5 transition-all animate-fadeIn ${
                  evaluation.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-white'
                    : 'border-rose-500/30 bg-rose-500/10 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        evaluation.isCorrect
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-bounce'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {evaluation.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold">
                        {evaluation.isCorrect ? '🎉 Accepted (All Test Cases Passed!)' : '❌ Wrong Answer / Edge Case Failed'}
                      </h4>
                      <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                        {evaluation.feedback}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="font-bold text-white">Score: {evaluation.score}/100</span>
                        <span>•</span>
                        <span className="text-[#22D3EE]">Accuracy: {evaluation.accuracy || 100}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/20"
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

      {/* Session Completed Summary */}
      {sessionCompleted && (
        <div className="glass-card rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white shadow-xl shadow-blue-500/25">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Practice Session Complete!</h2>
            <p className="mt-2 text-sm text-[#94A3B8]">
              You completed all questions in {topic} ({difficulty}).
            </p>
          </div>

          {adaptiveMsg && (
            <div className="rounded-2xl border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 p-4 text-xs font-semibold text-[#A78BFA]">
              {adaptiveMsg}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => loadQuestions(topic, difficulty)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3.5 text-xs font-bold text-white shadow-xl"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Practice More {topic}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
