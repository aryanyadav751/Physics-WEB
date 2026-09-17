import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Coffee,
  CheckCircle2,
  Target,
  Zap,
  BookOpen,
  Bell,
  Check,
} from 'lucide-react';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface StudyFocusTimerProps {
  onSessionComplete?: (sessionType: PomodoroMode, minutes: number) => void;
  compact?: boolean;
}

// Sound synthesis using Web Audio API (zero external assets needed)
function playToneChime(type: 'complete' | 'start' | 'alert') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'complete') {
      // Pleasant rising major chord chime (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.65);
      });
    } else if (type === 'start') {
      // Soft gentle blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else {
      // Alert chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (err) {
    console.warn('Web Audio playback failed:', err);
  }
}

const DEFAULT_TIMES: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const CHAPTER_STUDY_TASKS = [
  '⚡ Light: Solve 5 Mirror & Lens numericals with sign conventions',
  '👁️ Human Eye: Practice Myopia & Hypermetropia ray diagrams',
  '💡 Electricity: Derive Series & Parallel equivalent resistances',
  '🧲 Magnetism: Memorize Fleming’s Left-Hand & Right-Hand Rules',
  '📝 Self-timed CBSE 15-question Physics mock test',
];

export const StudyFocusTimer: React.FC<StudyFocusTimerProps> = ({
  onSessionComplete,
  compact = false,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIMES.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(0);
  const [customGoal, setCustomGoal] = useState<string>(CHAPTER_STUDY_TASKS[0]);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Custom durations selector
  const [customDurations, setCustomDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleComplete = () => {
    setIsRunning(false);

    if (soundEnabled) {
      playToneChime('complete');
    }

    if (mode === 'focus') {
      const minutesCompleted = customDurations.focus;
      setCompletedSessions((prev) => prev + 1);
      setTotalFocusMinutes((prev) => prev + minutesCompleted);
      setBannerNotice(`🎉 Focus Session Complete! Great job revising. Time for a well-deserved break!`);

      if (onSessionComplete) {
        onSessionComplete('focus', minutesCompleted);
      }

      // Auto switch to short break or long break after 4 sessions
      const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setTimeout(() => {
        setMode(nextMode);
        setTimeLeft(customDurations[nextMode] * 60);
      }, 1500);
    } else {
      setBannerNotice(`☕ Break Complete! Ready to jump back into your next physics focus block?`);
      if (onSessionComplete) {
        onSessionComplete(mode, mode === 'shortBreak' ? customDurations.shortBreak : customDurations.longBreak);
      }
      setTimeout(() => {
        setMode('focus');
        setTimeLeft(customDurations.focus * 60);
      }, 1500);
    }

    setTimeout(() => setBannerNotice(null), 8000);
  };

  const handleTogglePlay = () => {
    if (!isRunning && soundEnabled) {
      playToneChime('start');
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customDurations[mode] * 60);
  };

  const handleSwitchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(customDurations[newMode] * 60);
  };

  const handleSetFocusDuration = (mins: number) => {
    setIsRunning(false);
    setCustomDurations((prev) => ({ ...prev, focus: mins }));
    if (mode === 'focus') {
      setTimeLeft(mins * 60);
    }
  };

  const handleSkipNext = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      const next = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(next);
      setTimeLeft(customDurations[next] * 60);
    } else {
      setMode('focus');
      setTimeLeft(customDurations.focus * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalDuration = customDurations[mode] * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / (totalDuration || 1)) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Banner Notice */}
      {bannerNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {bannerNotice}
          </span>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
            <Timer className="w-4 h-4" /> Pomodoro Technique for Physics
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Study Focus Timer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Break your CBSE revision into intense 25-minute focus intervals separated by short restorative breaks.
          </p>
        </div>

        {/* Sound Toggle & Test Audio */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playToneChime('alert');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="Toggle chime audio alerts"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Sound Alerts ON
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" /> Sound Muted
              </>
            )}
          </button>

          {soundEnabled && (
            <button
              type="button"
              onClick={() => playToneChime('complete')}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title="Test chime tone"
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => handleSwitchMode('focus')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" /> Focus Work ({customDurations.focus}m)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('shortBreak')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" /> Short Break ({customDurations.shortBreak}m)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('longBreak')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Long Break ({customDurations.longBreak}m)
          </button>
        </div>
      </div>

      {/* Main Clock Face & Progress Circle */}
      <div className="flex flex-col items-center justify-center py-6 space-y-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Circular Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 ease-linear ${
                mode === 'focus'
                  ? 'stroke-purple-600 dark:stroke-purple-500'
                  : mode === 'shortBreak'
                  ? 'stroke-emerald-500'
                  : 'stroke-blue-500'
              }`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time & Mode Display Inside Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${
                mode === 'focus'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                  : mode === 'shortBreak'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
              }`}
            >
              {mode === 'focus' ? 'Deep Focus' : mode === 'shortBreak' ? 'Rest & Recharge' : 'Extended Rest'}
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {timeFormatted}
            </div>
            <span className="text-xs text-slate-400 mt-1 font-mono">
              {isRunning ? '⏱️ In Session...' : '⏸️ Paused'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white text-base sm:text-lg flex items-center gap-2.5 shadow-lg transition-all transform active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                : mode === 'focus'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start {mode === 'focus' ? 'Focus' : 'Break'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkipNext}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Duration Quick Presets (Only for Focus Mode) */}
        {mode === 'focus' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Focus duration:</span>
            {[15, 25, 45, 50].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSetFocusDuration(mins)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  customDurations.focus === mins
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cycle Indicator & Today's Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Cycle Dots */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Pomodoro Cycle (4 Sessions)
          </span>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((idx) => {
              const filled = idx < completedSessions % 4;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    filled
                      ? 'bg-purple-600 text-white scale-110 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {filled && <Check className="w-2.5 h-2.5" />}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-slate-500">
            {completedSessions % 4} of 4 sessions completed
          </span>
        </div>

        {/* Total Focus Time */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Focus Time Today
          </span>
          <div className="text-xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            {totalFocusMinutes} Minutes
          </div>
          <span className="text-xs text-slate-500">
            {completedSessions} deep-work intervals
          </span>
        </div>

        {/* Academic Benefit Note */}
        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1">
          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> CBSE Memory Retain Tip
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Short rest intervals let your brain consolidate newly memorized formulas and ray diagrams into long-term memory!
          </p>
        </div>
      </div>

      {/* Revision Goal Selector */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-blue-500" /> Current Session Revision Target:
        </label>
        <select
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium"
        >
          {CHAPTER_STUDY_TASKS.map((task, i) => (
            <option key={i} value={task}>
              {task}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
