import React, { useState, useMemo } from 'react';
import { UserProgress, StudyPlan } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';
import {
  EXAM_PRESETS,
  getActiveStudyPlan,
  calculateStudyPlanMetrics,
  updateStudyPlanInUserProgress,
  toggleDailyGoalForDate,
} from '../utils/studyPlannerUtils';
import { getTodayDateString } from '../utils/progressStorage';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Target,
  Flag,
  Sparkles,
  BookOpen,
  ChevronRight,
  Edit3,
  ArrowRight,
  RotateCcw,
  Check,
  Flame,
  Award,
  Sliders,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StudyPlannerProps {
  progress: UserProgress;
  onUpdateProgress?: (updated: UserProgress) => void;
  onNavigateChapter?: (chId: string) => void;
  onNavigateSim?: (simId?: string) => void;
  onNavigateTutor?: () => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  progress,
  onUpdateProgress,
  onNavigateChapter,
  onNavigateSim,
  onNavigateTutor,
}) => {
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const activePlan = useMemo(() => getActiveStudyPlan(progress), [progress]);

  // Form states for editing
  const [examDateInput, setExamDateInput] = useState<string>(activePlan.examDate);
  const [examNameInput, setExamNameInput] = useState<string>(activePlan.examName);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(activePlan.dailyStudyMinutes || 45);
  const [paceInput, setPaceInput] = useState<StudyPlan['pacePreference']>(activePlan.pacePreference || 'balanced');
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(
    activePlan.targetChapterIds || CHAPTERS_DATA.map((c) => c.id)
  );

  // Sync inputs if activePlan updates
  const handleOpenConfig = () => {
    setExamDateInput(activePlan.examDate);
    setExamNameInput(activePlan.examName);
    setDailyMinutesInput(activePlan.dailyStudyMinutes || 45);
    setPaceInput(activePlan.pacePreference || 'balanced');
    setSelectedChapterIds(activePlan.targetChapterIds || CHAPTERS_DATA.map((c) => c.id));
    setIsConfigOpen(!isConfigOpen);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = EXAM_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setExamDateInput(preset.date);
      setExamNameInput(preset.name);
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDateInput) return;

    const updatedPlan: StudyPlan = {
      ...activePlan,
      examDate: examDateInput,
      examName: examNameInput || 'CBSE Class 10 Science Board Exam',
      dailyStudyMinutes: Number(dailyMinutesInput),
      pacePreference: paceInput,
      targetChapterIds: selectedChapterIds.length > 0 ? selectedChapterIds : CHAPTERS_DATA.map((c) => c.id),
      lastCalculatedAt: getTodayDateString(),
    };

    if (onUpdateProgress) {
      const updatedProgress = updateStudyPlanInUserProgress(progress, updatedPlan);
      onUpdateProgress(updatedProgress);
    }
    setIsConfigOpen(false);
  };

  const handleResetToDefault = () => {
    const defaultPreset = EXAM_PRESETS[0];
    setExamDateInput(defaultPreset.date);
    setExamNameInput(defaultPreset.name);
    setDailyMinutesInput(45);
    setPaceInput('balanced');
    setSelectedChapterIds(CHAPTERS_DATA.map((c) => c.id));
  };

  const handleToggleChapterSelect = (chId: string) => {
    if (selectedChapterIds.includes(chId)) {
      if (selectedChapterIds.length === 1) return; // keep at least 1
      setSelectedChapterIds(selectedChapterIds.filter((id) => id !== chId));
    } else {
      setSelectedChapterIds([...selectedChapterIds, chId]);
    }
  };

  // Toggle today's or any date's goal completion
  const handleToggleGoalDate = (dateStr: string) => {
    if (onUpdateProgress) {
      const updated = toggleDailyGoalForDate(progress, dateStr);
      onUpdateProgress(updated);
    }
  };

  const metrics = useMemo(
    () => calculateStudyPlanMetrics(progress, activePlan),
    [progress, activePlan]
  );

  const {
    daysRemaining,
    weeksRemaining,
    totalTopics,
    completedTopicsCount,
    remainingTopicsCount,
    syllabusPercent,
    recommendedTopicsPerWeek,
    recommendedDailyMinutes,
    revisionBufferDays,
    chapterDeadlines,
    todayGoal,
    sevenDayRoadmap,
    paceFeasibility,
    studyPaceAdvice,
  } = metrics;

  const todayStr = getTodayDateString();
  const isTodayGoalComplete = todayGoal.isCompleted;

  // Feasibility styling badge
  const feasibilityBadge = {
    comfortable: {
      label: 'Comfortable Pace',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    optimal: {
      label: 'Optimal Pace',
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    intensive: {
      label: 'Intensive Pace',
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    critical: {
      label: 'Urgent Pace',
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
  }[paceFeasibility];

  return (
    <section
      id="study-planner-section"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6"
    >
      {/* 1. Header: Goal Overview & Exam Countdown Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Board Exam Study Planner
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${feasibilityBadge.bg}`}>
                  {feasibilityBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personalized chapter completion milestones and daily goals tailored to your target exam date.
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleOpenConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>{isConfigOpen ? 'Hide Settings' : 'Customize Exam Date'}</span>
            {isConfigOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Hero Countdown & Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Days Left Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Exam Countdown</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black font-mono text-blue-700 dark:text-blue-300 leading-none">
              {daysRemaining}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
              Days Left ({weeksRemaining} {weeksRemaining === 1 ? 'week' : 'weeks'})
            </span>
          </div>
          <div className="text-[10px] text-blue-600/90 dark:text-blue-400 font-mono mt-2 truncate">
            {activePlan.examName}
          </div>
        </div>

        {/* Recommended Daily Pace */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recommended Pace</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white leading-none">
              {recommendedTopicsPerWeek}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
              Topics / Week
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-2">
            Target: {recommendedDailyMinutes} mins/day study time
          </div>
        </div>

        {/* Topics Remaining */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Syllabus Completion</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 leading-none">
              {completedTopicsCount}/{totalTopics}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
              {remainingTopicsCount} topics pending ({syllabusPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${syllabusPercent}%` }}
            />
          </div>
        </div>

        {/* Buffer & Revision Cushion */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revision Cushion</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400 leading-none">
              {revisionBufferDays}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
              Days Reserved for Mock PYQs
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-2">
            Finish syllabus {revisionBufferDays} days before exam
          </div>
        </div>
      </div>

      {/* 3. Collapsible Configuration Panel */}
      {isConfigOpen && (
        <form
          onSubmit={handleSavePlan}
          className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-blue-200 dark:border-blue-900/60 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Configure Your Physics Study Plan</span>
            </div>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Quick Exam Target Presets:
            </label>
            <div className="flex flex-wrap gap-2">
              {EXAM_PRESETS.map((p) => {
                const isSelected = examDateInput === p.date;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span>{p.name.split('Exam')[0].trim()}</span>
                    <span className="text-[10px] opacity-80 ml-1.5 font-mono">({p.date})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date & Exam Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Date:
              </label>
              <input
                type="date"
                value={examDateInput}
                onChange={(e) => setExamDateInput(e.target.value)}
                min={todayStr}
                required
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Name:
              </label>
              <input
                type="text"
                value={examNameInput}
                onChange={(e) => setExamNameInput(e.target.value)}
                placeholder="e.g. CBSE Class 10 Science Board Exam"
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Daily Minutes & Study Intensity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Study Time: {dailyMinutesInput} mins/day
              </label>
              <div className="flex items-center gap-2">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutesInput(mins)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      dailyMinutesInput === mins
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preparation Strategy:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'accelerated', label: 'Intensive' },
                  { id: 'thorough', label: 'Thorough' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPaceInput(s.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      paceInput === s.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters Included */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Include Target Chapters in Plan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {CHAPTERS_DATA.map((ch) => {
                const isIncluded = selectedChapterIds.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleToggleChapterSelect(ch.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isIncluded
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      <span className="font-mono text-[11px] block text-blue-600 dark:text-blue-400">
                        Ch {ch.number}
                      </span>
                      <span>{ch.title.split('–')[0].split(':')[0].trim()}</span>
                    </div>
                    {isIncluded ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsConfigOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save & Recalculate Schedule
            </button>
          </div>
        </form>
      )}

      {/* 4. Actionable Card: TODAY'S DAILY GOAL */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <button
              type="button"
              onClick={() => handleToggleGoalDate(todayStr)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isTodayGoalComplete
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700'
              }`}
              title={isTodayGoalComplete ? 'Goal Completed for Today!' : 'Click to mark today’s goal complete'}
            >
              {isTodayGoalComplete ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : (
                <Circle className="w-6 h-6 text-slate-400 hover:text-blue-500" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  TODAY'S TARGET GOAL
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                {isTodayGoalComplete && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Goal Achieved!
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {todayGoal.topicTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {todayGoal.chapterTitle}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {todayGoal.targetMinutes} mins target
                </span>
                <span>•</span>
                <span>CBSE Weightage Priority</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => onNavigateChapter && onNavigateChapter(todayGoal.chapterId)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Study Topic Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleToggleGoalDate(todayStr)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isTodayGoalComplete
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {isTodayGoalComplete ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Completed
                </>
              ) : (
                'Mark as Done'
              )}
            </button>
          </div>
        </div>

        {/* Study Advice Pill */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-slate-800 dark:text-slate-200">Study Plan Insight: </strong>
            {studyPaceAdvice}
          </p>
        </div>
      </div>

      {/* 5. CHAPTER COMPLETION DEADLINES ROADMAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Chapter Completion Deadlines Roadmap
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {chapterDeadlines.filter((c) => c.isCompleted).length} of {chapterDeadlines.length} Chapters Finished
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {chapterDeadlines.map((cd, idx) => {
            const isDone = cd.isCompleted;
            const percent = Math.round((cd.completedTopics / (cd.totalTopics || 1)) * 100);

            return (
              <div
                key={cd.chapterId}
                onClick={() => onNavigateChapter && onNavigateChapter(cd.chapterId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-400'
                    : cd.status === 'on-track'
                    ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 hover:border-blue-400 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-blue-600 dark:text-blue-400">
                      Step {idx + 1}
                    </span>
                    {isDone ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Completed
                      </span>
                    ) : cd.status === 'on-track' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Active Target
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {cd.chapterTitle.split('–')[0].split(':')[0].trim()}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {new Date(cd.targetCompletionDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">{cd.completedTopics} of {cd.totalTopics} topics</span>
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revision & Mock Buffer Strip */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 dark:from-amber-950/20 dark:to-indigo-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-white font-bold">Final Revision Phase: </strong>
              The final {revisionBufferDays} days before {new Date(activePlan.examDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} are reserved for full 80-mark CBSE Science mock papers and NCERT Exemplar drills.
            </span>
          </div>
          <span className="font-bold font-mono text-amber-700 dark:text-amber-400 shrink-0 bg-white/70 dark:bg-slate-900/70 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
            {revisionBufferDays} Cushion Days
          </span>
        </div>
      </div>

      {/* 6. NEXT 7 DAYS STUDY FORECAST (Weekly Calendar Planner) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              7-Day Daily Goals Forecast
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Check off daily milestones to protect your study momentum
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {sevenDayRoadmap.map((day) => {
            return (
              <div
                key={day.date}
                onClick={() => handleToggleGoalDate(day.date)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  day.isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : day.isToday
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold ${
                      day.isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.dayLabel}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      day.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {day.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                  </div>
                </div>

                <div className="my-2">
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block truncate">
                    {day.chapterTitle}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5 leading-snug">
                    {day.topicTitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  {day.isCompleted && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Done</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
