import React, { useState, useMemo } from 'react';
import { QUESTION_BANK } from '../data/questionBankData';
import { QuestionItem } from '../types/physics';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Flame,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface DailyChallengeProps {
  completedHistory?: Array<{ date: string; score: number; total: number }>;
  onComplete?: (attempt: { date: string; score: number; total: number }) => void;
  onNavigateBank?: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  completedHistory = [],
  onComplete,
  onNavigateBank,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Check if student already completed today's challenge
  const todayCompleted = completedHistory.find((c) => c.date === todayKey);

  // Pick 5 questions deterministically for today's date
  const dailyQuestions = useMemo(() => {
    // Simple hash of date string
    let hash = 0;
    for (let i = 0; i < todayKey.length; i++) {
      hash = (hash << 5) - hash + todayKey.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    // Pick 5 MCQ/short questions across chapters
    const mcqQuestions = QUESTION_BANK.filter((q) => q.options && q.options.length > 0);
    const pool = mcqQuestions.length > 0 ? mcqQuestions : QUESTION_BANK;

    const selected: QuestionItem[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < 5; i++) {
      const idx = (absHash + i * 7) % pool.length;
      let pickIdx = idx;
      while (usedIndices.has(pickIdx)) {
        pickIdx = (pickIdx + 1) % pool.length;
      }
      usedIndices.add(pickIdx);
      selected.push(pool[pickIdx]);
    }

    return selected;
  }, [todayKey]);

  // Current question index in active session
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(!!todayCompleted);
  const [finalScore, setFinalScore] = useState<number>(todayCompleted ? todayCompleted.score : 0);

  const currentQ = dailyQuestions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < dailyQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let score = 0;
      dailyQuestions.forEach((q, idx) => {
        const studentChoice = idx === currentIndex ? selectedOption : userAnswers[idx];
        if (studentChoice === q.correctOptionIndex) {
          score++;
        }
      });

      setFinalScore(score);
      setSessionCompleted(true);
      onComplete?.({
        date: todayKey,
        score,
        total: dailyQuestions.length,
      });
    }
  };

  const streakDays = completedHistory.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200/60 dark:border-amber-800/60">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Daily CBSE Physics Challenge</span>
            <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-full font-mono">
              5 Questions
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Sharpen Your Board Exam Instincts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            5 randomized daily questions across Light, Human Eye, Electricity, and Magnetism.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{todayFormatted}</span>
          </div>
          {streakDays > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streakDays} Day Streak</span>
            </div>
          )}
        </div>
      </div>

      {/* State: Completed today */}
      {sessionCompleted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-2xl shadow-xs">
            🎉
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Today's Challenge Completed!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You scored <strong className="text-blue-600 dark:text-blue-400 font-mono text-base">{finalScore} / {dailyQuestions.length}</strong> on today's CBSE questions.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSessionCompleted(false);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswerSubmitted(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Today's Set
            </button>
            {onNavigateBank && (
              <button
                type="button"
                onClick={onNavigateBank}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                Browse Full Question Bank <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* State: Active Question Solving */
        <div className="py-6 space-y-6">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
              Question {currentIndex + 1} of {dailyQuestions.length}
            </span>
            <div className="flex items-center gap-1">
              {dailyQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-1.5 rounded-full transition-colors ${
                    idx === currentIndex
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : idx < currentIndex
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {currentQ.chapterId.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                {currentQ.marks} Mark{currentQ.marks > 1 ? 's' : ''}
              </span>
              {currentQ.boardYear && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-semibold">
                  ★ {currentQ.boardYear}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          {currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = currentQ.correctOptionIndex === optIdx;

                let borderClass = 'border-slate-200 dark:border-slate-800 hover:border-blue-400';
                let bgClass = 'bg-white dark:bg-slate-900/60';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    borderClass = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                  }
                } else if (isSelected) {
                  borderClass = 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${borderClass} ${bgClass}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 font-mono text-[11px]">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation reveal upon submission */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2 animate-fadeIn">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>CBSE Solution & Concept Explanation:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation || currentQ.answer}
              </p>
              {currentQ.formulaUsed && (
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                  Formula: {currentQ.formulaUsed}
                </div>
              )}
            </div>
          )}

          {/* Action Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                {currentIndex < dailyQuestions.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
