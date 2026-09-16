import React, { useState } from 'react';
import { QUESTION_BANK } from '../data/questionBankData';
import { QuestionItem } from '../types/physics';
import {
  Search,
  Filter,
  Bookmark,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface QuestionBankViewProps {
  bookmarkedIds?: string[];
  onToggleBookmark?: (qId: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  bookmarkedIds = [],
  onToggleBookmark,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [marksFilter, setMarksFilter] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (onlyBookmarked && !bookmarkedIds.includes(q.id)) return false;
    if (chapterFilter !== 'all' && q.chapterId !== chapterFilter) return false;
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    if (difficultyFilter !== 'all' && q.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
    if (marksFilter !== 'all' && q.marks.toString() !== marksFilter) return false;

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchQ = q.question.toLowerCase().includes(term);
      const matchConcept = q.concept.toLowerCase().includes(term);
      const matchAns = q.answer.toLowerCase().includes(term);
      return matchQ || matchConcept || matchAns;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
          Curated Repository
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          CBSE Class 10 Physics Question Bank
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-3xl">
          Comprehensive collection of MCQs, Assertion-Reason questions, Numericals, Short Answers, and Case-Based competency questions aligned with the latest CBSE board exam pattern.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search questions by keywords, formulas, or concepts (e.g., 'focal length', 'refraction', 'Ohm', 'fuse')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {/* Chapter Filter */}
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">All Chapters</option>
            <option value="light">Light</option>
            <option value="human-eye">Human Eye</option>
            <option value="electricity">Electricity</option>
            <option value="magnetism">Magnetism</option>
          </select>

          {/* Question Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">All Types</option>
            <option value="MCQ">MCQ (1 Mark)</option>
            <option value="Assertion-Reason">Assertion-Reason</option>
            <option value="Short Answer">Short Answer (2-3M)</option>
            <option value="Long Answer">Long Answer (5M)</option>
            <option value="Numerical">Numerical</option>
            <option value="Case-Based">Case-Based (4M)</option>
          </select>

          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="board-level">Board-Level</option>
          </select>

          {/* Marks */}
          <select
            value={marksFilter}
            onChange={(e) => setMarksFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">All Marks</option>
            <option value="1">1 Mark</option>
            <option value="2">2 Marks</option>
            <option value="3">3 Marks</option>
            <option value="4">4 Marks</option>
            <option value="5">5 Marks</option>
          </select>

          {/* Bookmarks Toggle */}
          <button
            type="button"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition-all ${
              onlyBookmarked
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked ({bookmarkedIds.length})
          </button>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
          <span>Showing {filteredQuestions.length} of {QUESTION_BANK.length} questions</span>
          {(chapterFilter !== 'all' || typeFilter !== 'all' || difficultyFilter !== 'all' || marksFilter !== 'all' || searchTerm !== '' || onlyBookmarked) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setChapterFilter('all');
                setTypeFilter('all');
                setDifficultyFilter('all');
                setMarksFilter('all');
                setOnlyBookmarked(false);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
            No questions match your selected filters. Try resetting the filters above.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isRevealed = revealedAnswers[q.id];
            const isSaved = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {q.difficulty}
                    </span>
                    {q.boardYear && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {q.boardYear}
                      </span>
                    )}
                  </div>

                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'text-amber-500 border-amber-300 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>

                <div className="text-sm sm:text-base text-slate-900 dark:text-white font-medium whitespace-pre-line leading-relaxed">
                  {q.question}
                </div>

                {/* Multiple Choice Options */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Toggle Answer Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => toggleAnswer(q.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {isRevealed ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Hide Model Answer
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> View Model Answer & Step-by-Step Marking Scheme
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Concept: {q.concept}
                  </span>
                </div>

                {/* Model Answer & Explanation Dropdown */}
                {isRevealed && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-3">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Model Answer:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                        {q.answer}
                      </p>
                    </div>

                    {q.explanation && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          CBSE Marking Scheme & Explanation:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed text-xs">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
