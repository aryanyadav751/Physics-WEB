import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, Trophy, Calendar, Check, Info, X } from 'lucide-react';
import { StreakDetails } from '../../utils/progressStorage';

interface StudyStreakBadgeProps {
  streakDetails: StreakDetails;
  onNavigateToPractice?: () => void;
}

export const StudyStreakBadge: React.FC<StudyStreakBadgeProps> = ({
  streakDetails,
  onNavigateToPractice,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const { currentStreak, longestStreak, isTodayActive, last7Days } = streakDetails;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Visual Trigger Button */}
      <button
        type="button"
        id="study-streak-badge-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
          isTodayActive
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 text-orange-600 dark:text-orange-400 border-amber-300 dark:border-amber-700/60 shadow-xs hover:border-orange-400 dark:hover:border-orange-500 hover:scale-[1.02]'
            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        title={`Study Streak: ${currentStreak} consecutive ${currentStreak === 1 ? 'day' : 'days'}. Click for breakdown.`}
      >
        {/* Animated Fire Icon */}
        <span className="relative flex items-center justify-center">
          {isTodayActive && (
            <span className="absolute inset-0 rounded-full bg-orange-400/40 blur-xs animate-ping" />
          )}
          <Flame
            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              isTodayActive
                ? 'text-orange-500 fill-orange-500 animate-pulse'
                : 'text-slate-400'
            }`}
          />
        </span>

        {/* Streak Count Text */}
        <div className="flex items-center gap-1 leading-none font-mono">
          <span className="font-extrabold text-xs sm:text-sm">{currentStreak}</span>
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {currentStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* Status Dot */}
        {isTodayActive && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            title="Active today"
          />
        )}
      </button>

      {/* Interactive Popover Modal Card */}
      {isOpen && (
        <div
          id="study-streak-popover-card"
          className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-88 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">
                  CBSE Study Streak
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Daily Physics Discipline
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hero Streak Count */}
          <div className="my-3 p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/30 dark:to-slate-850 border border-amber-200/80 dark:border-amber-900/40 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Current Run</span>
            </div>
            <div className="text-3xl font-black font-mono text-orange-600 dark:text-orange-400 mt-1">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
              {isTodayActive
                ? '🔥 You have studied today! Your streak is secured.'
                : '⚡ Complete any quiz, simulation, or AI doubt today to protect your streak!'}
            </p>
          </div>

          {/* Last 7 Days Mini Calendar Strip */}
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Recent 7 Days Activity
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Best: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              {last7Days.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {d.label}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      d.isActive
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-400'
                    }`}
                    title={`${d.date}: ${d.isActive ? 'Studied' : 'Inactive'}`}
                  >
                    {d.isActive ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] font-mono">•</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation & CTA */}
          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2 text-[11px] text-blue-800 dark:text-blue-300">
            <Trophy className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Board Exam Tip:</span>
              <span>15 minutes of daily practice beats 5 hours of last-minute cramming.</span>
            </div>
          </div>

          {onNavigateToPractice && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onNavigateToPractice();
              }}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              Start Daily Practice Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
