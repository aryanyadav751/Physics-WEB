import React, { useState } from 'react';
import { UserProgress } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { SIMULATIONS_LIST } from '../data/simulationsData';
import { computeStudyBadges, getTotalBadgeXP, StudyBadge } from '../utils/studyBadges';
import { getStreakDetails } from '../utils/progressStorage';
import { ProgressTrendChart } from './ProgressTrendChart';
import { StudyPlanner } from './StudyPlanner';
import {
  Award,
  CheckCircle2,
  Clock,
  Target,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  FlaskConical,
  Lock,
  ChevronRight,
  TrendingUp,
  Flame,
  Calendar,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress?: () => void;
  onNavigateChapter?: (chId: string) => void;
  onUpdateProgress?: (updated: UserProgress) => void;
  onNavigateSim?: (simId?: string) => void;
  onNavigateTutor?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onResetProgress,
  onNavigateChapter,
  onUpdateProgress,
  onNavigateSim,
  onNavigateTutor,
}) => {
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<StudyBadge | null>(null);

  // Compute overall syllabus stats
  const totalTopics = CHAPTERS_DATA.reduce((acc, ch) => acc + ch.topics.length, 0);
  const completedTopicsCount = progress.completedTopics.length;
  const overallProgress = Math.round((completedTopicsCount / (totalTopics || 1)) * 100);

  const completedSimsCount = progress.completedSimulations.length;
  const totalSims = SIMULATIONS_LIST.length;

  const totalQuizzes = progress.quizHistory?.length || 0;
  const averageAccuracy =
    totalQuizzes > 0
      ? Math.round(
          progress.quizHistory.reduce((sum, q) => sum + (q.accuracy || 0), 0) / totalQuizzes
        )
      : 0;

  // Study Badges calculation
  const streakDetails = getStreakDetails(progress);
  const badges = computeStudyBadges(progress);
  const totalXP = getTotalBadgeXP(badges);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const lockedBadges = badges.filter((b) => !b.isUnlocked);

  const displayedBadges =
    badgeFilter === 'unlocked'
      ? unlockedBadges
      : badgeFilter === 'locked'
      ? lockedBadges
      : badges;

  // Aggregate weak topics from quiz history
  const weakTopicsList = Array.from(
    new Set((progress.quizHistory || []).flatMap((q) => q.weakTopics || []))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            <Sparkles className="w-4 h-4" /> CBSE Class 10 Gamified Learning Hub
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Learning Progress & Study Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Set daily chapter completion goals based on your exam date, track syllabus progress, and earn study badges.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <a
            href="#study-planner-section"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Target className="w-3.5 h-3.5" /> Exam Study Planner
          </a>

          {onResetProgress && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset your learning progress and badges?')) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Syllabus Coverage */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Syllabus Completion</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {overallProgress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {completedTopicsCount} of {totalTopics} topics mastered
          </span>
        </div>

        {/* KPI 2: Virtual Experiments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lab Experiments Done</span>
            <FlaskConical className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {completedSimsCount} / {totalSims}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedSimsCount / (totalSims || 1)) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Virtual labs verified
          </span>
        </div>

        {/* KPI 3: Practice Test Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Quiz Accuracy</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {averageAccuracy}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${averageAccuracy}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Across {totalQuizzes} practice tests taken
          </span>
        </div>

        {/* KPI 4: Study Badges & XP */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 p-5 shadow-xs space-y-2 bg-gradient-to-br from-amber-50/50 to-orange-50/20 dark:from-amber-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Badges</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {unlockedBadges.length} / {badges.length}
          </div>
          <div className="w-full bg-amber-100 dark:bg-amber-950/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium block">
            ⚡ {totalXP} XP Earned from Milestones
          </span>
        </div>
      </div>

      {/* Daily Study Streak Banner */}
      <div className="rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-900 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Daily Study Streak: {streakDetails.currentStreak} {streakDetails.currentStreak === 1 ? 'Day' : 'Days'} in a Row!
              </h3>
              {streakDetails.isTodayActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  🔥 Active Today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Longest study streak: <span className="font-bold text-orange-600 dark:text-orange-400">{streakDetails.longestStreak} {streakDetails.longestStreak === 1 ? 'day' : 'days'}</span>. Consistent daily physics practice boosts recall by up to 300%.
            </p>
          </div>
        </div>

        {/* Mini 7-day strip */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
          {streakDetails.last7Days.map((d) => (
            <div key={d.date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {d.label}
              </span>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  d.isActive
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
                title={`${d.date}: ${d.isActive ? 'Active study session' : 'Rest day'}`}
              >
                {d.isActive ? '✓' : '•'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CBSE BOARD EXAM STUDY PLANNER */}
      <StudyPlanner
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onNavigateChapter={onNavigateChapter}
        onNavigateSim={onNavigateSim}
        onNavigateTutor={onNavigateTutor}
      />

      {/* RECHARTS LEARNING TREND CHART */}
      <ProgressTrendChart
        progress={progress}
        onNavigateChapter={onNavigateChapter}
      />

      {/* GAMIFICATION SECTION: Study Badges */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                CBSE Physics Study Badges
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Earn academic badges by completing chapters, taking practice tests, and conducting virtual experiments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                badgeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('unlocked')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                badgeFilter === 'unlocked'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unlocked ({unlockedBadges.length})
            </button>
            <button
              type="button"
              onClick={() => setBadgeFilter('locked')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                badgeFilter === 'locked'
                  ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              In Progress ({lockedBadges.length})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;
            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-700/60 hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                        isUnlocked
                          ? `bg-gradient-to-br ${badge.badgeGradient} text-white`
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.categoryColor}`}>
                        {badge.category}
                      </span>
                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Milestone Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Milestone: {badge.currentValue} / {badge.targetValue}
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {badge.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {badge.milestoneRequirement}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0 ml-1">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Chapter-wise Syllabus Progress
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHAPTERS_DATA.map((ch) => {
            const chDone = ch.topics.filter((t) => progress.completedTopics.includes(t.id)).length;
            const chPercent = Math.round((chDone / (ch.topics.length || 1)) * 100);

            return (
              <div
                key={ch.id}
                onClick={() => onNavigateChapter && onNavigateChapter(ch.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    Chapter {ch.number}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {chPercent}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ch.title}
                </h4>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${chPercent}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{chDone} of {ch.topics.length} topics done</span>
                  <span>Weightage: {ch.weightageInBoard}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas Callout */}
      {weakTopicsList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Identified Conceptual Focus Areas</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on questions answered incorrectly during practice quizzes, we recommend reviewing these specific topics:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {weakTopicsList.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-900 dark:text-amber-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                  selectedBadge.isUnlocked
                    ? `bg-gradient-to-br ${selectedBadge.badgeGradient} text-white`
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedBadge.categoryColor}`}>
                  {selectedBadge.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedBadge.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selectedBadge.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Milestone Requirement:
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {selectedBadge.milestoneRequirement}
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-500">
                  Current Progress: {selectedBadge.currentValue} / {selectedBadge.targetValue}
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  +{selectedBadge.xpReward} XP Reward
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
