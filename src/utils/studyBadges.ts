import { UserProgress } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';

export interface StudyBadge {
  id: string;
  title: string;
  category: 'Optics' | 'Electricity' | 'Magnetism' | 'Laboratory' | 'Board Mastery' | 'AI Learning';
  description: string;
  milestoneRequirement: string;
  icon: string;
  badgeGradient: string;
  badgeBorder: string;
  xpReward: number;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  categoryColor: string;
}

export function computeStudyBadges(progress: UserProgress): StudyBadge[] {
  // Topics by chapter
  const lightChapter = CHAPTERS_DATA.find((c) => c.id === 'light');
  const eyeChapter = CHAPTERS_DATA.find((c) => c.id === 'human-eye');
  const elecChapter = CHAPTERS_DATA.find((c) => c.id === 'electricity');
  const magChapter = CHAPTERS_DATA.find((c) => c.id === 'magnetism');

  const lightTotal = lightChapter?.topics.length || 5;
  const eyeTotal = eyeChapter?.topics.length || 4;
  const elecTotal = elecChapter?.topics.length || 4;
  const magTotal = magChapter?.topics.length || 4;

  const lightDone = lightChapter
    ? lightChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('light')).length;

  const eyeDone = eyeChapter
    ? eyeChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('eye')).length;

  const elecDone = elecChapter
    ? elecChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('elec')).length;

  const magDone = magChapter
    ? magChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('mag')).length;

  const totalTopicsDone = progress.completedTopics.length;
  const totalSimsDone = progress.completedSimulations.length;
  const highAccuracyQuizzes = progress.quizHistory.filter((q) => q.accuracy >= 80).length;
  const aiQuestionsCount = progress.aiQuestionsCount || 0;
  const solvedNumericalsCount =
    (progress.solvedNumericalsCount || 0) +
    progress.quizHistory.reduce((acc, q) => acc + (q.score || 0), 0);

  // Chapter completions
  const lightCompleted = lightDone >= lightTotal;
  const eyeCompleted = eyeDone >= eyeTotal;
  const elecCompleted = elecDone >= elecTotal;
  const magCompleted = magDone >= magTotal;

  const chaptersCompletedCount = [lightCompleted, eyeCompleted, elecCompleted, magCompleted].filter(
    Boolean
  ).length;

  const savedDates = progress.badgeUnlockDates || {};

  const badgesRaw = [
    {
      id: 'photon-pioneer',
      title: 'Photon Pioneer',
      category: 'Optics' as const,
      description: 'Master ray optics, reflection, refraction, and lens & mirror formulas.',
      milestoneRequirement: 'Complete the Light – Reflection & Refraction chapter',
      icon: '🔦',
      badgeGradient: 'from-blue-600 to-cyan-500',
      badgeBorder: 'border-blue-300 dark:border-blue-700',
      categoryColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      xpReward: 150,
      currentValue: lightDone,
      targetValue: lightTotal,
      forceUnlocked: lightCompleted,
    },
    {
      id: 'vision-explorer',
      title: 'Vision Explorer',
      category: 'Optics' as const,
      description: 'Explore human eye accommodation, defects of vision, and atmospheric refraction.',
      milestoneRequirement: 'Complete The Human Eye and the Colourful World chapter',
      icon: '👁️',
      badgeGradient: 'from-purple-500 to-indigo-600',
      badgeBorder: 'border-purple-300 dark:border-purple-700',
      categoryColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      xpReward: 150,
      currentValue: eyeDone,
      targetValue: eyeTotal,
      forceUnlocked: eyeCompleted,
    },
    {
      id: 'current-master',
      title: 'Current Master',
      category: 'Electricity' as const,
      description: 'Command Ohm’s Law, electric potential, Joule’s heating, and resistor networks.',
      milestoneRequirement: 'Complete the Electricity chapter',
      icon: '⚡',
      badgeGradient: 'from-amber-500 to-yellow-600',
      badgeBorder: 'border-amber-300 dark:border-amber-700',
      categoryColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      xpReward: 150,
      currentValue: elecDone,
      targetValue: elecTotal,
      forceUnlocked: elecCompleted,
    },
    {
      id: 'magnetic-explorer',
      title: 'Magnetic Explorer',
      category: 'Magnetism' as const,
      description: 'Master magnetic fields, Fleming’s Left-Hand Rule, solenoids, and electric motors.',
      milestoneRequirement: 'Complete Magnetic Effects of Electric Current chapter',
      icon: '🧲',
      badgeGradient: 'from-rose-500 to-red-600',
      badgeBorder: 'border-rose-300 dark:border-rose-700',
      categoryColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      xpReward: 150,
      currentValue: magDone,
      targetValue: magTotal,
      forceUnlocked: magCompleted,
    },
    {
      id: 'lab-explorer',
      title: 'Lab Explorer',
      category: 'Laboratory' as const,
      description: 'Conduct hands-on virtual experiments across optics, circuits, and magnetic apparatus.',
      milestoneRequirement: 'Complete at least 2 interactive virtual experiments',
      icon: '🔬',
      badgeGradient: 'from-emerald-500 to-teal-600',
      badgeBorder: 'border-emerald-300 dark:border-emerald-700',
      categoryColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      xpReward: 120,
      currentValue: totalSimsDone,
      targetValue: 2,
    },
    {
      id: 'numerical-ninja',
      title: 'Numerical Ninja',
      category: 'Board Mastery' as const,
      description: 'Master step-by-step CBSE numerical problem solving with proper units & sign conventions.',
      milestoneRequirement: 'Solve at least 5 Physics numericals / quiz questions',
      icon: '🧮',
      badgeGradient: 'from-sky-500 to-blue-600',
      badgeBorder: 'border-sky-300 dark:border-sky-700',
      categoryColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      xpReward: 150,
      currentValue: solvedNumericalsCount,
      targetValue: 5,
    },
    {
      id: 'concept-master',
      title: 'Concept Master',
      category: 'Board Mastery' as const,
      description: 'Build deep foundational clarity across major Class 10 physics concepts.',
      milestoneRequirement: 'Complete 10 or more topics across all chapters',
      icon: '📚',
      badgeGradient: 'from-violet-600 to-purple-700',
      badgeBorder: 'border-violet-300 dark:border-violet-700',
      categoryColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
      xpReward: 200,
      currentValue: totalTopicsDone,
      targetValue: 10,
    },
    {
      id: 'physics-champion',
      title: 'Physics Champion',
      category: 'Board Mastery' as const,
      description: 'The pinnacle achievement: complete the entire Class 10 CBSE Physics syllabus.',
      milestoneRequirement: 'Complete all 4 CBSE Physics chapters',
      icon: '🏆',
      badgeGradient: 'from-amber-400 via-orange-500 to-yellow-500',
      badgeBorder: 'border-amber-300 dark:border-amber-500',
      categoryColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
      xpReward: 300,
      currentValue: chaptersCompletedCount,
      targetValue: 4,
    },
    {
      id: 'board-ready',
      title: 'Board Ready',
      category: 'Board Mastery' as const,
      description: 'Demonstrate examination excellence by scoring 80% or higher in practice assessments.',
      milestoneRequirement: 'Score 80%+ accuracy on at least 1 CBSE practice quiz',
      icon: '🎯',
      badgeGradient: 'from-emerald-600 to-green-500',
      badgeBorder: 'border-emerald-300 dark:border-emerald-700',
      categoryColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      xpReward: 180,
      currentValue: highAccuracyQuizzes,
      targetValue: 1,
    },
    {
      id: 'ai-learner',
      title: 'AI Learner',
      category: 'AI Learning' as const,
      description: 'Engage with Enjoy Physics AI to clarify concepts, verify formulas, and resolve doubts.',
      milestoneRequirement: 'Ask 3 or more questions to Enjoy Physics AI Tutor',
      icon: '🤖',
      badgeGradient: 'from-fuchsia-500 to-pink-600',
      badgeBorder: 'border-fuchsia-300 dark:border-fuchsia-700',
      categoryColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300',
      xpReward: 120,
      currentValue: aiQuestionsCount,
      targetValue: 3,
    },
  ];

  return badgesRaw.map((b) => {
    const isUnlocked = b.forceUnlocked || b.currentValue >= b.targetValue;
    const progressPercent = Math.min(
      100,
      Math.round((b.currentValue / (b.targetValue || 1)) * 100)
    );
    const existingDate = savedDates[b.id] || (isUnlocked ? 'Completed' : undefined);

    return {
      id: b.id,
      title: b.title,
      category: b.category,
      description: b.description,
      milestoneRequirement: b.milestoneRequirement,
      icon: b.icon,
      badgeGradient: b.badgeGradient,
      badgeBorder: b.badgeBorder,
      categoryColor: b.categoryColor,
      xpReward: b.xpReward,
      currentValue: Math.min(b.currentValue, b.targetValue),
      targetValue: b.targetValue,
      progressPercent,
      isUnlocked,
      unlockedDate: existingDate,
    };
  });
}

export function getTotalBadgeXP(badges: StudyBadge[]): number {
  return badges.filter((b) => b.isUnlocked).reduce((sum, b) => sum + b.xpReward, 0);
}
