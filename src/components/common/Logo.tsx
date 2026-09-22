import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
    xl: 'h-14 w-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo: </> + AI Neural Network Node */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1026] via-[#11182D] to-[#151D36] border border-white/10 shadow-lg shadow-blue-500/10 ${iconSizes[size]}`}>
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#4F8CFF]/20 via-[#8B5CF6]/20 to-[#22D3EE]/20 blur-sm pointer-events-none" />
        
        {/* SVG Icon: Fusion of Code brackets & Neural Core */}
        <svg
          viewBox="0 0 40 40"
          className="relative h-3/4 w-3/4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F8CFF" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#4F8CFF" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left bracket < */}
          <path
            d="M13 14L7 20L13 26"
            stroke="url(#logoGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right bracket > */}
          <path
            d="M27 14L33 20L27 26"
            stroke="url(#logoGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forward slash / neural bridge */}
          <path
            d="M22 12L18 28"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Central AI Synapse Core */}
          <circle
            cx="20"
            cy="20"
            r="3.5"
            fill="url(#coreGrad)"
            filter="url(#glowFilter)"
          />
          <circle cx="20" cy="20" r="1.5" fill="#FFFFFF" />

          {/* Neural synaptic nodes */}
          <circle cx="12" cy="12" r="1.5" fill="#4F8CFF" fillOpacity="0.9" />
          <circle cx="28" cy="12" r="1.5" fill="#22D3EE" fillOpacity="0.9" />
          <circle cx="12" cy="28" r="1.5" fill="#8B5CF6" fillOpacity="0.9" />
          <circle cx="28" cy="28" r="1.5" fill="#A78BFA" fillOpacity="0.9" />

          {/* Micro connecting lines */}
          <line x1="12" y1="12" x2="18" y2="18" stroke="#4F8CFF" strokeWidth="0.8" strokeDasharray="1 1" strokeOpacity="0.6" />
          <line x1="28" y1="12" x2="22" y2="18" stroke="#22D3EE" strokeWidth="0.8" strokeDasharray="1 1" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            CODEMATE
          </span>
          <span className="rounded-md bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-blue-500/30">
            AI
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] font-medium tracking-tight text-[#94A3B8]">
            Personalized Coding &amp; Assignment Assistant
          </p>
        )}
        {showTagline && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4F8CFF]">
            Solve. Learn. Practice. Improve.
          </p>
        )}
      </div>
    </div>
  );
};
