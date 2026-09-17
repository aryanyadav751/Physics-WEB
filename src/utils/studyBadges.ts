import { UserProgress } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';

export interface StudyBadge {
  id: string;
  title: string;
  category: 'Optics' | 'Electricity' | 'Magnetism' | 'Laboratory' | 'Board Mastery';
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
  // Find topics completed by chapter
  const lightChapter = CHAPTERS_DATA.find((c) => c.id === 'light');
  const eyeChapter = CHAPTERS_DATA.find((c) => c.id === 'human-eye');
  const elecChapter = CHAPTERS_DATA.find((c) => c.id === 'electricity');
  const magChapter = CHAPTERS_DATA.find((c) => c.id === 'magnetism');

  const lightTopicsDone = lightChapter
    ? lightChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('light')).length;

  const eyeTopicsDone = eyeChapter
    ? eyeChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('eye')).length;

  const elecTopicsDone = elecChapter
    ? elecChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('elec')).length;

  const magTopicsDone = magChapter
    ? magChapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length
    : progress.completedTopics.filter((t) => t.includes('mag')).length;

  const totalTopicsDone = progress.completedTopics.length;
  const totalSimsDone = progress.completedSimulations.length;
  const totalQuizzes = progress.quizHistory.length;
  const highAccuracyQuizzes = progress.quizHistory.filter((q) => q.accuracy >= 80).length;
  const perfectScoreQuizzes = progress.quizHistory.filter((q) => q.accuracy === 100).length;

  const badgesRaw = [
    {
      id: 'photon-pioneer',
      title: 'Photon Pioneer',
      category: 'Optics' as const,
      description: 'Master ray optics, mirrors, refraction, and lens formulas.',
      milestoneRequirement: 'Complete at least 3 topics in Light: Reflection & Refraction',
      icon: '🔦',
      badgeGradient: 'from-blue-600 to-cyan-500',
      badgeBorder: 'border-blue-300 dark:border-blue-700',
      categoryColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      xpReward: 100,
      currentValue: lightTopicsDone,
      targetValue: 3,
    },
    {
      id: 'newtonian-expert',
      title: 'Newtonian Expert',
      category: 'Board Mastery' as const,
      description: 'Demonstrate rigorous physics calculation and concept accuracy.',
      milestoneRequirement: 'Score 80%+ accuracy on at least 1 practice test',
      icon: '🍎',
      badgeGradient: 'from-amber-500 to-orange-600',
      badgeBorder: 'border-amber-300 dark:border-amber-700',
      categoryColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      xpReward: 150,
      currentValue: highAccuracyQuizzes,
      targetValue: 1,
    },
    {
      id: 'current-commander',
      title: 'Current Commander',
      category: 'Electricity' as const,
      description: 'Command circuit equations, Ohm’s Law, and resistor combinations.',
      milestoneRequirement: 'Complete at least 3 topics in Electricity',
      icon: '⚡',
      badgeGradient: 'from-yellow-500 to-amber-600',
      badgeBorder: 'border-yellow-300 dark:border-yellow-700',
      categoryColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
      xpReward: 100,
      currentValue: elecTopicsDone,
      targetValue: 3,
    },
    {
      id: 'lorentz-virtuoso',
      title: 'Lorentz Virtuoso',
      category: 'Magnetism' as const,
      description: 'Master magnetic field lines, Fleming’s Left-Hand rule, and motors.',
      milestoneRequirement: 'Complete at least 2 topics in Magnetic Effects of Electric Current',
      icon: '🧲',
      badgeGradient: 'from-rose-500 to-red-600',
      badgeBorder: 'border-rose-300 dark:border-rose-700',
      categoryColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      xpReward: 100,
      currentValue: magTopicsDone,
      targetValue: 2,
    },
    {
      id: 'rainbow-architect',
      title: 'Rainbow Architect',
      category: 'Optics' as const,
      description: 'Understand atmospheric refraction, rainbow dispersion, and eye defects.',
      milestoneRequirement: 'Complete at least 2 topics in The Human Eye and the Colourful World',
      icon: '🌈',
      badgeGradient: 'from-purple-500 to-pink-500',
      badgeBorder: 'border-purple-300 dark:border-purple-700',
      categoryColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      xpReward: 100,
      currentValue: eyeTopicsDone,
      targetValue: 2,
    },
    {
      id: 'virtual-lab-phenom',
      title: 'Virtual Lab Phenom',
      category: 'Laboratory' as const,
      description: 'Conduct virtual experiments with lenses, circuits, and magnetic fields.',
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
      id: 'centum-striver',
      title: 'Centum Striver',
      category: 'Board Mastery' as const,
      description: 'Achieve absolute perfection with 100% accuracy on a practice quiz.',
      milestoneRequirement: 'Achieve 100% score on any practice exam',
      icon: '💯',
      badgeGradient: 'from-indigo-600 to-blue-600',
      badgeBorder: 'border-indigo-300 dark:border-indigo-700',
      categoryColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      xpReward: 200,
      currentValue: perfectScoreQuizzes,
      targetValue: 1,
    },
    {
      id: 'curie-scholar',
      title: 'Curie Scholar',
      category: 'Board Mastery' as const,
      description: 'Demonstrate deep CBSE physics syllabus dedication.',
      milestoneRequirement: 'Complete 8 or more topics across all 4 chapters',
      icon: '🏆',
      badgeGradient: 'from-amber-400 to-yellow-600',
      badgeBorder: 'border-amber-300 dark:border-amber-600',
      categoryColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
      xpReward: 250,
      currentValue: totalTopicsDone,
      targetValue: 8,
    },
  ];

  return badgesRaw.map((b) => {
    const isUnlocked = b.currentValue >= b.targetValue;
    const progressPercent = Math.min(100, Math.round((b.currentValue / (b.targetValue || 1)) * 100));
    return {
      ...b,
      progressPercent,
      isUnlocked,
    };
  });
}

export function getTotalBadgeXP(badges: StudyBadge[]): number {
  return badges.filter((b) => b.isUnlocked).reduce((sum, b) => sum + b.xpReward, 0);
}
