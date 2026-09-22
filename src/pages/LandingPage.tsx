import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Code2,
  Bug,
  BrainCircuit,
  GraduationCap,
  LineChart,
  CheckCircle2,
  Languages,
  FileDown,
  Terminal,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Logo } from '../components/common/Logo.tsx';
import { Background3D } from '../components/common/Background3D.tsx';
import { Hero3DVisual } from '../components/common/Hero3DVisual.tsx';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, demoLogin } = useAuth();

  const handleDemoStart = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const featureCards = [
    {
      title: 'Assignment Assistant',
      desc: 'Step-by-step algorithms, well-commented university-grade source code, line-by-line dry runs, and sample execution outputs.',
      icon: Code2,
      accent: 'from-[#4F8CFF] to-[#8B5CF6]',
      badge: 'Gemini 3.8 Pro',
    },
    {
      title: 'AI Doubt Solver',
      desc: 'Conversational coding tutor with conceptual breakdowns, interactive code blocks, and dual-language (English & Bengali) explanations.',
      icon: BrainCircuit,
      accent: 'from-[#8B5CF6] to-[#A78BFA]',
      badge: 'Bilingual',
    },
    {
      title: 'Real-Time Code Debugger',
      desc: 'Identifies compiler syntax errors and logic edge-cases, pinpointing the exact line with root cause diagnosis and exam prevention tips.',
      icon: Bug,
      accent: 'from-[#EF4444] to-[#F59E0B]',
      badge: 'IDE Grade',
    },
    {
      title: 'Oral Viva Examiner',
      desc: 'Realistic academic oral defense simulation where the AI examiner tests your understanding and grades clarity, accuracy, and confidence.',
      icon: GraduationCap,
      accent: 'from-[#22D3EE] to-[#4F8CFF]',
      badge: 'Viva Drill',
    },
    {
      title: 'Adaptive Syllabus Practice',
      desc: 'Curriculum-aligned practice drills that automatically step up difficulty from Beginner to Advanced as topic mastery crosses 80%.',
      icon: BookOpen,
      accent: 'from-[#22C55E] to-[#22D3EE]',
      badge: 'Adaptive',
    },
    {
      title: '1-Click Lab Manual PDF',
      desc: 'Generates university-formatted printable lab experiment manuals complete with student credentials, algorithms, tables, and test cases.',
      icon: FileDown,
      accent: 'from-[#A78BFA] to-[#4F8CFF]',
      badge: 'Export Ready',
    },
  ];

  const learningStages = [
    {
      step: '01',
      title: 'Syllabus & Level Matching',
      desc: 'CodeMate AI syncs with your course (e.g. B.Pharm Sem 1 Computer Applications) and calibrates to your skill level.',
      icon: BookOpen,
    },
    {
      step: '02',
      title: 'Algorithmic Problem Solving',
      desc: 'Formulates structured pseudo-code, flow logic, and clean implementations tailored to your university curriculum.',
      icon: Code2,
    },
    {
      step: '03',
      title: 'Execution Trace & Dry Runs',
      desc: 'Visualizes variable state changes step-by-step through iteration tables, ensuring zero conceptual blind spots.',
      icon: Terminal,
    },
    {
      step: '04',
      title: 'Instant Error Debugging',
      desc: 'Finds syntax quirks and runtime errors with clear plain-language explanations of why they occurred and how to fix them.',
      icon: Bug,
    },
    {
      step: '05',
      title: 'Oral Viva Defense',
      desc: 'Prepares you for the toughest examiner queries with personalized questions and sample high-scoring answers.',
      icon: GraduationCap,
    },
    {
      step: '06',
      title: 'Weak Concept Remediation',
      desc: 'Identifies low-accuracy topics (e.g. Arrays 54% vs Operators 91%) and serves targeted remediation drills.',
      icon: LineChart,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] overflow-x-hidden">
      {/* 3D WebGL Background */}
      <Background3D opacity={0.7} interactive={true} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[#0B1026]/80 px-6 backdrop-blur-2xl sm:px-10">
        <Logo size="md" showTagline={false} />

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Gemini AI Status Indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-[#151D36]/80 px-3 py-1.5 text-xs text-[#94A3B8] md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
            </span>
            <span className="text-white font-medium">Gemini 3.8 Flash</span>
          </div>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <span>Go to Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#94A3B8] transition-colors hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={handleDemoStart}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                <span>Demo (Arka Nandi)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 pb-24 sm:pt-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Headings & CTA */}
            <div className="text-center lg:col-span-7 lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3.5 py-1.5 text-xs font-semibold text-[#A78BFA] shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
                <span>Next-Gen Academic AI SaaS for Engineering &amp; Science</span>
              </div>

              {/* Main Heading */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
                Your Personal <br />
                <span className="bg-gradient-to-r from-[#4F8CFF] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                  AI Coding Tutor
                </span>
              </h1>

              {/* Subheading / Tagline */}
              <p className="mt-4 text-lg font-bold tracking-wide text-[#22D3EE] uppercase sm:text-xl">
                Solve. Learn. Practice. Improve.
              </p>

              <p className="mt-4 text-base leading-relaxed text-[#94A3B8] sm:text-lg max-w-2xl">
                Built specifically for college students and lab practicals. CodeMate AI pairs deep course curriculum alignment with interactive dry-run traces, instant code debugging, oral viva preparation, and printable university-ready lab reports.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <button
                  onClick={handleDemoStart}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
                >
                  <span>Launch Interactive Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#151D36]/80 px-7 py-4 text-sm font-semibold text-white shadow-md backdrop-blur-xl transition-all hover:border-[#4F8CFF]/40 hover:bg-[#151D36]"
                >
                  <span>Create Student Account</span>
                </button>
              </div>

              {/* Trust & Spec Markers */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8] lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                  <span>Syllabus Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-[#8B5CF6]" />
                  <span>English &amp; Bengali Explanations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileDown className="h-4 w-4 text-[#22D3EE]" />
                  <span>Lab PDF Exporter</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive AI Core */}
            <div className="flex justify-center lg:col-span-5">
              <Hero3DVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Academic Curriculum Alignment */}
      <section className="relative z-10 border-y border-white/10 bg-[#0B1026]/70 py-12 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            Built For Students &amp; Faculty Across Engineering, Pharmacy &amp; Computer Science
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-85">
            {['B.Pharm (Sem 1 Computer Apps)', 'BCA & MCA Programs', 'B.Tech CSE / IT', 'Polytechnic Diploma', 'C & Data Structures', 'Python & Algorithms'].map((curriculum) => (
              <div
                key={curriculum}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#11182D]/80 px-4 py-2 text-xs font-semibold text-[#F8FAFC] shadow-sm"
              >
                <Cpu className="h-3.5 w-3.5 text-[#4F8CFF]" />
                <span>{curriculum}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="relative z-10 py-20 px-6 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3.5 py-1 text-xs font-semibold text-[#A78BFA]">
              Full-Stack Academic SaaS
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Engineered For Deep Coding Mastery
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#94A3B8]">
              Standard chatbots output unverified code without context. CodeMate AI provides the full academic suite: algorithms, dry-run traces, viva prep, and syllabus tracking.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="glass-card group relative rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.accent} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-[#A78BFA]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white group-hover:text-[#4F8CFF] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6-Stage Learning Cycle */}
      <section className="relative z-10 border-t border-white/10 bg-[#0B1026]/80 py-20 px-6 sm:py-28 lg:px-12 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F8CFF]">
              Pedagogical Engine
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              The 6-Stage CodeMate AI Learning Cycle
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#94A3B8]">
              Transforming passive assignment copying into active, deep conceptual mastery.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="relative rounded-2xl border border-white/10 bg-[#151D36]/70 p-6 backdrop-blur-xl transition-all hover:border-[#4F8CFF]/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4F8CFF]/20 to-[#8B5CF6]/20 border border-[#4F8CFF]/30 text-[#4F8CFF]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-sm font-extrabold text-[#4F8CFF]/80">
                      {stage.step}
                    </span>
                  </div>
                  <h4 className="mt-5 text-base font-bold text-white">{stage.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-20 px-6 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#11182D] to-[#0B1026] p-8 sm:p-14 text-center shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F8CFF]/15 via-transparent to-[#8B5CF6]/15 blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Ready to Experience the Future of Coding Education?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#94A3B8]">
            Test CodeMate AI with pre-configured student data, real syllabus topics, dry-run simulation tables, and Gemini 3.8 Flash intelligence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDemoStart}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
            >
              <span>Instant 1-Click Demo Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0B1026] py-10 px-6 text-center text-xs text-[#94A3B8] sm:px-12">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo size="sm" showTagline={false} />
          <p className="text-[11px]">
            CODEMATE AI • AI-Powered Personalized Coding Learning &amp; Assignment Assistant
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#22C55E]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span>All AI Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
