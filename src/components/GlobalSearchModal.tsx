import React, { useState, useEffect } from 'react';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { SIMULATIONS_LIST } from '../data/simulationsData';
import { DIAGRAMS_DATA } from '../data/diagramsData';
import { QUESTION_BANK } from '../data/questionBankData';
import { CORE_PHYSICS_DEFINITIONS } from '../data/flashcardsData';
import {
  Search,
  X,
  BookOpen,
  FlaskConical,
  Calculator,
  Eye,
  HelpCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle logic handled by parent or shortcut
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Chapters & Topics
  const topicResults = trimmed
    ? Object.values(CHAPTERS_DATA).flatMap((ch) =>
        ch.topics
          .filter((t) => t.title.toLowerCase().includes(trimmed) || t.summary.toLowerCase().includes(trimmed))
          .map((t) => ({ type: 'topic', title: t.title, subtitle: `Chapter: ${ch.title}`, chId: ch.id, topicId: t.id }))
      )
    : [];

  // Search Simulations
  const simResults = trimmed
    ? SIMULATIONS_LIST.filter(
        (s) => s.title.toLowerCase().includes(trimmed) || s.aim.toLowerCase().includes(trimmed)
      ).map((s) => ({ type: 'simulation', title: s.title, subtitle: `Virtual Lab • ${s.category}`, simId: s.id }))
    : [];

  // Search Formulas
  const formulaResults = trimmed
    ? Object.values(CHAPTERS_DATA).flatMap((ch) =>
        ch.formulas
          .filter((f) => f.name.toLowerCase().includes(trimmed) || f.expression.toLowerCase().includes(trimmed))
          .map((f) => ({ type: 'formula', title: f.name, subtitle: `Formula: ${f.expression}`, chId: ch.id }))
      )
    : [];

  // Search Diagrams
  const diagResults = trimmed
    ? DIAGRAMS_DATA.filter((d) => d.title.toLowerCase().includes(trimmed)).map((d) => ({
        type: 'diagram',
        title: d.title,
        subtitle: `Ray Diagram • ${d.category}`,
        diagId: d.id,
      }))
    : [];

  // Search Flashcards & Definitions
  const flashcardResults = trimmed
    ? CORE_PHYSICS_DEFINITIONS.filter(
        (c) =>
          c.term.toLowerCase().includes(trimmed) ||
          c.definition.toLowerCase().includes(trimmed) ||
          (c.formulaOrUnit && c.formulaOrUnit.toLowerCase().includes(trimmed))
      ).map((c) => ({
        type: 'flashcard',
        title: c.term,
        subtitle: `Flashcard Definition • ${c.chapterName} (${c.category})`,
        cardId: c.id,
      }))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, formulas, virtual experiments, diagrams (e.g. 'focal length', 'Ohm', 'prism')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-slate-900 dark:text-white text-base focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-1">
          {!trimmed && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Type anything to quickly navigate to CBSE topics, formulas, virtual labs, or diagrams...
            </div>
          )}

          {trimmed && topicResults.length === 0 && simResults.length === 0 && formulaResults.length === 0 && diagResults.length === 0 && flashcardResults.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No results found for "{query}". Try searching for 'refraction', 'resistance', 'lens', or 'motor'.
            </div>
          )}

          {/* Topics */}
          {topicResults.slice(0, 4).map((r, i) => (
            <button
              key={`t-${i}`}
              type="button"
              onClick={() => {
                onNavigate('chapter', r.chId);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</div>
                  <div className="text-slate-500">{r.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          {/* Simulations */}
          {simResults.slice(0, 3).map((r, i) => (
            <button
              key={`s-${i}`}
              type="button"
              onClick={() => {
                onNavigate('simulations', r.simId);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</div>
                  <div className="text-slate-500">{r.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          {/* Formulas */}
          {formulaResults.slice(0, 3).map((r, i) => (
            <button
              key={`f-${i}`}
              type="button"
              onClick={() => {
                onNavigate('formulas');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</div>
                  <div className="text-slate-500 font-mono">{r.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          {/* Diagrams */}
          {diagResults.slice(0, 3).map((r, i) => (
            <button
              key={`d-${i}`}
              type="button"
              onClick={() => {
                onNavigate('diagrams');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</div>
                  <div className="text-slate-500">{r.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          {/* Flashcards */}
          {flashcardResults.slice(0, 4).map((r, i) => (
            <button
              key={`fc-${i}`}
              type="button"
              onClick={() => {
                onNavigate('flashcards');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</div>
                  <div className="text-slate-500">{r.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
