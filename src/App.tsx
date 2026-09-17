import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/HomePage';
import { ChapterView } from './components/ChapterView';
import { SimulationsHub } from './components/SimulationsHub';
import { QuestionBankView } from './components/QuestionBankView';
import { PracticeEngine } from './components/PracticeEngine';
import { BoardPrepHub } from './components/BoardPrepHub';
import { FormulaCalculator } from './components/FormulaCalculator';
import { DiagramsViewer } from './components/DiagramsViewer';
import { AITutor } from './components/AITutor';
import { ProgressDashboard } from './components/ProgressDashboard';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { CHAPTERS_DATA } from './data/chaptersData';
import {
  loadUserProgress,
  saveUserProgress,
  toggleTopicCompleted,
  markSimulationCompleted,
  recordQuizAttempt,
  toggleBookmarkQuestion,
  resetProgress,
} from './utils/progressStorage';
import { UserProgress } from './types/physics';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeChapterId, setActiveChapterId] = useState<string>('light');
  const [activeSimulationId, setActiveSimulationId] = useState<string>('sim-concave-mirror');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('enjoy_physics_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('enjoy_physics_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('enjoy_physics_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleNavigate = (view: string, subId?: string) => {
    setCurrentView(view);
    if (view === 'chapter' && subId) {
      setActiveChapterId(subId);
    }
    if (view === 'simulations' && subId) {
      setActiveSimulationId(subId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTopic = (topicId: string) => {
    const updated = toggleTopicCompleted(topicId, progress);
    setProgress(updated);
    const isDone = updated.completedTopics.includes(topicId);
    showToast(isDone ? 'Topic marked as completed! (+10 XP)' : 'Topic unmarked');
  };

  const handleMarkSimCompleted = (simId: string) => {
    const updated = markSimulationCompleted(simId, progress);
    setProgress(updated);
    showToast('Virtual Experiment marked as completed! (+25 XP)');
  };

  const handleRecordQuizAttempt = (attempt: {
    chapterId: string;
    score: number;
    total: number;
    accuracy: number;
    timeTakenSeconds: number;
    weakTopics: string[];
  }) => {
    const updated = recordQuizAttempt(attempt, progress);
    setProgress(updated);
    showToast(`Test recorded! Accuracy: ${attempt.accuracy}%`);
  };

  const handleToggleBookmark = (qId: string) => {
    const updated = toggleBookmarkQuestion(qId, progress);
    setProgress(updated);
    const isSaved = updated.bookmarkedQuestions.includes(qId);
    showToast(isSaved ? 'Question added to bookmarks' : 'Question removed from bookmarks');
  };

  const handleResetProgress = () => {
    const reset = resetProgress();
    setProgress(reset);
    showToast('Progress reset successfully');
  };

  // Calculate overall syllabus percentage
  const totalTopics = CHAPTERS_DATA.reduce((acc, ch) => acc + ch.topics.length, 0);
  const progressPercent = Math.round((progress.completedTopics.length / (totalTopics || 1)) * 100);

  const selectedChapter = CHAPTERS_DATA.find((c) => c.id === activeChapterId) || CHAPTERS_DATA[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        progressPercent={progressPercent}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            completedTopics={progress.completedTopics}
          />
        )}

        {currentView === 'chapter' && (
          <ChapterView
            chapter={selectedChapter}
            completedTopics={progress.completedTopics}
            onToggleTopic={handleToggleTopic}
            onNavigateSim={(simId) => handleNavigate('simulations', simId)}
          />
        )}

        {currentView === 'simulations' && (
          <SimulationsHub
            initialSimId={activeSimulationId}
            onMarkCompleted={handleMarkSimCompleted}
            completedSimulations={progress.completedSimulations}
          />
        )}

        {currentView === 'question-bank' && (
          <QuestionBankView
            bookmarkedIds={progress.bookmarkedQuestions}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'practice' && (
          <PracticeEngine onRecordAttempt={handleRecordQuizAttempt} />
        )}

        {currentView === 'board-prep' && <BoardPrepHub />}

        {currentView === 'formulas' && <FormulaCalculator />}

        {currentView === 'diagrams' && <DiagramsViewer />}

        {currentView === 'ai-tutor' && <AITutor />}

        {currentView === 'progress' && (
          <ProgressDashboard
            progress={progress}
            onResetProgress={handleResetProgress}
            onNavigateChapter={(chId) => handleNavigate('chapter', chId)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Search Popover */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default App;
