import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Send,
  Languages,
  Code2,
  Lightbulb,
  Copy,
  Check,
  History,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { DoubtItem } from '../types/index.ts';
import { CodeEditor } from '../components/common/CodeEditor.tsx';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const DoubtSolverPage: React.FC = () => {
  const { user } = useAuth();

  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'c');
  const [langPref, setLangPref] = useState<'English' | 'Bengali'>('English');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState<DoubtItem | null>(null);
  const [pastDoubts, setPastDoubts] = useState<DoubtItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiRequest<any[]>('/api/history?type=doubt')
      .then((items) => {
        setPastDoubts(
          items.map((i) => ({
            id: i.id,
            user_id: user?.id || '',
            question: i.title,
            language: i.language,
            answer: i.details,
            simple_explanation: i.details,
            example: '',
            related_concepts: [],
            created_at: i.date,
          }))
        );
      })
      .catch(() => {});
  }, [user]);

  const sampleDoubts = [
    'What is a pointer and why do we need the & address-of operator in C?',
    'Why do we use scanf() with & but strings do not need &?',
    'What is the difference between call by value and call by reference?',
    'Why does an array index start from 0 in most programming languages?',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/api/ai/doubt', {
        method: 'POST',
        body: JSON.stringify({
          question: q.trim(),
          language,
          languagePreference: langPref,
        }),
      });

      const newDoubt: DoubtItem = {
        id: res.id || 'dbt_' + Date.now(),
        user_id: user?.id || '',
        question: q.trim(),
        language,
        answer: res.answer,
        simple_explanation: res.simpleExplanation,
        example: res.example,
        related_concepts: res.relatedConcepts || [],
        created_at: new Date().toISOString(),
      };

      setCurrentDoubt(newDoubt);
      setPastDoubts((prev) => [newDoubt, ...prev]);
      setQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold text-[#A78BFA]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Interactive AI Concept &amp; Doubt Solver</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Ask Any Coding Concept
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Get clear, academic answers with intuitive analogies, executable code examples, and bilingual English / Bengali support.
          </p>
        </div>

        {/* Language & Bilingual Mode Toggles */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-2xl border border-white/10 bg-[#0B1026] p-1">
            <button
              onClick={() => setLangPref('English')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                langPref === 'English'
                  ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLangPref('Bengali')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                langPref === 'Bengali'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              বাংলা (Bengali)
            </button>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#0B1026] px-3.5 py-2 text-xs font-bold text-white focus:outline-none"
          >
            <option value="c">C Language</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      {isLoading && <AiThinkingLoader title="Formulating Pedagogical Explanation" />}

      {/* Main Split Layout */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Ask Input & History */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                What concept would you like explained?
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Why does an array name decay into a pointer when passed to a function in C?"
                className="w-full rounded-2xl border border-white/10 bg-[#0B1026] p-4 text-xs text-white placeholder-[#94A3B8]/60 focus:border-[#4F8CFF] focus:outline-none resize-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => handleAsk()}
                  disabled={!question.trim()}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-6 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Explain Concept</span>
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="border-t border-white/10 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Common Lab Exam Doubts:
              </span>
              <div className="mt-2.5 space-y-2">
                {sampleDoubts.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(d)}
                    className="block w-full text-left rounded-xl border border-white/10 bg-[#0B1026]/60 p-2.5 text-xs text-[#94A3B8] transition-all hover:border-[#4F8CFF]/40 hover:text-white"
                  >
                    • {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Past Doubts */}
            {pastDoubts.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" /> Recently Clarified
                </span>
                <div className="mt-2.5 max-h-48 overflow-y-auto space-y-2 pr-1">
                  {pastDoubts.slice(0, 5).map((pd) => (
                    <button
                      key={pd.id}
                      onClick={() => setCurrentDoubt(pd)}
                      className="block w-full text-left rounded-xl border border-white/5 bg-white/[0.02] p-2 text-xs text-[#94A3B8] hover:bg-white/[0.05] hover:text-white truncate"
                    >
                      {pd.question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Explanation & Code Output */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-7 space-y-6">
            {currentDoubt ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Doubt Question Header */}
                <div className="border-b border-white/10 pb-4">
                  <span className="rounded-full bg-[#8B5CF6]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#A78BFA]">
                    {currentDoubt.language} • {langPref}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {currentDoubt.question}
                  </h3>
                </div>

                {/* Core Explanation */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4F8CFF] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
                    Conceptual Breakdown
                  </h4>
                  <p className="text-xs leading-relaxed text-[#F8FAFC] whitespace-pre-line">
                    {currentDoubt.answer}
                  </p>
                </div>

                {/* Simple Plain-English / Plain-Bengali Summary */}
                {currentDoubt.simple_explanation && (
                  <div className="rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/10 p-4">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#22D3EE] flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                      In Simple Terms (Exam Recall)
                    </h5>
                    <p className="mt-1 text-xs text-white/90 leading-relaxed">
                      {currentDoubt.simple_explanation}
                    </p>
                  </div>
                )}

                {/* Executable Code Example */}
                {currentDoubt.example && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                      Illustrative Code Example:
                    </h5>
                    <CodeEditor
                      code={currentDoubt.example}
                      language={currentDoubt.language}
                      title="concept_example.c"
                      height="max-h-56"
                    />
                  </div>
                )}

                {/* Related Concepts */}
                {currentDoubt.related_concepts && currentDoubt.related_concepts.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Related Exam Concepts:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentDoubt.related_concepts.map((rc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAsk(`Explain ${rc} in detail`)}
                          className="rounded-xl border border-white/10 bg-[#151D36] px-3 py-1 text-xs text-[#4F8CFF] hover:border-[#4F8CFF]/40 hover:text-white"
                        >
                          {rc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center text-center p-6 border border-dashed border-white/15 rounded-3xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#151D36] text-[#4F8CFF]">
                  <HelpCircle className="h-8 w-8" />
                </div>
                <h4 className="mt-4 text-base font-bold text-white">
                  Awaiting Concept or Question
                </h4>
                <p className="mt-1.5 max-w-sm text-xs text-[#94A3B8]">
                  Select a common doubt from the left or type your question to receive an academic breakdown and code demo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
