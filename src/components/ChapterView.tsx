import React, { useState } from 'react';
import { ChapterData } from '../types/physics';
import { QUESTION_BANK } from '../data/questionBankData';
import { REVISION_DECKS, COMMON_MISTAKES } from '../data/boardPrepData';
import { ConcaveConvexMirrorSim } from './simulations/ConcaveConvexMirrorSim';
import { ConvexConcaveLensSim } from './simulations/ConvexConcaveLensSim';
import { GlassSlabSim } from './simulations/GlassSlabSim';
import { PrismDispersionSim } from './simulations/PrismDispersionSim';
import { OhmsLawSim } from './simulations/OhmsLawSim';
import { CircuitBuilderSim } from './simulations/CircuitBuilderSim';
import { MagneticFieldMotorSim } from './simulations/MagneticFieldMotorSim';
import {
  BookOpen,
  Eye,
  Calculator,
  HelpCircle,
  FileCheck,
  AlertOctagon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle2,
  Check,
  Share2,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface ChapterViewProps {
  chapter: ChapterData;
  onSelectTopic?: (topicId: string) => void;
  onNavigateSim?: (simId: string) => void;
  completedTopics?: string[];
  onToggleTopic?: (topicId: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  completedTopics = [],
  onToggleTopic,
  onNavigateSim,
}) => {
  const [activeTab, setActiveTab] = useState<
    'learn' | 'visualize' | 'formulas' | 'definitions' | 'numericals' | 'questions' | 'board-prep'
  >('learn');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(chapter.topics[0]?.id || '');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [numericalDifficulty, setNumericalDifficulty] = useState<string>('all');

  const selectedTopic = chapter.topics.find((t) => t.id === selectedTopicId) || chapter.topics[0];

  const chapterQuestions = QUESTION_BANK.filter((q) => q.chapterId === chapter.id);
  const chapterRevision = REVISION_DECKS.find((r) => r.chapterId === chapter.id);
  const chapterMistakes = COMMON_MISTAKES.filter(
    (m) =>
      m.topic.toLowerCase().includes(chapter.id) ||
      (chapter.id === 'light' && (m.topic.includes('Mirror') || m.topic.includes('Lens'))) ||
      (chapter.id === 'electricity' && (m.topic.includes('Resistance') || m.topic.includes('Wire') || m.topic.includes('Fuse'))) ||
      (chapter.id === 'magnetism' && (m.topic.includes('Solenoid') || m.topic.includes('Fuse')))
  );

  const toggleSolution = (id: string) => {
    setExpandedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = chapter.topics.filter((t) => completedTopics.includes(t.id)).length;
  const progressPercent = Math.round((completedCount / (chapter.topics.length || 1)) * 100);

  // Render relevant chapter simulation
  const renderChapterSimulation = () => {
    if (chapter.id === 'light') return <ConcaveConvexMirrorSim />;
    if (chapter.id === 'human-eye') return <PrismDispersionSim />;
    if (chapter.id === 'electricity') return <OhmsLawSim />;
    if (chapter.id === 'magnetism') return <MagneticFieldMotorSim />;
    return <ConcaveConvexMirrorSim />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Chapter Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono">
                Chapter {chapter.number}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                CBSE Weightage: {chapter.weightageInBoard}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                NCERT Class 10 Science
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {chapter.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {chapter.overview}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[240px] space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Chapter Mastery</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
              <span>{completedCount} of {chapter.topics.length} topics done</span>
              <span>{chapter.formulas.length} Formulas</span>
            </div>
          </div>
        </div>

        {/* 7 Chapter Sub-Tabs Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 dark:border-slate-800 mt-6 pt-4 no-scrollbar">
          {[
            { id: 'learn', label: '1. Learn Concepts', icon: BookOpen },
            { id: 'visualize', label: '2. Virtual Experiment', icon: Eye },
            { id: 'formulas', label: `3. Formulas (${chapter.formulas.length})`, icon: Calculator },
            { id: 'definitions', label: `4. Definitions (${chapter.definitions.length})`, icon: FileCheck },
            { id: 'numericals', label: `5. Numericals (${chapter.numericals.length})`, icon: Sparkles },
            { id: 'questions', label: `6. Board Questions (${chapterQuestions.length})`, icon: HelpCircle },
            { id: 'board-prep', label: '7. Board Exam Strategy', icon: AlertOctagon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: LEARN CONCEPTS (Topic Sidebar + Structured Deep Notes) */}
      {activeTab === 'learn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Topic Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Chapter Syllabus Topics
            </div>
            {chapter.topics.map((t, idx) => {
              const active = t.id === selectedTopic.id;
              const isTopicDone = completedTopics.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    active
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedTopicId(t.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {idx + 1}.
                    </span>
                    <span className={`text-sm font-semibold truncate ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.title}
                    </span>
                  </div>

                  {onToggleTopic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTopic(t.id);
                      }}
                      className={`p-1 rounded-md transition-colors ${
                        isTopicDone
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                          : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                      }`}
                      title={isTopicDone ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Topic Deep Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                    Topic Breakdown
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {selectedTopic.title}
                  </h2>
                </div>

                {onToggleTopic && (
                  <button
                    type="button"
                    onClick={() => onToggleTopic(selectedTopic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      completedTopics.includes(selectedTopic.id)
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {completedTopics.includes(selectedTopic.id) ? 'Completed' : 'Mark Completed'}
                  </button>
                )}
              </div>

              {/* Summary Lead */}
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {selectedTopic.summary}
              </div>

              {/* Core Concept Key Takeaways */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Core Scientific Principles
                </h3>
                <div className="space-y-3">
                  {selectedTopic.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Traps & Examiner Warnings */}
              {selectedTopic.examPitfall && (
                <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-4 h-4" /> CBSE Examiner Caution
                  </div>
                  <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                    {selectedTopic.examPitfall}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIRTUAL EXPERIMENT (Interactive Simulator) */}
      {activeTab === 'visualize' && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Live Interactive Simulation for {chapter.title}
              </span>
            </div>
            {onNavigateSim && (
              <button
                type="button"
                onClick={() => onNavigateSim('sim-concave-mirror')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Open in Full Discover Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>{renderChapterSimulation()}</div>
        </div>
      )}

      {/* TAB 3: FORMULAS HUB */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapter.formulas.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {form.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {form.variables[0]?.unit || 'SI Units'}
                </span>
              </div>

              {/* Math Display Box */}
              <div className="p-3.5 bg-slate-900 text-amber-300 font-mono text-center text-lg font-bold rounded-xl border border-slate-800 shadow-inner">
                {form.expression}
              </div>

              {/* Variables */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Variables & Symbols
                </span>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  {form.variables.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>
                        {v.symbol}: {v.name} ({v.unit})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* When to use */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">When to Use: </strong>
                {form.whenToUse}
              </div>

              {/* Solved Sample Problem */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Model Exam Question:
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  {form.exampleProblem.given}
                </p>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono text-xs whitespace-pre-line leading-relaxed">
                  <strong>Solution: </strong>
                  {form.exampleProblem.calculation}
                  <div className="mt-1 font-bold text-emerald-800 dark:text-emerald-300">
                    Answer: {form.exampleProblem.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: NCERT DEFINITIONS */}
      {activeTab === 'definitions' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/50 text-xs sm:text-sm text-purple-900 dark:text-purple-200">
            <strong>CBSE Class 10 Marking Criteria: </strong>
            Definitions must state precise scientific keywords. Use the exact standard NCERT phrasing below to secure full marks.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.definitions.map((def) => (
              <div
                key={def.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {def.term}
                  </h3>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 font-semibold">
                    1 Mark Standard
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {def.definition}
                </p>

                {def.examNote && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-purple-600 dark:text-purple-400">Examiner Tip: </strong>
                    {def.examNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NUMERICALS WITH STEP-BY-STEP SOLUTIONS */}
      {activeTab === 'numericals' && (
        <div className="space-y-6">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty:</span>
            {['all', 'Easy', 'Medium', 'Hard', 'Board-Level'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setNumericalDifficulty(diff)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  numericalDifficulty.toLowerCase() === diff.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {chapter.numericals
              .filter((num) =>
                numericalDifficulty === 'all' ? true : num.difficulty.toLowerCase() === numericalDifficulty.toLowerCase()
              )
              .map((num) => {
                const isExpanded = expandedSolutions[num.id];
                return (
                  <div
                    key={num.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          num.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : num.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {num.difficulty}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {num.marks} Marks
                        </span>
                      </div>
                      <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                        Formula: {num.formula}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                      {num.question}
                    </p>

                    {/* Toggle Solution Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => toggleSolution(num.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" /> Hide Step-by-Step Marking Solution
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" /> Reveal Full Step-by-Step Marking Solution
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expanded Solution */}
                    {isExpanded && (
                      <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs sm:text-sm">
                        <div>
                          <span className="text-slate-400 block mb-1">Given & Formula:</span>
                          <p className="text-slate-700 dark:text-slate-300">{num.given}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-1">Step-by-step Working:</span>
                          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                            {num.steps}
                          </p>
                        </div>
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 font-bold">
                          Final Answer: {num.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 6: CHAPTER QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curated CBSE Board Questions ({chapterQuestions.length})
            </span>
          </div>

          <div className="space-y-4">
            {chapterQuestions.map((q) => {
              const isAnswerRevealed = expandedSolutions[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                        {q.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {q.marks} Mark{q.marks > 1 ? 's' : ''}
                      </span>
                      {q.boardYear && (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {q.boardYear}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{q.difficulty}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium whitespace-pre-line leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options if MCQ */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span className="font-bold mr-1.5 font-mono">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reveal Answer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => toggleSolution(q.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {isAnswerRevealed ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Hide Model Answer
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Reveal Model Answer & Marking Scheme
                        </>
                      )}
                    </button>
                  </div>

                  {isAnswerRevealed && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-2">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        Answer:
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                        {q.answer}
                      </p>
                      {q.explanation && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                          <strong>Explanation: </strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: BOARD EXAM STRATEGY & PITFALLS */}
      {activeTab === 'board-prep' && (
        <div className="space-y-6">
          {/* 5-Minute Quick Revision Deck */}
          {chapterRevision && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" /> 5-Minute Exam Flashcard
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {chapterRevision.title}
              </h3>

              <div className="space-y-2.5">
                {chapterRevision.keyPoints.map((kp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{kp}</span>
                  </div>
                ))}
              </div>

              {/* Board Alerts */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-1.5">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Important Board Exam Alerts
                </div>
                {chapterRevision.boardAlerts.map((al, idx) => (
                  <p key={idx} className="text-xs text-amber-900 dark:text-amber-200">
                    ⚠️ {al}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes Table */}
          {chapterMistakes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" /> Common Mistakes That Cost Marks in CBSE
              </h3>

              <div className="space-y-3">
                {chapterMistakes.map((mis) => (
                  <div
                    key={mis.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {mis.topic}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                        <strong className="block text-rose-600 dark:text-rose-400 mb-1">❌ Common Student Error:</strong>
                        {mis.incorrectApproach}
                      </div>
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                        <strong className="block text-emerald-600 dark:text-emerald-400 mb-1">✅ Correct Approach:</strong>
                        {mis.correctApproach}
                      </div>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 pt-1">
                      <strong>Examiner Note: </strong> {mis.examinerComment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
