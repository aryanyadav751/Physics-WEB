export type ChapterId = 'light' | 'human-eye' | 'electricity' | 'magnetism';

export interface VariableInfo {
  symbol: string;
  name: string;
  unit: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  expression: string;
  variables: VariableInfo[];
  whenToUse: string;
  exampleProblem: {
    given: string;
    calculation: string;
    answer: string;
  };
  category: ChapterId;
}

export interface DefinitionItem {
  id: string;
  term: string;
  definition: string;
  examNote?: string;
  chapterId: ChapterId;
}

export interface SolvedExample {
  id: string;
  title: string;
  problem: string;
  given: string[];
  toFind: string;
  formula: string;
  steps: string[];
  answer: string;
  boardTip?: string;
}

export interface NumericalProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Difficult' | 'Board-Level';
  problem: string;
  given: string[];
  formula: string;
  steps: string[];
  finalAnswer: string;
  unit: string;
  hint: string;
  chapterId: ChapterId;
}

export type QuestionType =
  | 'MCQ'
  | 'Assertion-Reason'
  | 'Very Short'
  | 'Short Answer'
  | 'Long Answer'
  | 'Case-Based'
  | 'Numerical'
  | 'Diagram-Based';

export interface QuestionItem {
  id: string;
  chapterId: ChapterId;
  topicId: string;
  type: QuestionType;
  marks: 1 | 2 | 3 | 4 | 5;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Board-Level';
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  assertion?: string;
  reason?: string;
  casePassage?: string;
  answer: string;
  explanation: string;
  concept: string;
  formulaUsed?: string;
  boardYear?: string;
}

export interface TopicItem {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  detailedNotes: string[];
  diagramId?: string;
  examPitfall?: string;
}

export interface ChapterData {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  tagline: string;
  iconName: string;
  colorTheme: {
    primary: string;
    accent: string;
    bgLight: string;
    badge: string;
  };
  weightageInBoard: string;
  overview: string;
  topics: TopicItem[];
  formulas: FormulaItem[];
  definitions: DefinitionItem[];
  solvedExamples: SolvedExample[];
  numericals: NumericalProblem[];
  boardQuestions: QuestionItem[];
  boardPrep: {
    frequentlyTested: string[];
    importantDiagrams: string[];
    commonMistakes: Array<{ mistake: string; correction: string; why: string }>;
    examTips: string[];
  };
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface SimulationMeta {
  id: string;
  title: string;
  chapterId: ChapterId;
  category: 'Light' | 'Electricity' | 'Magnetism';
  tagline: string;
  aim: string;
  apparatus: string[];
  theory: string;
  procedure: string[];
  precautions: string[];
  vivaQuestions: VivaQuestion[];
}

export interface DiagramItem {
  id: string;
  title: string;
  chapterId: ChapterId;
  category: string;
  description: string;
  labels: string[];
  boardTips: string;
  commonErrors: string;
}

export interface UserProgress {
  completedTopics: string[];
  completedChapters: string[];
  completedSimulations: string[];
  bookmarkedQuestions: string[];
  quizHistory: Array<{
    id: string;
    date: string;
    chapterId: string;
    score: number;
    total: number;
    accuracy: number;
    timeTakenSeconds: number;
    weakTopics: string[];
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }>;
}

export type { StudyBadge } from '../utils/studyBadges';
