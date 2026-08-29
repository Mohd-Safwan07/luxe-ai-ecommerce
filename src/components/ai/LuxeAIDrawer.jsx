import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { AIMessage } from './AIMessage';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Bot, 
  Loader2, 
  Zap, 
  MessageSquare,
  Gift,
  Shirt,
  Smartphone
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: '✨ Outfit under ₹3000', prompt: 'I need a college outfit under ₹3000' },
  { label: '🎁 Find a birthday gift', prompt: 'I need a birthday gift for my brother under ₹1500' },
  { label: '📱 Best product under ₹20000', prompt: 'Suggest a good gadget or smartphone under ₹20000' },
  { label: '🔥 Best deals for me', prompt: 'Show me the biggest discounted deals right now' },
  { label: '👕 Build me an outfit', prompt: 'Build me a complete casual outfit under ₹5000' }
];

const INITIAL_WELCOME = {
  id: 'welcome-1',
  sender: 'ai',
  text: "Hello! I'm Luxe AI, your personal shopping copilot. Tell me what you're looking for, your budget, or an occasion, and I'll find real matching products for you!",
  recommendations: [],
  combo: { enabled: false }
};

export const LuxeAIDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, sender: 'user', text: textToSend };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter(m => m.id !== 'welcome-1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const data = await apiFetch('/ai/shopping-assistant', {
        method: 'POST',
        body: JSON.stringify({ prompt: textToSend, history: historyPayload })
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.message || 'Here are the matching recommendations for you:',
        recommendations: data.recommendations || [],
        combo: data.combo || { enabled: false }
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Luxe AI Error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Sorry, I encountered an issue retrieving recommendations. Please try asking again!",
        recommendations: [],
        combo: { enabled: false }
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white leading-none">Luxe AI</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Copilot
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">Your personal shopping copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/60 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="bg-slate-50 border-b border-slate-200/60 p-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              {SUGGESTED_PROMPTS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Trajectory Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
            {messages.map((msg) => (
              <AIMessage key={msg.id} message={msg} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start my-4">
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-3 rounded-3xl shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-spin">
                    <Loader2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <span>Luxe AI is analyzing products...</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping delay-100" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-200/80 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Luxe AI (e.g. Outfit under ₹3000)..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-center text-slate-400 mt-2">
              Powered by Google Gemini AI & MongoDB Atlas
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
