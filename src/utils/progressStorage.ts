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
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      achievements: INITIAL_ACHIEVEMENTS.map((a) => {
        const existing = parsed.achievements?.find((p: any) => p.id === a.id);
        return existing || a;
      }),
    };
  } catch {
    return INITIAL_PROGRESS;
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

  const finalProgress = { ...p, achievements };
  saveUserProgress(finalProgress);
  return finalProgress;
}
