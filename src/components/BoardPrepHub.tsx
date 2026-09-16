import React, { useState } from 'react';
import { REVISION_DECKS, COMMON_MISTAKES, CASE_STUDIES } from '../data/boardPrepData';
import { CHAPTERS_DATA } from '../data/chaptersData';
import {
  FileText,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
} from 'lucide-react';

export const BoardPrepHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mistakes' | 'case-studies' | 'master-sheet'>('flashcards');
  const [expandedCaseStudy, setExpandedCaseStudy] = useState<Record<string, boolean>>({ 'cs-1': true });

  const toggleCase = (id: string) => {
    setExpandedCaseStudy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Collect all formulas from all chapters for the Master Formula Sheet
  const allFormulas = Object.values(CHAPTERS_DATA).flatMap((ch) =>
    ch.formulas.map((f) => ({ ...f, chapterTitle: ch.title }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
          CBSE Board Exam 2025–2026
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Board Examination Mastery Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-3xl">
          Last-minute revision tools: 5-minute chapter cheat sheets, examiner warning notes on common student blunders, Section E Case-Based competency questions, and complete master formula reference.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {[
            { id: 'flashcards', label: '5-Minute Revision Sheets (4)', icon: Sparkles },
            { id: 'mistakes', label: 'Common Pitfalls & Blunders (5)', icon: AlertTriangle },
            { id: 'case-studies', label: 'Section E Case-Based Questions (4M)', icon: FileText },
            { id: 'master-sheet', label: 'Master Formula Reference', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: 5-Minute Quick Revision Decks */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVISION_DECKS.map((deck) => (
            <div
              key={deck.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {deck.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
                  Quick Deck
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Must-Remember Bullet Points
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {deck.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> High-Probability Board Alerts:
                </span>
                {deck.boardAlerts.map((al, idx) => (
                  <p key={idx} className="text-xs text-amber-900 dark:text-amber-200">
                    ⚠️ {al}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Common Pitfalls & Mistakes */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
            <strong>CBSE Chief Examiner Report: </strong>
            Over 35% of lost marks in Class 10 Science physics sections are caused by standard sign convention blunders, missing ray diagram arrows, or wrong unit conversions. Study these five common mistakes carefully.
          </div>

          <div className="space-y-4">
            {COMMON_MISTAKES.map((mis, idx) => (
              <div
                key={mis.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 text-xs font-bold font-mono flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {mis.topic}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                    <strong className="text-rose-600 dark:text-rose-400 block font-bold text-xs uppercase tracking-wider">
                      ❌ Common Student Blunder:
                    </strong>
                    <p className="leading-relaxed">{mis.incorrectApproach}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <strong className="text-emerald-600 dark:text-emerald-400 block font-bold text-xs uppercase tracking-wider">
                      ✅ Correct CBSE Examination Method:
                    </strong>
                    <p className="leading-relaxed">{mis.correctApproach}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <strong>Examiner Guidance: </strong> {mis.examinerComment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Case-Based Competency Questions (Section E) */}
      {activeTab === 'case-studies' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
            <strong>Section E Format: </strong>
            The CBSE Board Examination includes 4-mark case-based integrated assessment units containing sub-questions of 1 or 2 marks with internal choices.
          </div>

          <div className="space-y-6">
            {CASE_STUDIES.map((cs) => {
              const isOpen = expandedCaseStudy[cs.id];
              return (
                <div
                  key={cs.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                        Section E • 4 Marks
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {cs.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCase(cs.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isOpen ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Case Context Passage */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{cs.caseText}"
                  </div>

                  {/* Sub-Questions */}
                  {isOpen && (
                    <div className="space-y-4 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Case Questions & CBSE Marking Scheme
                      </span>

                      {cs.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2 font-semibold text-slate-900 dark:text-white">
                            <span>
                              {q.qNum} {q.question}
                            </span>
                            <span className="font-mono text-blue-600 dark:text-blue-400 shrink-0">
                              ({q.marks} Mark{q.marks > 1 ? 's' : ''})
                            </span>
                          </div>

                          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                            <strong className="text-emerald-600 dark:text-emerald-400 block font-bold">
                              Model Answer:
                            </strong>
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                              {q.answer}
                            </p>
                            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 font-mono">
                              <strong>Marking Criteria: </strong> {q.markingScheme}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Master Formula Sheet */}
      {activeTab === 'master-sheet' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
            <strong>All Class 10 Formulas in One Place: </strong>
            Quickly reference every mathematical equation across Light and Electricity with SI units, conditions, and variable definitions.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFormulas.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    {form.chapterTitle}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    Unit: {form.variables.map((v) => v.unit).filter(Boolean)[0] || 'SI Units'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {form.name}
                </h4>

                <div className="p-2.5 bg-slate-900 text-amber-300 font-mono text-center font-bold text-base rounded-lg border border-slate-800">
                  {form.expression}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Use Case: </strong> {form.whenToUse}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
