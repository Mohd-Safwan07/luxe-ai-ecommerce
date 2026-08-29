import React from 'react';
import { Sparkles } from 'lucide-react';

export const LuxeAIButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 border border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer"
      title="Open Luxe AI Shopping Copilot"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-900 animate-ping" />
      </div>

      <span className="tracking-wide text-white">✨ Luxe AI</span>

      <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
        Copilot
      </span>
    </button>
  );
};
