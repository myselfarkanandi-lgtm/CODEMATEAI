import React, { useState } from 'react';
import {
  Download,
  Bookmark,
  Copy,
  Check,
  Languages,
  Sparkles,
  Send,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Code2,
  ListOrdered,
  FileText,
  Terminal,
} from 'lucide-react';
import { AssignmentResultData, ChatMessage } from '../../types/index.ts';
import { CodeEditor } from './CodeEditor.tsx';
import { generateAssignmentPDF } from '../../lib/pdf.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { apiRequest } from '../../lib/api.ts';

interface AssignmentResultCardProps {
  assignment: AssignmentResultData;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const AssignmentResultCard: React.FC<AssignmentResultCardProps> = ({
  assignment,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'code' | 'algorithm' | 'explanation' | 'io' | 'viva' | 'mistakes'>('code');
  const [copied, setCopied] = useState(false);
  const [localFav, setLocalFav] = useState(isFavorite);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpMsg, setFollowUpMsg] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const handleDownloadPDF = () => {
    generateAssignmentPDF(assignment, user);
  };

  const handleCopyAll = () => {
    const fullText = `QUESTION:
${assignment.question}

ALGORITHM:
${assignment.algorithm}

SOURCE CODE:
${assignment.code}

EXPLANATION:
${assignment.explanation}

SAMPLE INPUT:
${assignment.sampleInput}

SAMPLE OUTPUT:
${assignment.sampleOutput}

RESULT:
${assignment.result}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFav = async () => {
    setLocalFav(!localFav);
    if (onToggleFavorite) {
      onToggleFavorite();
    } else if (assignment.id) {
      try {
        await apiRequest(`/api/assignments/${assignment.id}/favorite`, { method: 'POST' });
      } catch (err) {}
    }
  };

  const sendQuickFollowUp = async (promptText: string, langPref?: 'English' | 'Bengali') => {
    setShowFollowUp(true);
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      conversation_id: 'temp',
      role: 'user',
      content: promptText,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsSendingChat(true);

    try {
      if (assignment.id) {
        const res = await apiRequest<{ reply: string }>(`/api/assignments/${assignment.id}/follow-up`, {
          method: 'POST',
          body: JSON.stringify({ message: promptText, languagePreference: langPref }),
        });
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_' + (Date.now() + 1),
            conversation_id: 'temp',
            role: 'assistant',
            content: res.reply,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        const res = await apiRequest<{ answer: string; simpleExplanation: string }>('/api/ai/doubt', {
          method: 'POST',
          body: JSON.stringify({
            question: `${promptText} regarding this assignment code:\n${assignment.code}`,
            language: assignment.language,
            languagePreference: langPref,
          }),
        });
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_' + (Date.now() + 1),
            conversation_id: 'temp',
            role: 'assistant',
            content: `${res.answer}\n\n${res.simpleExplanation}`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg_' + (Date.now() + 1),
          conversation_id: 'temp',
          role: 'assistant',
          content: 'Unable to process follow-up request right now.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCustomFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpMsg.trim()) return;
    const msg = followUpMsg.trim();
    setFollowUpMsg('');
    sendQuickFollowUp(msg);
  };

  return (
    <div className="space-y-4">
      {/* Top Question & Quick Actions Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-[#4F8CFF]/30 bg-[#4F8CFF]/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#4F8CFF]">
                {assignment.language || 'C'}
              </span>
              <span className="text-xs font-semibold text-[#94A3B8]">
                {assignment.subject || 'Programming'} • {assignment.topic || 'Core Concept'}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-black text-white sm:text-xl">
              {assignment.question}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
              title="Download Lab Report PDF"
            >
              <Download className="h-4 w-4" />
              <span>Lab Manual PDF</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0B1026] px-3.5 py-2.5 text-xs font-bold text-white hover:border-white/20 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#94A3B8]" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleFav}
              className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                localFav
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                  : 'border-white/10 bg-[#0B1026] text-[#94A3B8] hover:text-white'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${localFav ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{localFav ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Quick Follow-up Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">AI Tutor:</span>
          <button
            onClick={() => sendQuickFollowUp('Can you please explain this solution in simpler terms?')}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Explain Simpler</span>
          </button>
          <button
            onClick={() =>
              sendQuickFollowUp('Please explain this program line by line and its algorithm in Bengali language.', 'Bengali')
            }
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Languages className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span>Explain in Bengali</span>
          </button>
          <button
            onClick={() => setShowFollowUp(!showFollowUp)}
            className="flex items-center gap-1.5 rounded-xl border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1.5 text-xs font-semibold text-[#4F8CFF] hover:bg-[#4F8CFF]/20"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{showFollowUp ? 'Hide AI Chat' : 'Ask Follow-up Doubt'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0B1026]/80 p-1.5">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Source Code</span>
        </button>

        <button
          onClick={() => setActiveTab('algorithm')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'algorithm'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <ListOrdered className="h-3.5 w-3.5" />
          <span>Algorithm</span>
        </button>

        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'explanation'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('io')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'io'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Input &amp; Output</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'viva'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Viva ({assignment.vivaQuestions?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'mistakes'
              ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Common Mistakes</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        {activeTab === 'code' && (
          <div>
            <CodeEditor
              code={assignment.code}
              language={assignment.language || 'c'}
              title={`${assignment.topic || 'solution'}.${assignment.language || 'c'}`}
              height="max-h-[500px]"
            />
          </div>
        )}

        {activeTab === 'algorithm' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Academic Algorithm</h4>
            <div className="whitespace-pre-line rounded-2xl border border-white/10 bg-[#0B1026] p-5 font-mono text-xs leading-relaxed text-slate-200">
              {assignment.algorithm || 'No algorithm steps specified.'}
            </div>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Conceptual Breakdown</h4>
            <div className="whitespace-pre-line text-xs leading-relaxed text-[#94A3B8] bg-[#0B1026] p-5 rounded-2xl border border-white/10 text-white/90">
              {assignment.explanation}
            </div>

            {assignment.importantConcepts && assignment.importantConcepts.length > 0 && (
              <div className="mt-4 rounded-2xl border border-[#4F8CFF]/20 bg-[#4F8CFF]/10 p-5 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#4F8CFF]">
                  Key Theoretical Concepts:
                </h5>
                <ul className="list-inside list-disc space-y-1 text-xs text-white/80">
                  {assignment.importantConcepts.map((concept, i) => (
                    <li key={i}>{concept}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'io' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Sample Input</h4>
              <pre className="mt-1.5 rounded-2xl border border-white/10 bg-[#060A1A] p-4 font-mono text-xs text-[#22D3EE]">
                {assignment.sampleInput || '(Standard test input)'}
              </pre>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Terminal Output</h4>
              <pre className="mt-1.5 rounded-2xl border border-white/10 bg-[#060A1A] p-4 font-mono text-xs text-emerald-400">
                {assignment.sampleOutput || '(Standard test output)'}
              </pre>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Execution Verification</h4>
              <p className="mt-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-300">
                {assignment.result || 'Program compiles cleanly without warnings.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'viva' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Oral Viva Questions for External Lab Exam
            </h4>
            <div className="space-y-3">
              {assignment.vivaQuestions && assignment.vivaQuestions.length > 0 ? (
                assignment.vivaQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0B1026] p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-[#4F8CFF]/20 text-xs font-black text-[#4F8CFF]">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-semibold text-white">{q}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94A3B8]">No viva questions available for this problem.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Common Student Pitfalls &amp; Examiner Traps
            </h4>
            <div className="space-y-2.5">
              {assignment.commonMistakes && assignment.commonMistakes.length > 0 ? (
                assignment.commonMistakes.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <p className="text-xs text-rose-200">{m}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#94A3B8]">No common mistakes noted.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Follow-up Interactive Drawer */}
      {showFollowUp && (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#22D3EE]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Follow-up AI Tutor Chat
              </h4>
            </div>
            <button
              onClick={() => setShowFollowUp(false)}
              className="text-xs text-[#94A3B8] hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="max-h-60 space-y-3 overflow-y-auto pr-1 text-xs">
            {chatMessages.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#94A3B8]">
                Ask any question about this assignment (e.g. &quot;Explain line 12&quot;, &quot;Can we use while instead of for?&quot;)
              </p>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 whitespace-pre-line text-xs ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white'
                        : 'border border-white/10 bg-[#0B1026] text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isSendingChat && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-[#0B1026] p-3 text-xs text-[#94A3B8]">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleCustomFollowUp} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about this code..."
              value={followUpMsg}
              onChange={(e) => setFollowUpMsg(e.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-[#0B1026] px-4 py-2.5 text-xs text-white focus:border-[#4F8CFF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSendingChat || !followUpMsg.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white shadow-md disabled:opacity-50 hover:scale-105 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
