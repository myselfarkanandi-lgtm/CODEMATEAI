import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { ClarificationQuestion } from '../../types/index.ts';

interface ClarificationCardProps {
  questions: ClarificationQuestion[];
  onConfirm: (answers: Record<string, string>) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export const ClarificationCard: React.FC<ClarificationCardProps> = ({
  questions,
  onConfirm,
  onSkip,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (fieldKey: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [fieldKey]: option }));
  };

  const handleConfirm = () => {
    onConfirm(answers);
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            CodeMate AI Needs a Little Clarification
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            To give you the exact academic solution suited for your university curriculum, please clarify:
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((q, idx) => {
          const key = q.fieldKey || `q_${idx}`;
          const currentVal = answers[key] || '';

          return (
            <div
              key={q.id || idx}
              className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {idx + 1}
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{q.question}</p>
              </div>

              {q.options && q.options.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isSelected = currentVal === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(key, opt)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30 dark:bg-blue-600'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter details..."
                  value={currentVal}
                  onChange={(e) => handleSelectOption(key, e.target.value)}
                  className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-blue-200/60 pt-4 dark:border-blue-900/60">
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
        >
          Generate with default settings
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Crafting Solution...</span>
          ) : (
            <>
              <span>Generate Tailored Solution</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
