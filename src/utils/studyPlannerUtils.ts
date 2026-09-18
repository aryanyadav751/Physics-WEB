import { UserProgress, StudyPlan, DailyStudyGoal, ChapterDeadline } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { getTodayDateString } from './progressStorage';

export interface ExamPreset {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'cbse-board-2027',
    name: 'CBSE Class 10 Science Board Exam 2027',
    date: '2027-03-15',
    description: 'Official CBSE Annual Board Examination (Target 95%+ in Physics)',
  },
  {
    id: 'preboard-2',
    name: 'Pre-Board Examination 2',
    date: '2027-01-20',
    description: 'School Pre-Board 2 (Full Physics Syllabus Simulation)',
  },
  {
    id: 'preboard-1',
    name: 'Pre-Board Examination 1',
    date: '2026-12-15',
    description: 'School Pre-Board 1 (Early syllabus mastery test)',
  },
  {
    id: 'term-exam',
    name: 'Term / Half-Yearly Exam',
    date: '2026-10-30',
    description: 'Mid-term school assessment (Light & Human Eye focus)',
  },
];

export const DEFAULT_STUDY_PLAN: StudyPlan = {
  examDate: '2027-03-15',
  examName: 'CBSE Class 10 Science Board Exam 2027',
  dailyStudyMinutes: 45,
  pacePreference: 'balanced',
  targetChapterIds: ['light', 'human-eye', 'electricity', 'magnetism'],
  customDailyTopics: 1,
  completedGoalDates: [],
  createdAt: '2026-09-18',
  lastCalculatedAt: '2026-09-18',
};

/**
 * Normalizes or initializes a student's StudyPlan
 */
export function getActiveStudyPlan(progress: UserProgress): StudyPlan {
  if (progress.studyPlan && progress.studyPlan.examDate) {
    return progress.studyPlan;
  }
  return DEFAULT_STUDY_PLAN;
}

export interface StudyPlanMetrics {
  daysRemaining: number;
  weeksRemaining: number;
  totalTopics: number;
  completedTopicsCount: number;
  remainingTopicsCount: number;
  syllabusPercent: number;
  recommendedTopicsPerWeek: number;
  recommendedDailyMinutes: number;
  revisionBufferDays: number;
  effectiveLearningDays: number;
  chapterDeadlines: ChapterDeadline[];
  todayGoal: DailyStudyGoal;
  sevenDayRoadmap: Array<{
    date: string;
    dayLabel: string;
    chapterTitle: string;
    topicId: string;
    topicTitle: string;
    isCompleted: boolean;
    isToday: boolean;
  }>;
  paceFeasibility: 'comfortable' | 'optimal' | 'intensive' | 'critical';
  studyPaceAdvice: string;
}

/**
 * Calculates dynamic study metrics, chapter completion deadlines, and daily targets
 */
export function calculateStudyPlanMetrics(
  progress: UserProgress,
  plan: StudyPlan
): StudyPlanMetrics {
  const todayStr = getTodayDateString();
  const todayDate = new Date(todayStr + 'T00:00:00');
  const examDate = new Date(plan.examDate + 'T00:00:00');

  // Compute days difference
  const diffTime = examDate.getTime() - todayDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(1, diffDays);
  const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));

  // Filter selected chapters (or fallback to all if empty)
  const targetChapterIds =
    plan.targetChapterIds && plan.targetChapterIds.length > 0
      ? plan.targetChapterIds
      : CHAPTERS_DATA.map((c) => c.id);

  const selectedChapters = CHAPTERS_DATA.filter((c) =>
    targetChapterIds.includes(c.id)
  );

  // All topics in target chapters
  const allTargetTopics = selectedChapters.flatMap((c) =>
    c.topics.map((t) => ({ ...t, chapterId: c.id, chapterTitle: c.title, chapterNumber: c.number }))
  );

  const totalTopics = allTargetTopics.length || 1;
  const completedTopicsCount = allTargetTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const remainingTopicsCount = Math.max(0, totalTopics - completedTopicsCount);
  const syllabusPercent = Math.round((completedTopicsCount / totalTopics) * 100);

  // Reserve a 15% buffer (at least 7 days, max 25 days) for full revision & PYQs before exam
  const revisionBufferDays = Math.min(
    Math.max(7, Math.round(daysRemaining * 0.15)),
    Math.min(25, Math.floor(daysRemaining * 0.4))
  );
  const effectiveLearningDays = Math.max(1, daysRemaining - revisionBufferDays);

  // Pace recommendations
  const weeksEffective = Math.max(1, Math.ceil(effectiveLearningDays / 7));
  const recommendedTopicsPerWeek = Number(
    (remainingTopicsCount / weeksEffective).toFixed(1)
  );

  // Time requirement estimation
  let recommendedDailyMinutes = plan.dailyStudyMinutes || 45;
  let paceFeasibility: 'comfortable' | 'optimal' | 'intensive' | 'critical' = 'optimal';
  let studyPaceAdvice = '';

  if (remainingTopicsCount === 0) {
    paceFeasibility = 'comfortable';
    studyPaceAdvice =
      'Outstanding! You have completed all syllabus topics. Dedicate 30 mins daily to PYQs, numericals, and mock exams.';
  } else if (recommendedTopicsPerWeek <= 1.5) {
    paceFeasibility = 'comfortable';
    studyPaceAdvice =
      'You are well ahead of schedule! Aim for 1-2 topics per week with deep conceptual notes and NCERT exemplar questions.';
  } else if (recommendedTopicsPerWeek <= 3.5) {
    paceFeasibility = 'optimal';
    studyPaceAdvice =
      'Ideal CBSE preparation pace! Covering 2 to 3 topics weekly ensures timely completion with 3+ weeks left for mock exams.';
  } else if (recommendedTopicsPerWeek <= 6.0) {
    paceFeasibility = 'intensive';
    studyPaceAdvice =
      'Intensive pace required. Study 4-5 topics per week (45-60 mins daily) to ensure you complete before pre-boards.';
  } else {
    paceFeasibility = 'critical';
    studyPaceAdvice =
      'High priority! Your exam date is close. Aim for at least 1 topic every day (60-75 mins) with focused numerical formulas.';
  }

  // Calculate Chapter Completion Deadlines
  let accumulatedDays = 0;
  const chapterDeadlines: ChapterDeadline[] = selectedChapters.map((ch) => {
    const chTopics = ch.topics;
    const chCompleted = chTopics.filter((t) =>
      progress.completedTopics.includes(t.id)
    ).length;
    const isCompleted = chCompleted === chTopics.length;

    // Weight allocation based on topic count
    const chapterShare = chTopics.length / (totalTopics || 1);
    const chapterDays = Math.max(2, Math.round(effectiveLearningDays * chapterShare));
    accumulatedDays += chapterDays;

    const targetDateObj = new Date(todayDate);
    targetDateObj.setDate(targetDateObj.getDate() + accumulatedDays);
    const targetDateStr = targetDateObj.toISOString().split('T')[0];

    let status: ChapterDeadline['status'] = 'upcoming';
    if (isCompleted) {
      status = 'completed';
    } else if (accumulatedDays <= 7) {
      status = 'on-track';
    } else if (targetDateObj < todayDate) {
      status = 'behind';
    } else {
      status = 'upcoming';
    }

    return {
      chapterId: ch.id,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      targetCompletionDate: targetDateStr,
      totalTopics: chTopics.length,
      completedTopics: chCompleted,
      isCompleted,
      status,
    };
  });

  // Calculate Today's Daily Goal
  // 1. Find the first chapter that has pending topics
  let activeTopic = allTargetTopics.find(
    (t) => !progress.completedTopics.includes(t.id)
  );

  if (!activeTopic && allTargetTopics.length > 0) {
    // If all completed, suggest topic review
    activeTopic = allTargetTopics[0];
  }

  const isTodayGoalMarkedDone =
    (plan.completedGoalDates || []).includes(todayStr) ||
    (activeTopic ? progress.completedTopics.includes(activeTopic.id) : true);

  const todayGoal: DailyStudyGoal = {
    date: todayStr,
    chapterId: activeTopic ? activeTopic.chapterId : 'light',
    chapterTitle: activeTopic ? activeTopic.chapterTitle : 'Light: Reflection and Refraction',
    topicId: activeTopic ? activeTopic.id : 'light-reflection-laws',
    topicTitle: activeTopic ? activeTopic.title : 'Comprehensive Syllabus Review',
    isCompleted: isTodayGoalMarkedDone,
    targetMinutes: plan.dailyStudyMinutes || 45,
  };

  // Generate 7-Day Roadmap
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const incompleteTopics = allTargetTopics.filter(
    (t) => !progress.completedTopics.includes(t.id)
  );

  const sevenDayRoadmap = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];

    // Pick topic for this day
    const topicForDay =
      incompleteTopics[i % Math.max(1, incompleteTopics.length)] || allTargetTopics[0];

    const isTopicCompleted = topicForDay
      ? progress.completedTopics.includes(topicForDay.id)
      : false;
    const isGoalChecked = (plan.completedGoalDates || []).includes(dateStr);

    return {
      date: dateStr,
      dayLabel,
      chapterTitle: topicForDay ? topicForDay.chapterTitle.split('–')[0].split(':')[0].trim() : 'Physics',
      topicId: topicForDay ? topicForDay.id : '',
      topicTitle: topicForDay ? topicForDay.title : 'Concept Practice & Revision',
      isCompleted: isGoalChecked || isTopicCompleted,
      isToday: i === 0,
    };
  });

  return {
    daysRemaining,
    weeksRemaining,
    totalTopics,
    completedTopicsCount,
    remainingTopicsCount,
    syllabusPercent,
    recommendedTopicsPerWeek,
    recommendedDailyMinutes,
    revisionBufferDays,
    effectiveLearningDays,
    chapterDeadlines,
    todayGoal,
    sevenDayRoadmap,
    paceFeasibility,
    studyPaceAdvice,
  };
}

/**
 * Saves or updates study plan in user progress
 */
export function updateStudyPlanInUserProgress(
  progress: UserProgress,
  updatedPlan: StudyPlan
): UserProgress {
  const updated: UserProgress = {
    ...progress,
    studyPlan: {
      ...updatedPlan,
      lastCalculatedAt: getTodayDateString(),
    },
  };
  return updated;
}

/**
 * Toggles a date's daily goal completion
 */
export function toggleDailyGoalForDate(
  progress: UserProgress,
  dateStr: string
): UserProgress {
  const currentPlan = getActiveStudyPlan(progress);
  const prevDates = currentPlan.completedGoalDates || [];
  const exists = prevDates.includes(dateStr);

  const updatedDates = exists
    ? prevDates.filter((d) => d !== dateStr)
    : [...prevDates, dateStr];

  const updatedPlan: StudyPlan = {
    ...currentPlan,
    completedGoalDates: updatedDates,
  };

  return updateStudyPlanInUserProgress(progress, updatedPlan);
}
