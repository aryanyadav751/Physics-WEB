import React from 'react';
import { UserProgress } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { SIMULATIONS_LIST } from '../data/simulationsData';
import {
  Award,
  CheckCircle,
  Clock,
  Target,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  FlaskConical,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress?: () => void;
  onNavigateChapter?: (chId: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onResetProgress,
  onNavigateChapter,
}) => {
  // Compute overall stats
  const totalTopics = Object.values(CHAPTERS_DATA).reduce((acc, ch) => acc + ch.topics.length, 0);
  const completedTopicsCount = progress.completedTopics.length;
  const overallProgress = Math.round((completedTopicsCount / (totalTopics || 1)) * 100);

  const completedSimsCount = progress.completedSimulations.length;
  const totalSims = SIMULATIONS_LIST.length;

  const totalQuizzes = progress.quizzesAttempted.length;
  const averageAccuracy =
    totalQuizzes > 0
      ? Math.round(
          progress.quizzesAttempted.reduce((sum, q) => sum + q.accuracy, 0) / totalQuizzes
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            Student Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Learning Progress & Exam Readiness
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Track your CBSE Class 10 syllabus coverage, virtual experiments conducted, and quiz accuracy.
          </p>
        </div>

        {onResetProgress && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset your learning progress?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
          </button>
        )}
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Syllabus Completion</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {overallProgress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {completedTopicsCount} of {totalTopics} topics mastered
          </span>
        </div>

        {/* KPI 2 */}
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
              className="bg-purple-600 h-full rounded-full"
              style={{ width: `${(completedSimsCount / totalSims) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Virtual labs completed
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Test Accuracy</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {averageAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500 block">
            Across {totalQuizzes} practice tests taken
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Achievements</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {progress.badges.length} Badges
          </div>
          <span className="text-[11px] text-slate-500 block">
            Earned for academic milestones
          </span>
        </div>
      </div>

      {/* Chapter Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Chapter-wise Syllabus Progress
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(CHAPTERS_DATA).map((ch) => {
            const chDone = ch.topics.filter((t) => progress.completedTopics.includes(t.id)).length;
            const chPercent = Math.round((chDone / (ch.topics.length || 1)) * 100);

            return (
              <div
                key={ch.id}
                onClick={() => onNavigateChapter && onNavigateChapter(ch.id)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 cursor-pointer hover:border-blue-400 transition-all"
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
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${chPercent}%` }} />
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
      {progress.weakTopics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Identified Conceptual Weak Spots</h3>
          </div>
          <p className="text-xs text-slate-500">
            Based on questions answered incorrectly in practice tests, we recommend reviewing these specific topics:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {progress.weakTopics.map((topic, i) => (
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

      {/* Badges Earned */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Academic Badges & Milestones
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { id: 'badge-first-step', name: 'First Discovery', desc: 'Completed your first physics topic', icon: '🚀' },
            { id: 'badge-optics', name: 'Optics Explorer', desc: 'Traced mirror and lens ray diagrams', icon: '🔍' },
            { id: 'badge-lab', name: 'Virtual Scientist', desc: 'Conducted 3 virtual lab experiments', icon: '⚗️' },
            { id: 'badge-ohm', name: 'Circuit Master', desc: 'Verified Ohm’s Law and resistor circuits', icon: '⚡' },
            { id: 'badge-quiz', name: 'Practice Champ', desc: 'Scored 80%+ on a full syllabus test', icon: '🎯' },
            { id: 'badge-board', name: 'Board Ready', desc: 'Reviewed all case studies & common pitfalls', icon: '🏆' },
          ].map((b) => {
            const isUnlocked = progress.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{b.icon}</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{b.desc}</div>
                {isUnlocked ? (
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block text-[10px] text-slate-400">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
