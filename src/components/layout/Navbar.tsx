import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import {
  Atom,
  BookOpen,
  FlaskConical,
  HelpCircle,
  Sparkles,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Award,
  Calculator,
  Eye,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, subId?: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  progressPercent: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  progressPercent,
}) => {
  const [isChaptersOpen, setIsChaptersOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNav = (view: string, subId?: string) => {
    onNavigate(view, subId);
    setIsChaptersOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 transition-colors">
      {/* Top Banner with Bold Attribution */}
      <div className="w-full bg-blue-600 dark:bg-blue-700 text-white py-1.5 px-4 text-center text-xs sm:text-sm shadow-xs">
        <p className="font-bold">
          This website is made by Aryan yadav, a Student of Scale Carrer Institute.
        </p>
      </div>

      <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Physics Lab <span className="text-blue-600 dark:text-blue-400">10</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  CBSE
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wide">
                Understand • Visualize • Master
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            {/* Chapters Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsChaptersOpen(!isChaptersOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'chapter'
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Chapters <ChevronDown className="w-3 h-3" />
              </button>

              {isChaptersOpen && (
                <div
                  onMouseLeave={() => setIsChaptersOpen(false)}
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 animate-fadeIn"
                >
                  {Object.values(CHAPTERS_DATA).map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleNav('chapter', ch.id)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Ch {ch.number}: {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{ch.weightageInBoard} Weightage</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNav('simulations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'simulations'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-blue-500" /> Discover Lab
            </button>

            <button
              type="button"
              onClick={() => handleNav('question-bank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'question-bank'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Question Bank
            </button>

            <button
              type="button"
              onClick={() => handleNav('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'practice'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Practice Engine
            </button>

            <button
              type="button"
              onClick={() => handleNav('board-prep')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'board-prep'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Board Exam Hub
            </button>

            <button
              type="button"
              onClick={() => handleNav('formulas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'formulas'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calculators
            </button>

            <button
              type="button"
              onClick={() => handleNav('diagrams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'diagrams'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Diagrams
            </button>

            <button
              type="button"
              onClick={() => handleNav('ai-tutor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'ai-tutor'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Tutor
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Search everything (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-sans">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Progress Badge Indicator */}
            <button
              type="button"
              onClick={() => handleNav('progress')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold"
              title="View your learning progress"
            >
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-mono">{progressPercent}%</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>

          <div className="py-1 border-t border-b border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Chapters
            </span>
            {Object.values(CHAPTERS_DATA).map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleNav('chapter', ch.id)}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Ch {ch.number}: {ch.title}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleNav('simulations')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            Virtual Discover Lab
          </button>
          <button
            type="button"
            onClick={() => handleNav('question-bank')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
          >
            Question Bank
          </button>
          <button
            type="button"
            onClick={() => handleNav('practice')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
          >
            Practice Engine
          </button>
          <button
            type="button"
            onClick={() => handleNav('board-prep')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50"
          >
            Board Exam Hub
          </button>
          <button
            type="button"
            onClick={() => handleNav('formulas')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
          >
            Formulas & Calculators
          </button>
          <button
            type="button"
            onClick={() => handleNav('diagrams')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
          >
            Diagrams Library
          </button>
          <button
            type="button"
            onClick={() => handleNav('ai-tutor')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50"
          >
            AI Tutor (Sir Newton)
          </button>
          <button
            type="button"
            onClick={() => handleNav('progress')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100"
          >
            Progress & Achievements
          </button>
        </div>
      )}
    </nav>
  </header>
  );
};
