import React from 'react';
import { Atom, BookOpen, FlaskConical, Award, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, subId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Atom className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                Physics Lab <span className="text-blue-600 dark:text-blue-400">10</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Understand Physics. Visualize Concepts. Master CBSE. Complete interactive learning portal for Class 10 Science (Physics) board exams.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Aligned with Latest NCERT Syllabus
            </div>
          </div>

          {/* Chapters Col */}
          <div className="space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
              CBSE Chapters
            </span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('chapter', 'light')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Chapter 9: Light - Reflection & Refraction
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('chapter', 'human-eye')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Chapter 10: Human Eye & Colourful World
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('chapter', 'electricity')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Chapter 11: Electricity & Circuits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('chapter', 'magnetism')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Chapter 12: Magnetic Effects of Current
                </button>
              </li>
            </ul>
          </div>

          {/* Lab & Tools */}
          <div className="space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Virtual Tools & Labs
            </span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulations')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Virtual Experiments (7 Simulations)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('formulas')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Step-by-Step Formula Calculators
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('diagrams')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Ray Diagrams & Label Library
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-tutor')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sir Newton AI Doubt Solver
                </button>
              </li>
            </ul>
          </div>

          {/* Board Exam Prep */}
          <div className="space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Board Examination
            </span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('board-prep')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  5-Minute Chapter Cheat Sheets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('board-prep')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Section E: Case-Based Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('board-prep')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Common Mistakes That Cost Marks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Timed Practice & Mock Tests
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Physics Lab 10. Designed for CBSE Class 10 Board Exam Aspirants.
          </div>
          <div className="flex items-center gap-1">
            Built with rigor for academic excellence in Secondary Science Education.
          </div>
        </div>
      </div>
    </footer>
  );
};
