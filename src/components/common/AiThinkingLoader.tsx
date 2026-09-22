import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, BookOpen, Search, Zap } from 'lucide-react';

interface AiThinkingLoaderProps {
  customStages?: string[];
  title?: string;
}

const defaultStages = [
  { text: 'Understanding your question...', icon: Sparkles, color: 'text-[#4F8CFF]' },
  { text: 'Checking your learning level & course...', icon: Brain, color: 'text-[#8B5CF6]' },
  { text: 'Matching your university syllabus...', icon: BookOpen, color: 'text-[#22D3EE]' },
  { text: 'Analyzing your academic requirements...', icon: Search, color: 'text-[#F59E0B]' },
  { text: 'Generating your personalized solution...', icon: Zap, color: 'text-[#22C55E]' },
];

export const AiThinkingLoader: React.FC<AiThinkingLoaderProps> = ({
  title = 'CodeMate AI Neural Engine Processing',
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev + 1) % defaultStages.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const stage = defaultStages[currentStageIdx];
  const Icon = stage.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#4F8CFF]/30 bg-gradient-to-b from-[#0B1026] via-[#11182D] to-[#0B1026] p-8 shadow-2xl backdrop-blur-2xl text-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4F8CFF]/10 via-[#8B5CF6]/15 to-[#22D3EE]/10 blur-3xl pointer-events-none" />

      {/* Central Pulsing AI Core */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Orbiting rings */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#4F8CFF]/40 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute -inset-2 rounded-full border border-[#8B5CF6]/30 animate-pulse" />
          
          {/* Inner Glowing Orb */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] text-white shadow-xl shadow-blue-500/30">
            <Icon className={`h-7 w-7 ${stage.color} animate-bounce`} />
          </div>
        </div>

        {/* Title */}
        <h4 className="mt-6 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
          {title}
        </h4>

        {/* Dynamic AI Thinking State */}
        <p className="mt-2 text-base font-extrabold text-white transition-all duration-300">
          {stage.text}
        </p>

        {/* Step dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {defaultStages.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStageIdx
                  ? 'w-6 bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6]'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
