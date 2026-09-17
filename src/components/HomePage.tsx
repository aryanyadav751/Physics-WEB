import React from 'react';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { SIMULATIONS_LIST } from '../data/simulationsData';
import { DailyChallenge } from './DailyChallenge';
import {
  Atom,
  BookOpen,
  FlaskConical,
  Sparkles,
  HelpCircle,
  Calculator,
  Eye,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, subId?: string) => void;
  completedTopics: string[];
  dailyChallengeHistory?: Array<{ date: string; score: number; total: number }>;
  onCompleteDailyChallenge?: (attempt: { date: string; score: number; total: number }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  completedTopics,
  dailyChallengeHistory = [],
  onCompleteDailyChallenge,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            CBSE Class 10 Board Exam Edition 2025–2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Understand Physics. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Visualize Concepts.
            </span>{' '}
            Master CBSE.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The complete interactive virtual physics laboratory and revision platform. Ray tracing benches, live circuit builders,
            step-by-step formula solvers, and AI-guided doubt solving for scoring 95%+ in CBSE Science.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('simulations')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" /> Open Virtual Lab (7 Experiments)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              Take CBSE Practice Test <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">4 Chapters</div>
              <div className="text-xs font-semibold text-slate-500">100% NCERT Syllabus</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">7 Virtual Labs</div>
              <div className="text-xs font-semibold text-slate-500">Interactive Simulations</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">25+ Marks</div>
              <div className="text-xs font-semibold text-slate-500">Physics Board Weightage</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">Enjoy Physics AI</div>
              <div className="text-xs font-semibold text-slate-500">24/7 CBSE Physics Tutor</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAILY CHALLENGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DailyChallenge
          completedHistory={dailyChallengeHistory}
          onComplete={onCompleteDailyChallenge}
          onNavigateBank={() => onNavigate('question-bank')}
        />
      </section>

      {/* 3. CBSE SYLLABUS CHAPTER CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              Core Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              CBSE Class 10 Physics Syllabus Chapters
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Select any chapter to access in-depth notes, ray tracing simulations, formula decks, and NCERT numericals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(CHAPTERS_DATA).map((ch) => {
            const completedCount = ch.topics.filter((t) => completedTopics.includes(t.id)).length;
            const percent = Math.round((completedCount / (ch.topics.length || 1)) * 100);

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      Chapter {ch.number}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      Weightage: {ch.weightageInBoard}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {ch.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {ch.overview}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{ch.topics.length}</strong> Topics
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{ch.formulas.length}</strong> Formulas
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{ch.numericals.length}</strong> Numericals
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{percent}% Done</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('chapter', ch.id)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open Chapter <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. VIRTUAL LAB SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden space-y-8">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <FlaskConical className="w-3.5 h-3.5" /> Discover Lab • 7 Virtual Physics Experiments
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hands-on Virtual Physics Apparatus at Your Fingertips
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Don't just memorize formulas. Move the candle on the optical bench, watch real-time refracted rays bend in a glass slab,
              adjust potential difference to plot Ohm's Law V-I curves, and observe Fleming's Left-Hand Rule in an electric motor!
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('simulations')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                Launch Discover Lab <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini preview grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-4 border-t border-slate-800">
            {SIMULATIONS_LIST.slice(0, 4).map((s) => (
              <div
                key={s.id}
                onClick={() => onNavigate('simulations', s.id)}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="text-[10px] text-blue-400 font-mono uppercase">{s.category}</div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors mt-1">
                  {s.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TOOLS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            Ecosystem Features
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered Specifically for CBSE Class 10 Success
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tool 1 */}
          <div
            onClick={() => onNavigate('flashcards')}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-3 shadow-xs relative overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Definition Flashcards
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Active Recall
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Randomize key physics definitions, formulas, and laws. Toggle visibility to test your memory for CBSE boards.
            </p>
          </div>

          {/* Tool 2 */}
          <div
            onClick={() => onNavigate('practice')}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              CBSE Practice & Mock Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Custom timed quizzes, Assertion-Reason questions, instant explanations, and weak-topic diagnostics.
            </p>
          </div>

          {/* Tool 3 */}
          <div
            onClick={() => onNavigate('formulas')}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step-by-Step Formula Calculators
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify your numericals with Cartesian sign conventions, focal lengths, Ohm's law, and resistor networks.
            </p>
          </div>

          {/* Tool 4 */}
          <div
            onClick={() => onNavigate('board-prep')}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Board Strategy & Common Blunders
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chief examiner notes on the 5 common mistakes that cost marks, 5-minute flashcards, and Section E case studies.
            </p>
          </div>
        </div>
      </section>

      {/* 5. AI TUTOR BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 font-mono">
              Never Stay Stuck On a Doubt
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Meet Enjoy Physics AI: Your 24/7 CBSE Physics Mentor
            </h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Trained exclusively on the four CBSE Class 10 Physics chapters. Ask any question, verify sign conventions, or paste tough numerical problems.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ai-tutor')}
            className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" /> Chat with Enjoy Physics AI
          </button>
        </div>
      </section>
    </div>
  );
};
