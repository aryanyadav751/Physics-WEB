import React, { useState, useRef, useEffect } from 'react';
import { cleanLatexToPlainText } from '../utils/latexToPlainText';
import { useSessionChat, ChatMessage } from '../utils/chatSessionStore';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  X,
  Square,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  FileText,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface AITutorProps {
  onQuestionAsked?: () => void;
  initialQuery?: string;
  compactMode?: boolean;
  onCloseCompact?: () => void;
}

const SUGGESTED_PROMPTS = [
  { label: 'Explain a concept', prompt: 'Explain the working of an Electric Motor and the role of split rings in continuous rotation.' },
  { label: 'Solve a numerical', prompt: 'An object 4 cm high is placed 25 cm in front of a concave mirror of focal length 15 cm. Find the position, nature, and height of the image formed.' },
  { label: 'Quiz me', prompt: 'Quiz me on Ohm’s law, factors affecting resistance, and series/parallel resistor combinations for CBSE Class 10.' },
  { label: 'Explain this formula', prompt: 'Explain the Mirror Formula and Linear Magnification formula with New Cartesian sign conventions.' },
  { label: 'Give me important questions', prompt: 'Give me 5 high-yield CBSE Class 10 board exam questions on Magnetic Effects of Electric Current.' },
  { label: 'Revise this chapter', prompt: 'Give me a rapid 5-minute revision summary of The Human Eye and the Colourful World for board exams.' },
];

export const AITutor: React.FC<AITutorProps> = ({
  onQuestionAsked,
  initialQuery,
  compactMode = false,
  onCloseCompact,
}) => {
  const [messages, setMessages, resetSessionChat] = useSessionChat();

  const [inputQuery, setInputQuery] = useState<string>(initialQuery || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; fileName: string } | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up speech and abort on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Text-to-Speech handler
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech is not supported by your browser.');
      setTimeout(() => setVoiceNotice(null), 3500);
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip LaTeX and markdown formatting for cleaner speech output
    const cleanText = cleanLatexToPlainText(text)
      .replace(/[#*_`$~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      let speechBuffer = '';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceNotice('🎙️ Listening... Speak your Physics doubt now.');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          speechBuffer = currentTranscript;
          setInputQuery(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('No speech detected. Tap the mic and speak clearly.');
        } else {
          setVoiceNotice(`Voice status: ${event.error}. You can also type your doubt.`);
        }
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (speechBuffer) {
          setVoiceNotice(`Transcribed: "${speechBuffer}"`);
          setTimeout(() => setVoiceNotice(null), 3000);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setVoiceNotice('Unable to start speech recognition. Please check microphone permissions.');
      setTimeout(() => setVoiceNotice(null), 3500);
    }
  };

  // Image Upload handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setSelectedImage({
        data: result,
        mimeType: file.type,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  // Send message
  const handleSendMessage = async (customPrompt?: string, retryText?: string, retryImg?: string) => {
    const textToSend = customPrompt !== undefined ? customPrompt : (retryText || inputQuery);
    const imageToSend = selectedImage;

    if (!textToSend.trim() && !imageToSend && !retryImg) return;
    if (isLoading) return;

    // Trigger learning milestone badge callback
    onQuestionAsked?.();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim() || (imageToSend ? 'Please analyze this Physics diagram or problem.' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: imageToSend?.data || retryImg,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setSelectedImage(null);
    setIsLoading(true);

    // Send to server-side Gemini endpoint
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: textToSend.trim(),
          image: imageToSend ? { data: imageToSend.data, mimeType: imageToSend.mimeType } : undefined,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const rawReply = data.reply || data.response || 'Here is the CBSE explanation for your query.';
      const cleanReply = cleanLatexToPlainText(rawReply);

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: cleanReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-stopped-${Date.now()}`,
            sender: 'assistant',
            text: '⏹️ Generation was stopped.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        console.warn('AI Tutor fallback:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-error-${Date.now()}`,
            sender: 'assistant',
            text: 'I’m Enjoy Physics AI, your CBSE Class 10 tutor. If your query is about Light, The Human Eye, Electricity, or Magnetic Effects of Electric Current, please try asking again!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear your session chat history? (History resets automatically on page reload)')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      resetSessionChat();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(undefined, lastUserMsg.text, lastUserMsg.image);
    }
  };

  return (
    <div className={`w-full ${compactMode ? 'h-full flex flex-col' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      {/* Header */}
      {!compactMode && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
              CBSE Class 10 Dedicated AI Tutor
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Enjoy Physics AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
              Strictly focused on Light, Human Eye, Electricity, and Magnetic Effects of Electric Current.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-mono font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              title="All chat messages are preserved across views until the webpage is refreshed or closed"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              Session: {messages.length} {messages.length === 1 ? 'msg' : 'msgs'}
            </span>

            <button
              type="button"
              onClick={handleClearChat}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:border-red-300 dark:hover:border-red-800 transition-colors flex items-center gap-1.5"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Chat
            </button>
          </div>
        </div>
      )}

      {compactMode && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                Enjoy Physics AI
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <span>Class 10 CBSE</span>
                <span>•</span>
                <span>{messages.length} msgs saved</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {onCloseCompact && (
              <button
                type="button"
                onClick={onCloseCompact}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Close chat drawer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col ${
          compactMode ? 'flex-1 overflow-hidden' : 'h-[640px] overflow-hidden'
        }`}
      >
        {/* Voice Feedback Banner */}
        {voiceNotice && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/60 border-b border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              {voiceNotice}
            </span>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800 text-white dark:bg-slate-700'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Box */}
                <div
                  className={`group relative p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none whitespace-pre-line'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  {/* Attached Image (if any) */}
                  {msg.image && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-white/20 dark:border-slate-700 max-w-xs">
                      <img
                        src={msg.image}
                        alt="Question diagram"
                        className="w-full h-auto object-cover max-h-48"
                      />
                    </div>
                  )}

                  <div>{msg.text}</div>

                  {/* Actions & Timestamp */}
                  <div
                    className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                      isAi
                        ? 'border-slate-200/60 dark:border-slate-700/60 text-slate-400'
                        : 'border-blue-500/60 text-blue-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isAi && (
                      <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(msg.id, msg.text)}
                          className={`p-1 rounded-md transition-colors ${
                            isSpeaking
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'
                          }`}
                          title={isSpeaking ? 'Stop speaking' : 'Read response aloud'}
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Enjoy Physics AI is preparing your CBSE answer...</span>
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="ml-2 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <Square className="w-2.5 h-2.5 fill-current text-red-500" /> Stop
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(p.prompt)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRetryLast}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 whitespace-nowrap transition-colors flex items-center gap-1"
            title="Retry last question"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>

        {/* Image Attachment Preview */}
        {selectedImage && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200 font-medium truncate">
              <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{selectedImage.fileName}</span>
              <span className="text-[10px] text-blue-500 font-mono">(Ready to send)</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1 rounded-md text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Attach Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-colors shrink-0"
              title="Attach a Physics question or diagram photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Voice Chat Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 ${
                isRecording
                  ? 'bg-red-500 border-red-600 text-white animate-pulse shadow-md shadow-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-400'
              }`}
              title={isRecording ? 'Stop recording' : '🎙️ Voice Chat: Speak your doubt'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input / Textarea */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={
                  isRecording
                    ? 'Listening... Speak your physics doubt'
                    : selectedImage
                    ? 'Ask about this diagram or press Send...'
                    : 'Ask about Light, Human Eye, Electricity, or Magnetic Effects...'
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Send or Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all flex items-center justify-center shrink-0"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={(!inputQuery.trim() && !selectedImage) || isLoading}
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                title="Send question"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
