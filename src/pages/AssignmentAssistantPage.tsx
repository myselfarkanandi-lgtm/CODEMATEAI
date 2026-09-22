import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  BookOpen,
  FileText,
  RotateCcw,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Brain,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { AssignmentResultData, ClarificationQuestion } from '../types/index.ts';
import { ClarificationCard } from '../components/common/ClarificationCard.tsx';
import { AssignmentResultCard } from '../components/common/AssignmentResultCard.tsx';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const AssignmentAssistantPage: React.FC = () => {
  const { user } = useAuth();

  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'c');
  const [purpose, setPurpose] = useState<'Assignment' | 'Lab' | 'Exam'>('Assignment');
  const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Basic');
  const [answerFormat, setAnswerFormat] = useState('Algorithm + Program + Output');
  const [topic, setTopic] = useState('Loops & Iteration');
  const [showExistingCode, setShowExistingCode] = useState(false);
  const [existingCode, setExistingCode] = useState('');
  const [collegeFormat, setCollegeFormat] = useState(
    user?.college ? `${user.college} Standard Lab Manual Format` : ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[] | null>(null);
  const [result, setResult] = useState<AssignmentResultData | null>(null);

  const samplePrompts = [
    'Write a C program to check whether a given integer is prime or composite with dry run.',
    'Write a program to find the largest and smallest elements in a 1D array of 10 integers.',
    'Implement matrix addition and subtraction for two 3x3 matrices with input validation.',
    'Write a function to compute the factorial of a number using recursion vs iteration.',
  ];

  const handleGenerate = async (force = false, clarificationAnswers?: Record<string, string>) => {
    if (!question.trim()) {
      setError('Please enter your assignment question.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const payload: any = {
        question: question.trim(),
        language: clarificationAnswers?.language || language,
        course: user?.course,
        semester: user?.semester,
        purpose,
        difficulty: clarificationAnswers?.difficulty || difficulty,
        answerFormat: clarificationAnswers?.answerFormat || answerFormat,
        existingCode: showExistingCode ? existingCode : undefined,
        collegeFormat,
        forceGenerate: force,
      };

      const res = await apiRequest<any>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.needsClarification && res.clarificationQuestions) {
        setClarificationQuestions(res.clarificationQuestions);
        setResult(null);
      } else {
        setClarificationQuestions(null);
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate assignment solution.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarificationConfirm = (answers: Record<string, string>) => {
    if (answers.language) setLanguage(answers.language.toLowerCase() as any);
    if (answers.difficulty) setDifficulty(answers.difficulty as any);
    if (answers.answerFormat) setAnswerFormat(answers.answerFormat);
    handleGenerate(true, answers);
  };

  const handleReset = () => {
    setQuestion('');
    setResult(null);
    setClarificationQuestions(null);
    setError('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#A78BFA]">
            <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span>AI Academic Assignment Assistant</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Solve &amp; Understand Lab Assignments
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Generates university-grade step-by-step algorithms, well-commented source code, dry-run traces, and oral viva drill questions.
          </p>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#151D36] px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[#4F8CFF]/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Problem</span>
          </button>
        )}
      </div>

      {/* Loading Thinking State */}
      {isLoading && <AiThinkingLoader title="Formulating Academic Solution" />}

      {/* Two-Column Form & AI Guidance (shown when no result and not loading) */}
      {!result && !isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Assignment Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 lg:col-span-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Question Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white">
                Assignment Problem / Question
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Write a C program to check whether a given integer is prime or composite, including algorithm, execution dry-run table, and output."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0B1026] p-4 text-xs text-white placeholder-[#94A3B8]/60 focus:border-[#4F8CFF] focus:outline-none focus:ring-1 focus:ring-[#4F8CFF]/50"
              />
            </div>

            {/* Try Samples */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Try Sample Problems:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(p)}
                    className="rounded-xl border border-white/10 bg-[#11182D] px-3 py-1.5 text-[11px] text-[#94A3B8] transition-all hover:border-[#4F8CFF]/40 hover:text-white"
                  >
                    {p.slice(0, 46)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8]">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1026] p-2.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                >
                  <option value="c">C Language</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8]">Topic Focus</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1026] p-2.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                >
                  <option value="Loops & Iteration">Loops &amp; Iteration</option>
                  <option value="Arrays & Matrices">Arrays &amp; Matrices</option>
                  <option value="Functions & Recursion">Functions &amp; Recursion</option>
                  <option value="Pointers & Memory">Pointers &amp; Memory</option>
                  <option value="Structures & Unions">Structures &amp; Unions</option>
                  <option value="File I/O">File I/O</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8]">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1026] p-2.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                >
                  <option value="Basic">Basic (1st Year Standard)</option>
                  <option value="Intermediate">Intermediate (Modular)</option>
                  <option value="Advanced">Advanced (Optimized)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8]">Required Format</label>
                <select
                  value={answerFormat}
                  onChange={(e) => setAnswerFormat(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1026] p-2.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                >
                  <option value="Algorithm + Program + Output">Algorithm + Code + Output</option>
                  <option value="Program Only">Source Code Only</option>
                  <option value="Complete Explanation with Dry Run">Dry Run Trace + Viva</option>
                </select>
              </div>
            </div>

            {/* Optional Existing Code Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowExistingCode(!showExistingCode)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#4F8CFF] hover:underline"
              >
                <span>{showExistingCode ? '− Hide partial code' : '+ I already have starter or draft code'}</span>
              </button>

              {showExistingCode && (
                <div className="mt-2.5">
                  <textarea
                    rows={4}
                    placeholder="Paste your existing code draft here..."
                    value={existingCode}
                    onChange={(e) => setExistingCode(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#060A1A] p-3 font-mono text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-[11px] text-[#94A3B8]">
                Target: <span className="text-white font-medium">{user?.course || 'B.Pharm'} Sem {user?.semester || 1}</span>
              </div>

              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isLoading || !question.trim()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                <span>Generate Solution</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: AI Assistant Panel & Guidance */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Assistant Panel</h3>
                  <p className="text-[10px] text-[#22D3EE]">Active Gemini 3.8 Intelligence</p>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-[#94A3B8]">
                <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-3.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                    Academic Lab Standard
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Code answers follow formal university lab rubrics: step-by-step algorithms, clear comments, boundary condition checks, and dry-run execution steps.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-3.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-[#4F8CFF]" />
                    Line-By-Line Dry Run
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Visualizes how variables change value inside loop iterations, giving you confidence when the teacher asks how your code executes.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-3.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#A78BFA]" />
                    Automatic Viva Questions
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Generates 3-5 standard viva voce questions related directly to the problem logic, with sample expert answers.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#4F8CFF]/20 bg-[#4F8CFF]/10 p-3 text-center text-[11px] text-[#A78BFA]">
              ✨ 1-Click Lab Manual PDF will be available once the solution is generated.
            </div>
          </div>
        </div>
      )}

      {/* Clarification Step if Triggered */}
      {clarificationQuestions && (
        <ClarificationCard
          questions={clarificationQuestions}
          onConfirm={handleClarificationConfirm}
          onSkip={() => handleGenerate(true)}
          isLoading={isLoading}
        />
      )}

      {/* Result Card when Solution Ready */}
      {result && <AssignmentResultCard assignment={result} isFavorite={result.isFavorite} />}
    </div>
  );
};
