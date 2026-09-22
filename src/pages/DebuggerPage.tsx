import React, { useState } from 'react';
import {
  Bug,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Lightbulb,
  ShieldCheck,
  Code2,
  ArrowRight,
  Terminal,
  Zap,
  Info,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { DebugReport } from '../types/index.ts';
import { CodeEditor } from '../components/common/CodeEditor.tsx';
import { AiThinkingLoader } from '../components/common/AiThinkingLoader.tsx';

export const DebuggerPage: React.FC = () => {
  const { user } = useAuth();

  const [code, setCode] = useState(`#include <stdio.h>

int main() {
    int n, sum = 0;
    printf("Enter limit: ");
    scanf("%d", &n) // Error: missing semicolon
    
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    
    printf("Sum = %d\\n", sum);
    return 0;
}`);

  const [language, setLanguage] = useState(user?.preferredLanguage || 'c');
  const [errorMessage, setErrorMessage] = useState("error: expected ';' before 'for'");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<DebugReport | null>(null);

  const handleDebug = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiRequest<DebugReport>('/api/ai/debug', {
        method: 'POST',
        body: JSON.stringify({
          code,
          language,
          errorMessage,
        }),
      });
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFix = () => {
    if (report?.correctedCode) {
      setCode(report.correctedCode);
    }
  };

  const lines = code.split('\n');
  const errorLines = report?.problematicLines || [6];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
            <Bug className="h-3.5 w-3.5" />
            <span>AI Code Debugger &amp; Static Analyzer</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Detect, Diagnose &amp; Fix Bugs
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Pro IDE static analysis: pinpoints error lines, reveals root causes, formats line-by-line diffs, and offers viva exam prevention tips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#0B1026] px-3.5 py-2 text-xs font-bold text-white focus:border-[#4F8CFF] focus:outline-none"
          >
            <option value="c">C Language</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>

          {report && (
            <button
              onClick={() => {
                setReport(null);
                setErrorMessage('');
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#151D36] px-3 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Thinking State */}
      {isLoading && <AiThinkingLoader title="Analyzing Abstract Syntax Tree &amp; Runtime Logic" />}

      {/* Editor & Diagnostics Split */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Code Input IDE View */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Source Code Under Inspection
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  🔴 Error
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  🟡 Warning
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  🟢 Fixed
                </span>
              </div>
            </div>

            {/* Code Input Area with Gutter */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#060A1A] font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0B1026]/90 px-4 py-2 text-[11px] text-[#94A3B8]">
                <span>input_test.{language}</span>
                <button
                  onClick={() => setCode('')}
                  className="hover:text-white transition-colors"
                >
                  Clear Editor
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto p-3">
                <table className="w-full border-collapse">
                  <tbody>
                    {lines.map((line, idx) => {
                      const lineNum = idx + 1;
                      const isError = report && errorLines.includes(lineNum);
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isError
                              ? 'bg-rose-500/15 border-l-2 border-rose-500'
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="w-10 select-none pr-3 text-right font-mono text-[11px] text-[#94A3B8]/40">
                            {isError ? '🔴 ' : ''}
                            {lineNum}
                          </td>
                          <td className="whitespace-pre font-mono text-white text-xs">
                            {line || ' '}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/10 bg-[#0B1026]/60 p-2">
                <textarea
                  rows={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Or paste code here to edit directly..."
                  className="w-full bg-transparent p-2 text-xs font-mono text-[#22D3EE] focus:outline-none placeholder-[#94A3B8]/40 resize-none"
                />
              </div>
            </div>

            {/* Optional Compiler Error message input */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8]">
                Compiler / Runtime Terminal Error Message (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. error: expected ';' before 'for' or segmentation fault"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B1026] p-3 text-xs text-white focus:border-[#4F8CFF] focus:outline-none font-mono"
              />
            </div>

            {/* Action button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleDebug}
                disabled={isLoading || !code.trim()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-rose-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Bug className="h-4 w-4" />
                <span>Run AI Diagnosis &amp; Fix</span>
              </button>
            </div>
          </div>

          {/* Right: Diagnosis & Fix Panels */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Diagnosis &amp; Fix Report
              </h3>
              {report && (
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                  AST Analyzed
                </span>
              )}
            </div>

            {report ? (
              <div className="space-y-4">
                {/* 1. Identified Errors Panel */}
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-300">🔴 Identified Error:</span>
                        <span className="text-xs font-bold text-white">{report.errorType || 'Syntax Error'}</span>
                      </div>
                      {report.problematicLines && report.problematicLines.length > 0 && (
                        <p className="mt-1 text-[11px] font-mono text-[#94A3B8]">
                          Triggered on: <span className="text-rose-400 font-bold">Line {report.problematicLines.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Why It Happened Panel */}
                <div className="rounded-2xl border border-white/10 bg-[#0B1026]/70 p-4 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-[#22D3EE]" />
                    Root Cause Diagnosis (Why it happened)
                  </h4>
                  <p className="text-xs leading-relaxed text-[#94A3B8]">
                    {report.explanation}
                  </p>
                </div>

                {/* 3. Fixed Code Panel */}
                {report.correctedCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        🟢 Corrected &amp; Optimized Source
                      </h4>
                      <button
                        onClick={handleApplyFix}
                        className="text-xs font-bold text-[#4F8CFF] hover:underline"
                      >
                        Apply to Editor ↺
                      </button>
                    </div>

                    <CodeEditor
                      code={report.correctedCode}
                      language={language}
                      title="fixed_solution.c"
                      height="max-h-56"
                    />
                  </div>
                )}

                {/* 4. Exam & Viva Prevention Tips */}
                {report.preventionTip && (
                  <div className="rounded-2xl border border-[#4F8CFF]/20 bg-[#4F8CFF]/10 p-4">
                    <div className="flex items-center gap-2 text-white">
                      <Lightbulb className="h-4 w-4 text-[#22D3EE]" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                        Exam &amp; Viva Prevention Tip
                      </h5>
                    </div>
                    <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed">
                      {report.preventionTip}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[#94A3B8]">
                  <Code2 className="h-7 w-7 text-[#4F8CFF]" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-white">
                  Awaiting Code Diagnostics
                </h4>
                <p className="mt-1.5 max-w-xs text-xs text-[#94A3B8]">
                  Click &quot;Run AI Diagnosis &amp; Fix&quot; to inspect code for missing semicolons, improper format specifiers, buffer overruns, and logic anomalies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
