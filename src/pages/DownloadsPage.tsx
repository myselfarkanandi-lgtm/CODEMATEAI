import React, { useState, useEffect } from 'react';
import { Download, FileDown, CheckCircle2, RefreshCw, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiRequest } from '../lib/api.ts';
import { generateAssignmentPDF } from '../lib/pdf.ts';

export const DownloadsPage: React.FC = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<any[]>('/api/downloads')
      .then((data) => setDownloads(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
          <FileDown className="h-3.5 w-3.5" />
          <span>Export History</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Downloaded Lab Reports
        </h1>
        <p className="mt-1 text-xs text-[#94A3B8]">
          Log of generated university lab practical manuals with algorithms, flowchart logic, code, and test outputs.
        </p>
      </div>

      <div className="space-y-3">
        {downloads.length > 0 ? (
          downloads.map((d) => (
            <div
              key={d.id}
              className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#4F8CFF]/20 bg-[#4F8CFF]/10 text-[#4F8CFF]">
                  <FileDown className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {d.filename}
                  </h4>
                  <p className="text-xs text-[#94A3B8] flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(d.downloaded_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(d.downloaded_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  generateAssignmentPDF(
                    {
                      id: d.assignment_id,
                      question: d.filename.replace(/_/g, ' ').replace('.pdf', ''),
                      language: 'c',
                      algorithm: ['1. Start execution', '2. Allocate variables', '3. Execute algorithms', '4. Output results', '5. Terminate gracefully'],
                      code: '// Full lab report code archived\n',
                      dryRun: [],
                      expectedOutput: 'Program execution successful.',
                      created_at: d.downloaded_at,
                    },
                    user
                  )
                }
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1026] px-4 py-2.5 text-xs font-bold text-white hover:border-[#4F8CFF]/40 hover:bg-[#151D36] transition-all"
              >
                <Download className="h-4 w-4 text-[#4F8CFF]" />
                <span>Re-download PDF</span>
              </button>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center space-y-2">
            <FileDown className="h-10 w-10 mx-auto text-[#94A3B8]/60" />
            <h4 className="text-sm font-bold text-white">No Exported Reports Yet</h4>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Export any assignment to a university lab manual PDF to see it archived here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
