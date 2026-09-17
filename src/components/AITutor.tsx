import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Calculator,
  Compass,
  Zap,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const DEFAULT_PROMPT_CHIPS = [
  'Who made this website?',
  'Explain New Cartesian Sign Convention for mirrors with rules',
  'Why does the clear sky appear blue and sun red at sunrise?',
  'Calculate image position: u = -30 cm, f = -20 cm for concave mirror',
  'Explain Fleming’s Left-Hand Rule and function of split rings in DC motor',
  'Why is parallel combination preferred over series in domestic circuits?',
];

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am your **AI Physics Tutor** for CBSE Class 10.\n\nI can help you with:\n• Step-by-step numerical solutions with Cartesian sign conventions\n• NCERT conceptual doubts (Light, Human Eye, Electricity, Magnetism)\n• Ray diagram drawing sequences & precautions\n• CBSE Board marking criteria and common student pitfalls\n\nWhat would you like to understand or solve today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    const lower = textToSend.toLowerCase();
    const isCreatorQuery =
      lower.includes('who made') ||
      lower.includes('who created') ||
      lower.includes('who built') ||
      lower.includes('who designed') ||
      lower.includes('who developed') ||
      lower.includes('made this') ||
      lower.includes('created this') ||
      lower.includes('built this') ||
      lower.includes('who is the creator') ||
      lower.includes('who is the developer') ||
      lower.includes('who is the author') ||
      lower.includes('made by') ||
      lower.includes('aryan yadav') ||
      lower.includes('scale carrer');

    if (isCreatorQuery) {
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: 'This website is made by Aryan yadav, a Student of Scale Carrer Institute.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 350);
      return;
    }

    try {
      // Send query to server-side AI tutor endpoint
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || data.response || 'Here is the CBSE explanation for your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI endpoint fallback:', err);
      // Fallback local pedagogical guidance
      const fallbackResponse: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'assistant',
        text: getLocalPedagogicalFallback(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalPedagogicalFallback = (query: string): string => {
    const q = query.toLowerCase();
    const isCreatorQuery =
      q.includes('who made') ||
      q.includes('who created') ||
      q.includes('who built') ||
      q.includes('who designed') ||
      q.includes('who developed') ||
      q.includes('made this') ||
      q.includes('created this') ||
      q.includes('built this') ||
      q.includes('who is the creator') ||
      q.includes('who is the developer') ||
      q.includes('who is the author') ||
      q.includes('made by') ||
      q.includes('aryan yadav') ||
      q.includes('scale carrer');

    if (isCreatorQuery) {
      return `This website is made by Aryan yadav, a Student of Scale Carrer Institute.`;
    }

    if (q.includes('sign convention') || q.includes('cartesian')) {
      return `**New Cartesian Sign Convention (CBSE Class 10 Standard):**\n\n1. All distances are measured from the **Pole (P)** for spherical mirrors, and from the **Optical Centre (O)** for spherical lenses along the principal axis.\n2. Distances measured in the direction of incident light (to the right of the origin) are taken as **Positive (+)**.\n3. Distances measured against the direction of incident light (to the left of origin) are taken as **Negative (-)**.\n4. Heights measured upwards perpendicular to the principal axis are taken as **Positive (+h)**.\n5. Heights measured downwards perpendicular to the principal axis are taken as **Negative (-h)**.\n\n⚠️ **Golden Rule for Numericals:**\n• Object distance $u$ is ALWAYS negative ($-u$).\n• Concave mirror/lens focal length $f$ is ALWAYS negative ($-f$).\n• Convex mirror/lens focal length $f$ is ALWAYS positive ($+f$).`;
    }

    if (q.includes('sky') || q.includes('blue') || q.includes('scatter')) {
      return `**Why Does the Sky Appear Blue? (CBSE 2-Mark Question):**\n\n• **Phenomenon:** Rayleigh Scattering of light.\n• **Principle:** Intensity of scattered light $I \\propto \\frac{1}{\\lambda^4}$ (inversely proportional to the 4th power of wavelength).\n• **Explanation:** The earth's atmosphere contains fine particles of air (nitrogen and oxygen molecules) whose size is smaller than the wavelength of visible light. Blue light has a shorter wavelength compared to red light (about 1.8 times less). Consequently, blue light is scattered much more strongly by fine atmospheric particles and enters our eyes from all directions.\n\n⚠️ **Note for Outer Space:** In space, where there is no atmosphere, no scattering occurs and the sky appears pitch dark.`;
    }

    if (q.includes('parallel') || q.includes('domestic') || q.includes('series')) {
      return `**Why Parallel Combination is Used for Domestic Circuits (3 Marks):**\n\n1. **Independent Operation:** Each electrical appliance gets its own separate ON/OFF switch. If one appliance fuses or is turned off, other appliances continue to function unaffected.\n2. **Equal Rated Voltage:** All appliances receive the full rated mains voltage ($220\\text{ V}$). In a series circuit, voltage gets divided among the appliances.\n3. **Low Total Equivalent Resistance:** In parallel, $\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}$, reducing total circuit resistance so adequate total current is drawn to meet power requirements.\n4. **Current Division According to Requirement:** Each appliance draws current appropriate to its power rating (e.g., a $15\\text{ A}$ geyser draws high current, while a $0.5\\text{ A}$ bulb draws low current).`;
    }

    if (q.includes('motor') || q.includes('fleming') || q.includes('split ring')) {
      return `**Electric Motor & Split-Ring Commutator (CBSE 3/5 Marks):**\n\n• **Working Principle:** When a rectangular current-carrying coil is placed in a magnetic field, it experiences equal and opposite forces on opposite arms according to **Fleming's Left-Hand Rule**, creating a torque that rotates the coil.\n• **Role of Split-Ring Commutator:**\n  1. The split ring (two half-rings P and Q) reverses the direction of current flowing through the coil arms AB and CD after every half-rotation ($180^\\circ$).\n  2. Because the current reverses in step with the arms crossing between magnetic poles, the direction of force on the arms also reverses, ensuring the coil keeps rotating continuously in the SAME direction!`;
    }

    return `**CBSE Physics Teacher Analysis:**\n\nRegarding your question: *"${query}"*\n\n1. **Core Concept:** In CBSE Class 10, always state the standard scientific definition first, followed by the formula with SI units.\n2. **Cartesian Signs:** When solving numericals, explicitly write *Given* with positive or negative signs before substituting into the formula.\n3. **Examiner Focus:** Ensure your ray diagrams include arrows marking the direction of light, and always write the final answer with its correct unit ($A, V, \\Omega, D, m, cm$).\n\nFeel free to ask for a specific numerical step-by-step solution or formula derivation!`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono mb-1">
          <Sparkles className="w-4 h-4" /> AI CBSE Physics Specialist
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Sir Newton • Class 10 Physics Doubt Solver
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Ask conceptual questions, request step-by-step numerical solutions, verify ray diagram rules, or practice board-style problems.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 whitespace-pre-line'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  <div>{msg.text}</div>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isAi ? 'text-slate-400' : 'text-blue-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Sir Newton is calculating the CBSE solution...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
          {DEFAULT_PROMPT_CHIPS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question, paste a numerical problem, or ask for diagram rules..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 text-xs shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
