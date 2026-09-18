import { UserProgress } from '../types/physics';

const STORAGE_KEY = 'physics_lab_10_user_progress_v1';

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first-quiz',
    title: 'First Quiz',
    description: 'Attempt your first physics practice quiz.',
    icon: '🏆',
  },
  {
    id: 'lab-explorer',
    title: 'Lab Explorer',
    description: 'Experiment with at least 2 interactive virtual simulations.',
    icon: '🔬',
  },
  {
    id: 'light-expert',
    title: 'Light Expert',
    description: 'Complete all topics in Light: Reflection and Refraction.',
    icon: '🔭',
  },
  {
    id: 'electricity-master',
    title: 'Electricity Master',
    description: 'Solve 5 circuit or Ohm’s law practice problems.',
    icon: '⚡',
  },
  {
    id: 'magnetism-master',
    title: 'Magnetism Master',
    description: 'Explore the electric motor & magnetic field simulator.',
    icon: '🧲',
  },
  {
    id: 'chapter-champion',
    title: 'Chapter Champion',
    description: 'Complete concepts across all 4 Class 10 CBSE chapters.',
    icon: '📚',
  },
  {
    id: 'board-ready',
    title: 'Board Ready',
    description: 'Score 80% or higher on a 10-question practice test.',
    icon: '🔥',
  },
];

export const INITIAL_PROGRESS: UserProgress = {
  completedTopics: [],
  completedChapters: [],
  completedSimulations: [],
  bookmarkedQuestions: [],
  quizHistory: [],
  achievements: INITIAL_ACHIEVEMENTS,
  aiQuestionsCount: 0,
  solvedNumericalsCount: 0,
  dailyChallengeCompletions: [],
  badgeUnlockDates: {},
  studyStreak: {
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '',
    activeDates: [],
  },
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Updates daily study streak based on consecutive calendar day interactions.
 */
export function updateStudyStreak(current: UserProgress): UserProgress {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const prevStreak = current.studyStreak || {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  };

  const activeDates = Array.from(new Set([...(prevStreak.activeDates || []), today]));

  if (prevStreak.lastActiveDate === today) {
    // Already counted today, retain streak
    return {
      ...current,
      studyStreak: {
        ...prevStreak,
        activeDates,
      },
    };
  }

  let newCurrentStreak = 1;
  if (prevStreak.lastActiveDate === yesterday) {
    // Interacted yesterday -> streak increments
    newCurrentStreak = (prevStreak.currentStreak || 0) + 1;
  } else if (!prevStreak.lastActiveDate) {
    // First interaction
    newCurrentStreak = 1;
  } else {
    // Missed at least one day -> reset to 1
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(prevStreak.longestStreak || 0, newCurrentStreak);

  const updated: UserProgress = {
    ...current,
    studyStreak: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
      activeDates,
    },
  };

  saveUserProgress(updated);
  return updated;
}

export interface StreakDetails {
  currentStreak: number;
  longestStreak: number;
  isTodayActive: boolean;
  lastActiveDate: string;
  activeDates: string[];
  last7Days: Array<{ label: string; date: string; isActive: boolean }>;
}

export function getStreakDetails(progress: UserProgress): StreakDetails {
  const streak = progress.studyStreak || {
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '',
    activeDates: [],
  };

  const today = getTodayDateString();
  const isTodayActive = streak.lastActiveDate === today || (streak.activeDates || []).includes(today);

  // Compute last 7 days representation
  const last7Days: Array<{ label: string; date: string; isActive: boolean }> = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${da}`;
    const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

    last7Days.push({
      label: dayLabel,
      date: dateStr,
      isActive: (streak.activeDates || []).includes(dateStr) || (i === 0 && isTodayActive),
    });
  }

  return {
    currentStreak: Math.max(1, streak.currentStreak || 1),
    longestStreak: Math.max(streak.longestStreak || 1, streak.currentStreak || 1),
    isTodayActive,
    lastActiveDate: streak.lastActiveDate || today,
    activeDates: streak.activeDates || [today],
    last7Days,
  };
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = updateStudyStreak(INITIAL_PROGRESS);
      return initial;
    }
    const parsed = JSON.parse(raw);
    const merged: UserProgress = {
      ...INITIAL_PROGRESS,
      ...parsed,
      aiQuestionsCount: parsed.aiQuestionsCount || 0,
      solvedNumericalsCount: parsed.solvedNumericalsCount || 0,
      dailyChallengeCompletions: parsed.dailyChallengeCompletions || [],
      badgeUnlockDates: parsed.badgeUnlockDates || {},
      studyStreak: parsed.studyStreak || {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: '',
        activeDates: [],
      },
      achievements: INITIAL_ACHIEVEMENTS.map((a) => {
        const existing = parsed.achievements?.find((p: any) => p.id === a.id);
        return existing || a;
      }),
    };
    return updateStudyStreak(merged);
  } catch {
    return updateStudyStreak(INITIAL_PROGRESS);
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to persist user progress:', err);
  }
}

export function recordAIInteraction(current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    aiQuestionsCount: (current.aiQuestionsCount || 0) + 1,
  };
  return checkAchievements(updated);
}

export function recordSolvedNumerical(current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    solvedNumericalsCount: (current.solvedNumericalsCount || 0) + 1,
  };
  return checkAchievements(updated);
}

export function recordDailyChallenge(
  attempt: { date: string; score: number; total: number },
  current: UserProgress
): UserProgress {
  const existing = current.dailyChallengeCompletions || [];
  const filtered = existing.filter((c) => c.date !== attempt.date);
  const updated: UserProgress = {
    ...current,
    dailyChallengeCompletions: [...filtered, attempt],
    solvedNumericalsCount: (current.solvedNumericalsCount || 0) + attempt.score,
  };
  return checkAchievements(updated);
}

export function toggleTopicCompleted(topicId: string, current: UserProgress): UserProgress {
  const isCompleted = current.completedTopics.includes(topicId);
  const updatedTopics = isCompleted
    ? current.completedTopics.filter((t) => t !== topicId)
    : [...current.completedTopics, topicId];

  const updated = {
    ...current,
    completedTopics: updatedTopics,
  };
  return checkAchievements(updated);
}

export function markSimulationCompleted(simId: string, current: UserProgress): UserProgress {
  if (current.completedSimulations.includes(simId)) return current;
  const updated = {
    ...current,
    completedSimulations: [...current.completedSimulations, simId],
  };
  return checkAchievements(updated);
}

export function toggleBookmarkQuestion(questionId: string, current: UserProgress): UserProgress {
  const isBookmarked = current.bookmarkedQuestions.includes(questionId);
  const updatedList = isBookmarked
    ? current.bookmarkedQuestions.filter((q) => q !== questionId)
    : [...current.bookmarkedQuestions, questionId];

  const updated = {
    ...current,
    bookmarkedQuestions: updatedList,
  };
  saveUserProgress(updated);
  return updated;
}

export function recordQuizAttempt(
  attempt: {
    chapterId: string;
    score: number;
    total: number;
    accuracy: number;
    timeTakenSeconds: number;
    weakTopics: string[];
  },
  current: UserProgress
): UserProgress {
  const newAttempt = {
    ...attempt,
    id: `quiz-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const updated: UserProgress = {
    ...current,
    quizHistory: [newAttempt, ...current.quizHistory],
  };

  return checkAchievements(updated);
}

export function resetProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  }
  return INITIAL_PROGRESS;
}

function checkAchievements(p: UserProgress): UserProgress {
  const now = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const achievements = p.achievements.map((ach) => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let shouldUnlock = false;

    if (ach.id === 'first-quiz' && p.quizHistory.length >= 1) {
      shouldUnlock = true;
    } else if (ach.id === 'lab-explorer' && p.completedSimulations.length >= 2) {
      shouldUnlock = true;
    } else if (ach.id === 'light-expert' && p.completedTopics.filter((t) => t.startsWith('light-')).length >= 5) {
      shouldUnlock = true;
    } else if (ach.id === 'electricity-master' && p.quizHistory.some((q) => q.chapterId === 'electricity' || q.chapterId === 'all')) {
      shouldUnlock = true;
    } else if (ach.id === 'magnetism-master' && p.completedSimulations.includes('sim-magnetic-field-motor')) {
      shouldUnlock = true;
    } else if (ach.id === 'chapter-champion' && p.completedTopics.length >= 12) {
      shouldUnlock = true;
    } else if (ach.id === 'board-ready' && p.quizHistory.some((q) => q.total >= 8 && q.accuracy >= 80)) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      return { ...ach, unlockedAt: now };
    }
    return ach;
  });

  // Update badgeUnlockDates for newly unlocked study badges
  const currentBadgeDates = { ...(p.badgeUnlockDates || {}) };

  if (!currentBadgeDates['photon-pioneer'] && p.completedTopics.filter((t) => t.includes('light')).length >= 5) {
    currentBadgeDates['photon-pioneer'] = dateStr;
  }
  if (!currentBadgeDates['vision-explorer'] && p.completedTopics.filter((t) => t.includes('eye')).length >= 4) {
    currentBadgeDates['vision-explorer'] = dateStr;
  }
  if (!currentBadgeDates['current-master'] && p.completedTopics.filter((t) => t.includes('elec')).length >= 4) {
    currentBadgeDates['current-master'] = dateStr;
  }
  if (!currentBadgeDates['magnetic-explorer'] && p.completedTopics.filter((t) => t.includes('mag')).length >= 4) {
    currentBadgeDates['magnetic-explorer'] = dateStr;
  }
  if (!currentBadgeDates['lab-explorer'] && p.completedSimulations.length >= 2) {
    currentBadgeDates['lab-explorer'] = dateStr;
  }
  const solvedCount = (p.solvedNumericalsCount || 0) + p.quizHistory.reduce((acc, q) => acc + (q.score || 0), 0);
  if (!currentBadgeDates['numerical-ninja'] && solvedCount >= 5) {
    currentBadgeDates['numerical-ninja'] = dateStr;
  }
  if (!currentBadgeDates['concept-master'] && p.completedTopics.length >= 10) {
    currentBadgeDates['concept-master'] = dateStr;
  }
  if (!currentBadgeDates['physics-champion'] && p.completedTopics.length >= 17) {
    currentBadgeDates['physics-champion'] = dateStr;
  }
  if (!currentBadgeDates['board-ready'] && p.quizHistory.some((q) => q.accuracy >= 80)) {
    currentBadgeDates['board-ready'] = dateStr;
  }
  if (!currentBadgeDates['ai-learner'] && (p.aiQuestionsCount || 0) >= 3) {
    currentBadgeDates['ai-learner'] = dateStr;
  }

  const finalProgress = { ...p, achievements, badgeUnlockDates: currentBadgeDates };
  saveUserProgress(finalProgress);
  return finalProgress;
}
