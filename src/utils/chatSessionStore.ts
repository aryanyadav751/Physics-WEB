import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  image?: string; // Data URL for display
  isError?: boolean;
}

export const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: `Hello! I am **Enjoy Physics AI**, your dedicated tutor for CBSE Class 10 Physics.

I can help you with:
1. 🔦 **Light – Reflection and Refraction** (Mirrors, Lenses, Ray Diagrams, Lens Formula)
2. 👁️ **The Human Eye and the Colourful World** (Eye Defects, Prism Dispersion, Atmospheric Refraction)
3. ⚡ **Electricity** (Ohm's Law, Resistance, Series/Parallel, Joule's Heating)
4. 🧲 **Magnetic Effects of Electric Current** (Right Hand Thumb Rule, Solenoid, Electric Motor)

You can ask conceptual doubts, request step-by-step numerical solutions, upload diagrams, or speak via 🎙️ **Voice Chat**!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// In-memory chat storage.
// This survives all component unmounts and view switches within the SPA,
// and resets ONLY when the user refreshes the page or leaves the website.
let sessionMessages: ChatMessage[] = [INITIAL_WELCOME_MESSAGE];
const listeners = new Set<(messages: ChatMessage[]) => void>();

export function getSessionChatMessages(): ChatMessage[] {
  return sessionMessages;
}

export function setSessionChatMessages(
  updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
): void {
  if (typeof updater === 'function') {
    sessionMessages = updater(sessionMessages);
  } else {
    sessionMessages = updater;
  }
  const cloned = [...sessionMessages];
  listeners.forEach((listener) => {
    try {
      listener(cloned);
    } catch (e) {
      console.error('Error notifying chat listener:', e);
    }
  });
}

export function resetSessionChatMessages(): void {
  sessionMessages = [
    {
      ...INITIAL_WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
  const cloned = [...sessionMessages];
  listeners.forEach((listener) => {
    try {
      listener(cloned);
    } catch (e) {
      console.error('Error notifying chat listener:', e);
    }
  });
}

export function subscribeSessionChat(callback: (messages: ChatMessage[]) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Custom React hook for shared in-memory session chat.
 * Persists all chat messages across routes and modals until browser refresh or page close.
 */
export function useSessionChat(): [
  ChatMessage[],
  (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
  () => void
] {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [...sessionMessages]);

  useEffect(() => {
    // Keep local component state synchronized with in-memory session messages
    const unsubscribe = subscribeSessionChat((newMessages) => {
      setMessages([...newMessages]);
    });
    return unsubscribe;
  }, []);

  return [messages, setSessionChatMessages, resetSessionChatMessages];
}
