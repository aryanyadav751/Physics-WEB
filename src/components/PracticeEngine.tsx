import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTION_BANK } from '../data/questionBankData';
import { QuestionItem } from '../types/physics';
import { StudyFocusTimer } from './StudyFocusTimer';
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
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  Radio,
  X,
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
  // Navigation between Practice Tests and Study Focus Timer
  const [engineTab, setEngineTab] = useState<'tests' | 'pomodoro'>('tests');

  // Setup state
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');

  // Voice settings
  const [isVoiceControlActive, setIsVoiceControlActive] = useState<boolean>(true);
  const [isSpeechFeedbackEnabled, setIsSpeechFeedbackEnabled] = useState<boolean>(true);
  const [isAutoReadQuestion, setIsAutoReadQuestion] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [lastCommandInfo, setLastCommandInfo] = useState<{
    transcript: string;
    action: string;
  } | null>(null);

  // Active test state
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes default
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const readingSolutionIdRef = useRef<string | null>(null);
  const [readingSolutionId, setReadingSolutionId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Web Speech Synthesis (Text-to-Speech Spoken Feedback)
  // -------------------------------------------------------------
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        onEnd?.();
        return;
      }

      if (!isSpeechFeedbackEnabled) {
        onEnd?.();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const clean = text
          .replace(/[*#_`]/g, '')
          .replace(/\^2/g, ' squared')
          .replace(/\^3/g, ' cubed')
          .replace(/Ω/g, ' ohms')
          .replace(/°/g, ' degrees');

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
        onEnd?.();
      }
    },
    [isSpeechFeedbackEnabled]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setReadingSolutionId(null);
    }
  }, []);

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
    setLastCommandInfo(null);

    // Initial voice greeting if feedback is enabled
    if (isSpeechFeedbackEnabled) {
      setTimeout(() => {
        speakText(
          `Test started with ${selected.length} questions. You can use voice commands to answer or navigate. Say "Help" at any time for voice commands.`
        );
      }, 500);
    }
  };

  const handleSelectOption = (qId: string, optionIndex: number, triggeredByVoice = false) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIndex }));

    const currentQuestion = activeQuestions[currentIndex];
    const letter = String.fromCharCode(65 + optionIndex);

    if (currentQuestion && currentQuestion.id === qId) {
      if (mode === 'practice') {
        const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
        if (isCorrect) {
          speakText(`Option ${letter}. That's correct! ${currentQuestion.explanation}`);
        } else {
          const correctLetter = String.fromCharCode(65 + (currentQuestion.correctOptionIndex || 0));
          speakText(
            `Option ${letter}. That is incorrect. The correct answer is Option ${correctLetter}. ${currentQuestion.explanation}`
          );
        }
      } else {
        speakText(`Selected Option ${letter}.`);
      }
    }
  };

  const toggleMarkReview = (qId: string) => {
    setMarkedForReview((prev) => {
      const willBeMarked = !prev[qId];
      speakText(willBeMarked ? 'Question marked for review.' : 'Question unmarked.');
      return { ...prev, [qId]: willBeMarked };
    });
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    stopSpeaking();

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

    if (isSpeechFeedbackEnabled) {
      setTimeout(() => {
        speakText(
          `Test completed! You scored ${score} out of ${activeQuestions.length} with ${accuracy} percent accuracy. ${
            accuracy >= 80 ? 'Excellent performance!' : 'Keep practicing your weak areas.'
          }`
        );
      }, 400);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = activeQuestions[currentIndex];

  // Function to speak out current question and options
  const readCurrentQuestionAndOptions = useCallback(() => {
    if (!currentQ) return;
    const optionsText = currentQ.options
      ?.map((opt, i) => `Option ${String.fromCharCode(65 + i)}: ${opt}`)
      .join('. ');

    const textToRead = `Question ${currentIndex + 1} of ${activeQuestions.length}. ${
      currentQ.question
    }. Options are: ${optionsText}`;

    speakText(textToRead);
  }, [currentQ, currentIndex, activeQuestions.length, speakText]);

  // Read question automatically on index change if auto-read is toggled
  useEffect(() => {
    if (isTestActive && !isSubmitted && isAutoReadQuestion && currentQ) {
      const timer = setTimeout(() => {
        readCurrentQuestionAndOptions();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTestActive, isSubmitted, isAutoReadQuestion, readCurrentQuestionAndOptions]);

  // -------------------------------------------------------------
  // Web Speech Recognition (Voice Commands Engine)
  // -------------------------------------------------------------
  const processVoiceCommand = useCallback(
    (rawTranscript: string) => {
      const text = rawTranscript.toLowerCase().trim();
      if (!text) return;

      const q = activeQuestions[currentIndex];
      if (!q) return;

      // 1. Option selection commands
      // Check for Option A
      if (
        /\b(option a|choice a|select a|answer a|mark a|letter a|opt a)\b/.test(text) ||
        text === 'a' ||
        text === 'alpha' ||
        text === 'first option' ||
        text === 'option 1' ||
        text === 'one'
      ) {
        handleSelectOption(q.id, 0, true);
        setLastCommandInfo({
          transcript: rawTranscript,
          action: `Selected Option A: ${q.options?.[0] || ''}`,
        });
        return;
      }

      // Check for Option B
      if (
        /\b(option b|choice b|select b|answer b|mark b|letter b|opt b)\b/.test(text) ||
        text === 'b' ||
        text === 'beta' ||
        text === 'bravo' ||
        text === 'second option' ||
        text === 'option 2' ||
        text === 'two'
      ) {
        handleSelectOption(q.id, 1, true);
        setLastCommandInfo({
          transcript: rawTranscript,
          action: `Selected Option B: ${q.options?.[1] || ''}`,
        });
        return;
      }

      // Check for Option C
      if (
        /\b(option c|choice c|select c|answer c|mark c|letter c|opt c)\b/.test(text) ||
        text === 'c' ||
        text === 'charlie' ||
        text === 'third option' ||
        text === 'option 3' ||
        text === 'three'
      ) {
        handleSelectOption(q.id, 2, true);
        setLastCommandInfo({
          transcript: rawTranscript,
          action: `Selected Option C: ${q.options?.[2] || ''}`,
        });
        return;
      }

      // Check for Option D
      if (
        /\b(option d|choice d|select d|answer d|mark d|letter d|opt d)\b/.test(text) ||
        text === 'd' ||
        text === 'delta' ||
        text === 'fourth option' ||
        text === 'option 4' ||
        text === 'four'
      ) {
        handleSelectOption(q.id, 3, true);
        setLastCommandInfo({
          transcript: rawTranscript,
          action: `Selected Option D: ${q.options?.[3] || ''}`,
        });
        return;
      }

      // Check if student spoke the literal content of an option
      if (q.options) {
        for (let i = 0; i < q.options.length; i++) {
          const optStr = q.options[i].toLowerCase();
          if (optStr.length >= 4 && (text.includes(optStr) || optStr.includes(text))) {
            handleSelectOption(q.id, i, true);
            setLastCommandInfo({
              transcript: rawTranscript,
              action: `Matched & Selected Option ${String.fromCharCode(65 + i)}: ${q.options[i]}`,
            });
            return;
          }
        }
      }

      // 2. Navigation: Next Question
      if (/\b(next|next question|forward|skip|proceed|go to next)\b/.test(text)) {
        if (currentIndex < activeQuestions.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setLastCommandInfo({
            transcript: rawTranscript,
            action: `Navigated to Question ${nextIdx + 1}`,
          });
          speakText(`Question ${nextIdx + 1} of ${activeQuestions.length}`);
        } else {
          speakText("You are at the final question. Say 'Submit test' to submit.");
        }
        return;
      }

      // 3. Navigation: Previous Question
      if (/\b(previous|previous question|back|go back|last question)\b/.test(text)) {
        if (currentIndex > 0) {
          const prevIdx = currentIndex - 1;
          setCurrentIndex(prevIdx);
          setLastCommandInfo({
            transcript: rawTranscript,
            action: `Navigated back to Question ${prevIdx + 1}`,
          });
          speakText(`Question ${prevIdx + 1} of ${activeQuestions.length}`);
        } else {
          speakText('You are already at the first question.');
        }
        return;
      }

      // 4. Jump to specific question number
      const jumpMatch = text.match(/(?:question|go to|jump to|number)\s*(\d+)/);
      if (jumpMatch) {
        const qNum = parseInt(jumpMatch[1], 10);
        if (qNum >= 1 && qNum <= activeQuestions.length) {
          const targetIdx = qNum - 1;
          setCurrentIndex(targetIdx);
          setLastCommandInfo({
            transcript: rawTranscript,
            action: `Jumped to Question ${qNum}`,
          });
          speakText(`Question ${qNum} of ${activeQuestions.length}`);
          return;
        }
      }

      // 5. Read question & options
      if (
        /\b(read|read question|repeat|repeat question|speak question|read options|what is the question)\b/.test(
          text
        )
      ) {
        setLastCommandInfo({
          transcript: rawTranscript,
          action: 'Reading current question and options',
        });
        readCurrentQuestionAndOptions();
        return;
      }

      // 6. Mark for review
      if (/\b(mark|mark for review|flag|flag question|unmark|review)\b/.test(text)) {
        toggleMarkReview(q.id);
        const nextState = !markedForReview[q.id];
        setLastCommandInfo({
          transcript: rawTranscript,
          action: nextState ? 'Marked for review' : 'Unmarked from review',
        });
        return;
      }

      // 7. Submit test
      if (/\b(submit|submit test|submit quiz|finish test|finish quiz|end test|turn in)\b/.test(text)) {
        setLastCommandInfo({
          transcript: rawTranscript,
          action: 'Submitting test',
        });
        speakText('Submitting test and calculating your results.');
        handleSubmitTest();
        return;
      }

      // 8. Audio Controls
      if (/\b(stop|stop speaking|be quiet|quiet|silence|mute)\b/.test(text)) {
        stopSpeaking();
        setLastCommandInfo({
          transcript: rawTranscript,
          action: 'Stopped spoken feedback',
        });
        return;
      }

      // 9. Help & Commands
      if (/\b(help|commands|voice commands|what can i say)\b/.test(text)) {
        setShowVoiceHelp(true);
        setLastCommandInfo({
          transcript: rawTranscript,
          action: 'Opened Voice Commands Guide',
        });
        speakText(
          'Available commands include: Option A, Option B, Next, Previous, Read Question, Mark for Review, and Submit Test.'
        );
        return;
      }

      // Fallback unrecognized command indicator
      setLastCommandInfo({
        transcript: rawTranscript,
        action: 'Command not recognized. Say "Help" for options.',
      });
    },
    [
      activeQuestions,
      currentIndex,
      markedForReview,
      handleSelectOption,
      toggleMarkReview,
      handleSubmitTest,
      readCurrentQuestionAndOptions,
      speakText,
      stopSpeaking,
    ]
  );

  // Recognition lifecycle listener
  useEffect(() => {
    if (!isTestActive || isSubmitted || !isVoiceControlActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    let recognition: any = null;
    let shouldKeepListening = true;

    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.maxAlternatives = 2;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('🎙️ Voice Quiz Active: Say "Option A", "Next", "Read question"...');
      };

      recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript;
        if (transcript) {
          processVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          shouldKeepListening = false;
          setIsListening(false);
          setVoiceNotice('Microphone access was denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          // Normal timeout on silence, will restart
        } else {
          setVoiceNotice(`Voice recognition status: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (shouldKeepListening && isTestActive && !isSubmitted && isVoiceControlActive) {
          try {
            recognition.start();
          } catch {}
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }

    return () => {
      shouldKeepListening = false;
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isTestActive, isSubmitted, isVoiceControlActive, processVoiceCommand]);

  // Read solution explanation aloud in Scorecard
  const handleReadSolution = (q: QuestionItem) => {
    if (readingSolutionId === q.id) {
      stopSpeaking();
      return;
    }

    setReadingSolutionId(q.id);
    const correctLetter = String.fromCharCode(65 + (q.correctOptionIndex || 0));
    const correctOpt = q.options ? q.options[q.correctOptionIndex || 0] : '';
    const text = `Question: ${q.question}. The correct answer is Option ${correctLetter}: ${correctOpt}. Explanation: ${q.explanation}`;

    speakText(text, () => {
      setReadingSolutionId(null);
    });
  };

  // Screen 1: Test Builder Configuration / Pomodoro Focus Timer
  if (!isTestActive) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Navigation Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <button
              type="button"
              onClick={() => setEngineTab('tests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                engineTab === 'tests'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" /> CBSE Practice & Mock Tests
            </button>
            <button
              type="button"
              onClick={() => setEngineTab('pomodoro')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                engineTab === 'pomodoro'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Timer className="w-4 h-4 text-purple-500" /> Study Focus Timer (Pomodoro)
            </button>
          </div>

          {engineTab === 'tests' && (
            <button
              type="button"
              onClick={() => setEngineTab('pomodoro')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5" /> Need a focused revision block? Open Study Timer
            </button>
          )}
        </div>

        {/* Tab 2: Pomodoro Focus Timer */}
        {engineTab === 'pomodoro' ? (
          <StudyFocusTimer />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  Practice & Mock Test Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  <Mic className="w-3.5 h-3.5" /> Web Speech Voice Quiz Enabled
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Custom CBSE Class 10 Physics Practice Engine
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Take tests using your voice or click controls. Get instant spoken feedback, voice question reading, and automated scoring.
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
                      Instant spoken and visual feedback after answering each question with complete CBSE explanations.
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

              {/* Web Speech Features Preferences */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Voice Control & Spoken Feedback (Web Speech API)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Take the quiz hands-free! Speak commands like &quot;Option B&quot;, &quot;Next&quot;, &quot;Read question&quot;, or &quot;Submit test&quot;.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={isVoiceControlActive}
                      onChange={(e) => setIsVoiceControlActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>🎙️ Voice Commands (Mic)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={isSpeechFeedbackEnabled}
                      onChange={(e) => setIsSpeechFeedbackEnabled(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>🔊 Spoken Feedback</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={isAutoReadQuestion}
                      onChange={(e) => setIsAutoReadQuestion(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>📖 Auto-Read Questions</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleStartTest}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                Start Practice Session <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
              <span
                className={`text-xl font-mono font-bold ${
                  accuracy >= 75
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
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
              onClick={() => {
                stopSpeaking();
                setIsTestActive(false);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Start New Test
            </button>
          </div>
        </div>

        {/* Detailed Solutions Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Question-by-Question Solution Review
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tap the speaker icon to listen to each solution
            </span>
          </div>

          {activeQuestions.map((q, idx) => {
            const chosen = userAnswers[q.id];
            const isCorrect = chosen === q.correctOptionIndex;
            const isReadingThis = readingSolutionId === q.id;

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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReadSolution(q)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isReadingThis
                          ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                      }`}
                      title={isReadingThis ? 'Stop speaking' : 'Read solution aloud'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isReadingThis ? 'Speaking...' : 'Listen'}</span>
                    </button>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>
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
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                        {isRight && <span className="text-[10px] font-bold uppercase">Correct Answer</span>}
                        {isSelected && !isRight && (
                          <span className="text-[10px] font-bold uppercase">Your Choice</span>
                        )}
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* Test Top Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {currentQ.concept}
          </h2>
        </div>

        {/* Center: Web Speech Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Mic Toggle Button */}
          <button
            type="button"
            onClick={() => setIsVoiceControlActive((prev) => !prev)}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isVoiceControlActive
                ? isListening
                  ? 'bg-red-500 text-white shadow-xs shadow-red-500/20 animate-pulse'
                  : 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isVoiceControlActive ? 'Disable Voice Commands' : 'Enable Voice Commands'}
          >
            {isVoiceControlActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isVoiceControlActive ? (isListening ? 'Listening...' : 'Voice On') : 'Voice Off'}
            </span>
          </button>

          {/* Speaker / Spoken Feedback Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsSpeechFeedbackEnabled((prev) => !prev);
            }}
            className={`p-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isSpeechFeedbackEnabled
                ? 'text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700'
                : 'text-slate-400'
            }`}
            title={isSpeechFeedbackEnabled ? 'Disable Spoken Feedback' : 'Enable Spoken Feedback'}
          >
            {isSpeechFeedbackEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">
              {isSpeechFeedbackEnabled ? (isSpeaking ? 'Speaking' : 'Audio On') : 'Muted'}
            </span>
          </button>

          {/* Read Question Button */}
          <button
            type="button"
            onClick={() => readCurrentQuestionAndOptions()}
            className="p-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Read Question & Options Aloud (Voice Command: 'Read question')"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden lg:inline">Read Question</span>
          </button>

          {/* Voice Commands Guide Button */}
          <button
            type="button"
            onClick={() => setShowVoiceHelp(true)}
            className="p-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="View Voice Commands Cheat Sheet"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Countdown & Submit */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
            <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={handleSubmitTest}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Voice Recognition Live Banner */}
      {isVoiceControlActive && (
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Voice Mode Active:
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Say &quot;Option A/B/C/D&quot;, &quot;Next&quot;, &quot;Previous&quot;, &quot;Read Question&quot;, or &quot;Submit&quot;
            </span>
          </div>

          {lastCommandInfo && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[11px] font-mono text-blue-600 dark:text-blue-400">
              <span>🗣️ &quot;{lastCommandInfo.transcript}&quot;</span>
              <span>→</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {lastCommandInfo.action}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Voice Commands Cheat Sheet Modal */}
      {showVoiceHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Voice Commands Cheat Sheet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceHelp(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Select an Option:
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  &quot;Option A&quot;, &quot;Option B&quot;, &quot;Option C&quot;, &quot;Option D&quot;, or speak the option content directly
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Navigation:
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  &quot;Next&quot;, &quot;Previous&quot;, &quot;Question 4&quot;, &quot;Go to question 2&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Reading & Review:
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  &quot;Read question&quot;, &quot;Read options&quot;, &quot;Mark for review&quot;, &quot;Unmark&quot;
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Test Management:
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  &quot;Submit test&quot;, &quot;Finish quiz&quot;, &quot;Stop speaking&quot;, &quot;Help&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVoiceHelp(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Got It, Back to Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Question Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-mono">
                  {currentQ.type} • 1 Mark
                </span>
                <button
                  type="button"
                  onClick={() => readCurrentQuestionAndOptions()}
                  className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleMarkReview(currentQ.id)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  markedForReview[currentQ.id]
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
                const letter = String.fromCharCode(65 + i);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, i)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 font-semibold ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {letter}
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
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>
                    {userAnswers[currentQ.id] === currentQ.correctOptionIndex ? (
                      <span className="text-emerald-600">✓ Correct!</span>
                    ) : (
                      <span className="text-rose-600">✗ Incorrect.</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speakText(
                        `${
                          userAnswers[currentQ.id] === currentQ.correctOptionIndex
                            ? 'Correct.'
                            : 'Incorrect.'
                        } ${currentQ.explanation}`
                      )
                    }
                    className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    title="Read explanation aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
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
                onClick={() => {
                  const newIdx = Math.max(0, currentIndex - 1);
                  setCurrentIndex(newIdx);
                  speakText(`Question ${newIdx + 1}`);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                type="button"
                disabled={currentIndex === activeQuestions.length - 1}
                onClick={() => {
                  const newIdx = Math.min(activeQuestions.length - 1, currentIndex + 1);
                  setCurrentIndex(newIdx);
                  speakText(`Question ${newIdx + 1}`);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
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
                    onClick={() => {
                      setCurrentIndex(idx);
                      speakText(`Question ${idx + 1}`);
                    }}
                    className={`h-9 rounded-lg text-xs font-bold font-mono transition-all relative cursor-pointer ${
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
                <span>
                  Marked for Review ({Object.values(markedForReview).filter(Boolean).length})
                </span>
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
