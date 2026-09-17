import React, { useState } from 'react';
import { Sparkles, X, Maximize2, MessageSquare } from 'lucide-react';
import { AITutor } from './AITutor';

interface FloatingAITutorProps {
  currentView: string;
  onNavigate: (view: string, subId?: string) => void;
  onQuestionAsked?: () => void;
}

export const FloatingAITutor: React.FC<FloatingAITutorProps> = ({
  currentView,
  onNavigate,
  onQuestionAsked,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // If already on the dedicated ai-tutor page, hide the floating button to avoid redundancy
  if (currentView === 'ai-tutor') return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border border-white/20"
            title="Open Enjoy Physics AI Tutor"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Ask Enjoy Physics AI</span>
            <span className="sm:hidden">AI Tutor</span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer Overlay */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] max-h-[calc(100vh-3rem)] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header Controls */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <div>
                <span className="text-xs font-bold block leading-tight">Enjoy Physics AI</span>
                <span className="text-[10px] text-blue-100 font-mono">Class 10 CBSE 24/7 Mentor</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('ai-tutor');
                }}
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Expand to Full Page"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded AI Tutor */}
          <div className="flex-1 overflow-hidden">
            <AITutor
              compactMode={true}
              onCloseCompact={() => setIsOpen(false)}
              onQuestionAsked={onQuestionAsked}
            />
          </div>
        </div>
      )}
    </>
  );
};
