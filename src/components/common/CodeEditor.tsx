import React, { useState } from 'react';
import {
  Copy,
  Check,
  Play,
  Sparkles,
  HelpCircle,
  Bug,
  Code2,
  Terminal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CodeEditorProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (val: string) => void;
  title?: string;
  height?: string;
  onRun?: () => void;
  onExplain?: () => void;
  onDebug?: () => void;
  isAiAnalyzed?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'c',
  readOnly = true,
  onChange,
  title,
  height = 'max-h-96',
  onRun,
  onExplain,
  onDebug,
  isAiAnalyzed = true,
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  // Simple token highlight regex helper for academic languages
  const formatSyntax = (lineText: string) => {
    // Basic highlight keywords
    const keywords = /\b(int|float|char|double|void|return|if|else|for|while|do|switch|case|break|continue|struct|typedef|include|printf|scanf|cout|cin|import|def|class|const|let|var)\b/g;
    const comments = /(\/\/.*|\/\*.*\*\/|#.*)/g;

    if (lineText.trim().startsWith('//') || lineText.trim().startsWith('#')) {
      return <span className="text-[#94A3B8]/70 italic">{lineText}</span>;
    }

    return (
      <span>
        {lineText.split(keywords).map((token, i) => {
          if (keywords.test(token)) {
            return (
              <span key={i} className="text-[#4F8CFF] font-semibold">
                {token}
              </span>
            );
          }
          if (token.includes('"') || token.includes("'")) {
            return (
              <span key={i} className="text-[#22D3EE]">
                {token}
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#060A1A] font-mono text-xs shadow-2xl backdrop-blur-xl">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0B1026]/90 px-4 py-3">
        {/* Left window indicators & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 shadow-sm" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-sm" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-sm" />
          </div>

          <span className="font-mono text-xs font-semibold text-white/90">
            {title || `solution.${language}`}
          </span>

          <span className="rounded-md border border-white/10 bg-[#151D36] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4F8CFF]">
            {language}
          </span>

          {/* AI Analyzed badge */}
          {isAiAnalyzed && (
            <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#22D3EE]">
              <Sparkles className="h-3 w-3" />
              <span>AI Verified</span>
            </div>
          )}
        </div>

        {/* Right Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>Run / Trace</span>
            </button>
          )}

          {onExplain ? (
            <button
              onClick={onExplain}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#151D36] px-2.5 py-1.5 text-[11px] font-medium text-[#A78BFA] hover:border-[#8B5CF6]/50 hover:text-white"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span className="hidden sm:inline">Explain</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/doubt-solver?code=${encodeURIComponent(code)}`)}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#151D36] px-2.5 py-1.5 text-[11px] font-medium text-[#A78BFA] hover:border-[#8B5CF6]/50 hover:text-white"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span className="hidden sm:inline">Explain</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onDebug) onDebug();
              else navigate(`/debugger?code=${encodeURIComponent(code)}&lang=${language}`);
            }}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#151D36] px-2.5 py-1.5 text-[11px] font-medium text-rose-300 hover:border-rose-500/50 hover:text-rose-200"
          >
            <Bug className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">Debug</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#151D36] px-3 py-1.5 text-[11px] font-medium text-[#94A3B8] transition-all hover:border-white/20 hover:text-white"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Gutter */}
      {readOnly ? (
        <div className={`overflow-x-auto p-4 leading-relaxed text-[#F8FAFC] ${height}`}>
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="w-12 select-none pr-4 text-right font-mono text-[11px] text-[#94A3B8]/40">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-[#F8FAFC] tracking-wide">
                    {formatSyntax(line) || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <textarea
          value={code}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full resize-y bg-transparent p-4 font-mono leading-relaxed text-[#F8FAFC] focus:outline-none ${height}`}
          spellCheck={false}
        />
      )}
    </div>
  );
};
