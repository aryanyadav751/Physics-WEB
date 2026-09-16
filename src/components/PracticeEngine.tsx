import React, { useState, useEffect } from 'react';
import { QUESTION_BANK } from '../data/questionBankData';
import { QuestionItem } from '../types/physics';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Flag,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface PracticeEngineProps {
  onRecordAttempt?: (attempt: {
    chapterId: string;
    score: number;
    total: number;
    accuracy: number;
    timeTakenSeconds: number;
    weakTopics: string[];
  }) => void;
}

export const PracticeEngine: React.FC<PracticeEngineProps> = ({ onRecordAttempt }) => {
  // Setup state
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');

  // Active test state
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes default
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestActive, isSubmitted]);

  const handleStartTest = () => {
    let pool = [...QUESTION_BANK];
    if (selectedChapter !== 'all') {
      pool = pool.filter((q) => q.chapterId === selectedChapter);
    }
    // Filter MCQ and Assertion-Reason for automated scoring
    const scorablePool = pool.filter((q) => q.options && q.options.length > 0);
    const shuffled = scorablePool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemaining(selected.length * 90); // 1.5 min per question
    setIsSubmitted(false);
    setIsTestActive(true);
  };

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const toggleMarkReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);

    // Calculate score
    let score = 0;
    const weakTopics: string[] = [];

    activeQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctOptionIndex) {
        score += 1;
      } else {
        if (!weakTopics.includes(q.concept)) {
          weakTopics.push(q.concept);
        }
      }
    });

    const accuracy = Math.round((score / (activeQuestions.length || 1)) * 100);
    const timeSpent = activeQuestions.length * 90 - timeRemaining;

    if (onRecordAttempt) {
      onRecordAttempt({
        chapterId: selectedChapter,
        score,
        total: activeQuestions.length,
        accuracy,
        timeTakenSeconds: timeSpent,
        weakTopics,
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = activeQuestions[currentIndex];

  // Screen 1: Test Builder Configuration
  if (!isTestActive) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              Practice & Mock Test Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Custom CBSE Class 10 Physics Practice Engine
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Build custom quizzes to evaluate your preparation level, improve problem-solving speed, and identify conceptual weaknesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Chapter Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Choose Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="all">Full Syllabus (All Chapters)</option>
                <option value="light">Light: Reflection and Refraction</option>
                <option value="human-eye">The Human Eye & Colourful World</option>
                <option value="electricity">Electricity</option>
                <option value="magnetism">Magnetic Effects of Electric Current</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Number of Questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                      questionCount === cnt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Practice Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === 'practice'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Self-Paced Practice
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Instant feedback after answering each question with complete CBSE explanations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('exam')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === 'exam'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Timed Exam Simulation
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Countdown timer, question navigation palette, and full analysis scorecard upon submission.
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleStartTest}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs flex items-center gap-2"
            >
              Start Practice Session <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Test Submitted Scorecard
  if (isSubmitted) {
    let score = 0;
    const weakConcepts: string[] = [];

    activeQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctOptionIndex) {
        score += 1;
      } else {
        if (!weakConcepts.includes(q.concept)) {
          weakConcepts.push(q.concept);
        }
      }
    });

    const accuracy = Math.round((score / activeQuestions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Scorecard Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-2xl">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Performance Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Score</span>
              <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                {score} / {activeQuestions.length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Accuracy</span>
              <span className={`text-xl font-mono font-bold ${accuracy >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {accuracy}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Attempted</span>
              <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {Object.keys(userAnswers).length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Grade</span>
              <span className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                {accuracy >= 85 ? 'A1' : accuracy >= 70 ? 'A2' : accuracy >= 50 ? 'B1' : 'Needs Practice'}
              </span>
            </div>
          </div>

          {/* Weak Topics Callout */}
          {weakConcepts.length > 0 && (
            <div className="max-w-xl mx-auto p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4" /> Recommended Topics for Revision:
              </div>
              <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1 pt-1">
                {weakConcepts.map((con, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsTestActive(false)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Start New Test
            </button>
          </div>
        </div>

        {/* Detailed Solutions Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Question-by-Question Solution Review
          </h3>

          {activeQuestions.map((q, idx) => {
            const chosen = userAnswers[q.id];
            const isCorrect = chosen === q.correctOptionIndex;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/60'
                    : 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-800/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Question {idx + 1}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  {q.question}
                </p>

                {/* Options List */}
                <div className="space-y-1.5 mb-3">
                  {q.options?.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    const isRight = optIdx === q.correctOptionIndex;

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                          isRight
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                            : isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {isRight && <span className="text-[10px] font-bold uppercase">Correct Answer</span>}
                        {isSelected && !isRight && <span className="text-[10px] font-bold uppercase">Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Explanation: </strong>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Screen 3: Live Active Test View
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Test Top Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6 flex items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {currentQ.concept}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
          <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        <button
          type="button"
          onClick={handleSubmitTest}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          Submit Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Question Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-mono">
                {currentQ.type} • 1 Mark
              </span>
              <button
                type="button"
                onClick={() => toggleMarkReview(currentQ.id)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                  markedForReview[currentQ.id]
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <p className="text-base sm:text-lg text-slate-900 dark:text-white font-medium leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, i) => {
                const isSelected = userAnswers[currentQ.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, i)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Instant Explanation */}
            {mode === 'practice' && userAnswers[currentQ.id] !== undefined && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 animate-fadeIn">
                <div className="font-bold text-slate-900 dark:text-white">
                  {userAnswers[currentQ.id] === currentQ.correctOptionIndex ? (
                    <span className="text-emerald-600">✓ Correct!</span>
                  ) : (
                    <span className="text-rose-600">✗ Incorrect.</span>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={currentIndex === activeQuestions.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Palette
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isMarked = markedForReview[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold font-mono transition-all relative ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                        : ''
                    } ${
                      isMarked
                        ? 'bg-amber-500 text-white'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span>Answered ({Object.keys(userAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered ({activeQuestions.length - Object.keys(userAnswers).length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
