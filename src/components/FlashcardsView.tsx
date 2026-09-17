import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Shuffle,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Grid,
  CreditCard,
  Filter,
  Bookmark,
  Info,
  Lightbulb,
} from 'lucide-react';
import {
  CORE_PHYSICS_DEFINITIONS,
  FlashcardDefinition,
  DefinitionCategory,
} from '../data/flashcardsData';
import { ChapterId } from '../types/physics';

interface FlashcardsViewProps {
  initialChapterId?: ChapterId | 'all';
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  initialChapterId = 'all',
}) => {
  const [selectedChapter, setSelectedChapter] = useState<ChapterId | 'all'>(initialChapterId);
  const [selectedCategory, setSelectedCategory] = useState<DefinitionCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});
  const [needsRevisionIds, setNeedsRevisionIds] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreviewed' | 'mastered' | 'review'>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [shuffleNotice, setShuffleNotice] = useState<string | null>(null);

  // Filter definitions based on chapter, category, and status
  const filteredCards = useMemo(() => {
    let list = [...CORE_PHYSICS_DEFINITIONS];

    if (selectedChapter !== 'all') {
      list = list.filter((c) => c.chapterId === selectedChapter);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (statusFilter === 'mastered') {
      list = list.filter((c) => masteredIds[c.id]);
    } else if (statusFilter === 'review') {
      list = list.filter((c) => needsRevisionIds[c.id]);
    } else if (statusFilter === 'unreviewed') {
      list = list.filter((c) => !masteredIds[c.id] && !needsRevisionIds[c.id]);
    }

    return list;
  }, [selectedChapter, selectedCategory, statusFilter, masteredIds, needsRevisionIds]);

  // Current deck of cards (randomizable)
  const [deck, setDeck] = useState<FlashcardDefinition[]>(() => filteredCards);

  // Sync deck when base filter changes
  useEffect(() => {
    setDeck(filteredCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filteredCards]);

  // Handle deck shuffle (Fisher-Yates)
  const handleShuffle = useCallback(() => {
    if (deck.length <= 1) return;
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffleNotice('Deck shuffled randomly!');
    setTimeout(() => setShuffleNotice(null), 2500);
  }, [deck]);

  // Jump to random card in current deck
  const handleRandomCard = useCallback(() => {
    if (deck.length <= 1) return;
    const randomIndex = Math.floor(Math.random() * deck.length);
    setCurrentIndex(randomIndex);
    setIsFlipped(false);
  }, [deck]);

  // Current single card
  const currentCard: FlashcardDefinition | undefined = deck[currentIndex];

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, deck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleToggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'card') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        if (currentCard) {
          handleMarkNeedsRevision(currentCard.id);
        }
      } else if (e.key === '2') {
        if (currentCard) {
          handleMarkMastered(currentCard.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleToggleFlip, handleNext, handlePrev, currentCard]);

  // Audio Speech Synthesis
  const handleSpeak = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Mark mastery statuses
  const handleMarkMastered = (id: string) => {
    setMasteredIds((prev) => ({ ...prev, [id]: true }));
    setNeedsRevisionIds((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Auto advance if in card mode
    if (viewMode === 'card' && currentIndex < deck.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 250);
    }
  };

  const handleMarkNeedsRevision = (id: string) => {
    setNeedsRevisionIds((prev) => ({ ...prev, [id]: true }));
    setMasteredIds((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Auto advance
    if (viewMode === 'card' && currentIndex < deck.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 250);
    }
  };

  const handleResetMastery = () => {
    if (window.confirm('Reset all flashcard revision progress for this session?')) {
      setMasteredIds({});
      setNeedsRevisionIds({});
      setRevealedIds({});
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Global Grid Reveal/Hide
  const handleRevealAll = () => {
    const all: Record<string, boolean> = {};
    deck.forEach((c) => {
      all[c.id] = true;
    });
    setRevealedIds(all);
  };

  const handleHideAll = () => {
    setRevealedIds({});
  };

  const toggleCardReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Chapter theme colors
  const getChapterColor = (chapterId: ChapterId) => {
    switch (chapterId) {
      case 'light':
        return {
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          accent: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50/50 dark:bg-blue-950/20',
          border: 'border-blue-300 dark:border-blue-800',
        };
      case 'human-eye':
        return {
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          accent: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50/50 dark:bg-purple-950/20',
          border: 'border-purple-300 dark:border-purple-800',
        };
      case 'electricity':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          accent: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50/50 dark:bg-amber-950/20',
          border: 'border-amber-300 dark:border-amber-800',
        };
      case 'magnetism':
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          accent: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
          border: 'border-emerald-300 dark:border-emerald-800',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          accent: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-slate-50 dark:bg-slate-900',
          border: 'border-slate-200 dark:border-slate-800',
        };
    }
  };

  // Progress metrics
  const totalDeckCount = deck.length;
  const masteredCount = deck.filter((c) => masteredIds[c.id]).length;
  const revisionCount = deck.filter((c) => needsRevisionIds[c.id]).length;
  const masteryPercentage = totalDeckCount > 0 ? Math.round((masteredCount / totalDeckCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Notification */}
      {shuffleNotice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg animate-fadeIn flex items-center gap-2">
          <Shuffle className="w-3.5 h-3.5 animate-spin" />
          <span>{shuffleNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CBSE Class 10 Active Recall Deck</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-blue-400" />
              Physics Definition Flashcards
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Randomly pull and self-test key NCERT definitions, laws, rules, and SI units across all 4 physics chapters. Toggle visibility to challenge your memory before the board examination!
            </p>
          </div>

          {/* Quick Mastery Summary Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>Deck Mastery</span>
              <span className="font-mono text-emerald-400">{masteryPercentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
              <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> {masteredCount} Mastered
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <AlertCircle className="w-3 h-3" /> {revisionCount} Review
              </span>
              <span className="text-slate-400">Total: {totalDeckCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Chapter Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Chapter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedChapter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChapter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Chapters ({CORE_PHYSICS_DEFINITIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedChapter('light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChapter === 'light'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setSelectedChapter('human-eye')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChapter === 'human-eye'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Human Eye
            </button>
            <button
              type="button"
              onClick={() => setSelectedChapter('electricity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChapter === 'electricity'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Electricity
            </button>
            <button
              type="button"
              onClick={() => setSelectedChapter('magnetism')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChapter === 'magnetism'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Magnetism
            </button>
          </div>

          {/* View Mode Toggle & Shuffle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Shuffle the card order randomly"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-500" />
              <span>Shuffle Deck</span>
            </button>

            <button
              type="button"
              onClick={handleRandomCard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Pick a surprise card"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Random Card</span>
            </button>

            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Single Card Focus Mode"
              >
                <CreditCard className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Interactive Recall Grid Mode"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Category and Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium">Category:</span>
            {(['all', 'Law', 'Term', 'Rule', 'Unit', 'Phenomenon'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="all">All Cards</option>
              <option value="unreviewed">Unreviewed Only</option>
              <option value="mastered">Mastered Only</option>
              <option value="review">Needs Revision</option>
            </select>

            {(masteredCount > 0 || revisionCount > 0) && (
              <button
                type="button"
                onClick={handleResetMastery}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px] ml-2 cursor-pointer"
                title="Reset session marks"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SINGLE CARD FOCUS FLIP MODE                                       */}
      {/* ========================================================================= */}
      {viewMode === 'card' && currentCard && (
        <div className="space-y-6">
          {/* Card Carousel Navigation Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Card {currentIndex + 1} of {deck.length}
              </span>
              {masteredIds[currentCard.id] && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Mastered
                </span>
              )}
              {needsRevisionIds[currentCard.id] && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 text-[10px] font-bold">
                  <AlertCircle className="w-3 h-3" /> Needs Revision
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-slate-400">
                Shortcuts: <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">Space</kbd> Flip • <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">→</kbd> Nav
              </span>
            </div>
          </div>

          {/* Interactive 3D Flip Card Container */}
          <div className="relative w-full min-h-[380px] sm:min-h-[420px] cursor-pointer perspective-1000 select-none">
            <div
              onClick={handleToggleFlip}
              className={`w-full min-h-[380px] sm:min-h-[420px] rounded-3xl border transition-all duration-300 shadow-md hover:shadow-xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden ${
                isFlipped
                  ? 'bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              {/* Top Card Badges */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      getChapterColor(currentCard.chapterId).badge
                    }`}
                  >
                    {currentCard.chapterName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {currentCard.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[11px] font-bold border border-red-200 dark:border-red-900">
                    {currentCard.frequency}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(
                        isFlipped
                          ? `${currentCard.term}. ${currentCard.definition}`
                          : currentCard.term
                      );
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                    }`}
                    title="Pronounce term & definition"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Middle Content: Front (Term) vs Back (Definition + Details) */}
              <div className="my-auto py-6">
                {!isFlipped ? (
                  /* FRONT: QUESTION / TERM PROMPT */
                  <div className="text-center space-y-4 max-w-2xl mx-auto animate-fadeIn">
                    <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold block">
                      NCERT CBSE Physics Term
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                      {currentCard.term}
                    </h2>
                    <div className="pt-4 inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-4 py-2 rounded-2xl border border-blue-200/80 dark:border-blue-800/80">
                      <Eye className="w-4 h-4" /> Click card or press Spacebar to reveal official definition
                    </div>
                  </div>
                ) : (
                  /* BACK: OFFICIAL NCERT DEFINITION & CBSE FORMULAS */
                  <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5" /> Official CBSE Definition
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{currentCard.term}</span>
                    </div>

                    <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                      {currentCard.definition}
                    </p>

                    {/* Formula or Unit Pill */}
                    {currentCard.formulaOrUnit && (
                      <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5">
                        <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 mt-0.5">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                            Formula / Law Relation / SI Unit
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-bold text-blue-700 dark:text-blue-300">
                            {currentCard.formulaOrUnit}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CBSE Exam Tip Callout */}
                    {currentCard.cbseTip && (
                      <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
                        <div className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300 mt-0.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block font-mono">
                            CBSE Board Exam Tip
                          </span>
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            {currentCard.cbseTip}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer Actions */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={handleToggleFlip}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {isFlipped ? (
                    <>
                      <EyeOff className="w-4 h-4 text-slate-400" />
                      <span>Hide Definition (Front)</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Reveal Definition (Back)</span>
                    </>
                  )}
                </button>

                {/* Self Evaluation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkNeedsRevision(currentCard.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      needsRevisionIds[currentCard.id]
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Need Practice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkMastered(currentCard.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      masteredIds[currentCard.id]
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>I Know This!</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Prev / Next Navigation Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Card
            </button>

            {/* Indicator Dots for Nearby Cards */}
            <div className="flex items-center gap-1.5 max-w-[240px] overflow-hidden">
              {deck.slice(Math.max(0, currentIndex - 4), Math.min(deck.length, currentIndex + 5)).map((c, idx) => {
                const actualIdx = Math.max(0, currentIndex - 4) + idx;
                const isCurrent = actualIdx === currentIndex;
                const isDone = masteredIds[c.id];
                const isRev = needsRevisionIds[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(actualIdx);
                      setIsFlipped(false);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      isCurrent
                        ? 'w-6 bg-blue-600 dark:bg-blue-400'
                        : isDone
                        ? 'w-2 bg-emerald-500'
                        : isRev
                        ? 'w-2 bg-amber-500'
                        : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={`Card ${actualIdx + 1}: ${c.term}`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === deck.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              Next Card <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE RECALL GRID SHEET                                      */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {/* Grid Quick Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
              Displaying {deck.length} Physics Definitions
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHideAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Hide all definitions to self-test your memory"
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide All (Active Recall Mode)</span>
              </button>
              <button
                type="button"
                onClick={handleRevealAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Reveal all definitions"
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>Reveal All</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deck.map((card, idx) => {
              const isRevealed = !!revealedIds[card.id];
              const isMastered = !!masteredIds[card.id];
              const isNeedsRev = !!needsRevisionIds[card.id];
              const colors = getChapterColor(card.chapterId);

              return (
                <div
                  key={card.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                    isMastered
                      ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/10'
                      : isNeedsRev
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.badge}`}>
                          {card.chapterName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {card.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                        {idx + 1}. {card.term}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCardReveal(card.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isRevealed
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      title={isRevealed ? 'Hide Definition' : 'Show Definition'}
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Body Content (Toggled) */}
                  <div className="flex-1">
                    {isRevealed ? (
                      <div className="space-y-2.5 animate-fadeIn">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                          {card.definition}
                        </p>

                        {card.formulaOrUnit && (
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono text-blue-600 dark:text-blue-400">
                            <strong>Formula/Unit:</strong> {card.formulaOrUnit}
                          </div>
                        )}

                        {card.cbseTip && (
                          <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">
                            💡 {card.cbseTip}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => toggleCardReveal(card.id)}
                        className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 text-center cursor-pointer hover:bg-slate-100/60 transition-colors"
                      >
                        <p className="text-xs text-slate-400 font-medium">
                          🔒 Definition hidden for active recall. Click to test yourself!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleSpeak(`${card.term}. ${card.definition}`)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Speak
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMarkNeedsRevision(card.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isNeedsRev
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        Needs Revision
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMarkMastered(card.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        Mastered
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when filters yield no matches */}
      {deck.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No flashcards match your current filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try switching to 'All Chapters' or resetting your status filter to see cards again.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedChapter('all');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
