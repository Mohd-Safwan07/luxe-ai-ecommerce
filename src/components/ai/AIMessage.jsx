import React from 'react';
import { AIProductCard } from './AIProductCard';
import { AIComboCard } from './AIComboCard';
import { Sparkles, Bot, User } from 'lucide-react';

export const AIMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end my-3">
        <div className="flex items-start gap-2.5 max-w-[85%]">
          <div className="bg-indigo-600 text-white p-3.5 rounded-3xl rounded-tr-xs text-xs sm:text-sm font-medium shadow-md">
            {message.text}
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-4">
      <div className="flex items-start gap-3 max-w-[92%] sm:max-w-[88%]">
        
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 text-white flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
        </div>

        <div className="space-y-3 flex-1">
          {/* Text Message Bubble */}
          <div className="bg-slate-100 border border-slate-200/80 text-slate-800 p-4 rounded-3xl rounded-tl-xs text-xs sm:text-sm leading-relaxed shadow-xs">
            {message.text}
          </div>

          {/* Complete Outfit Combo Box */}
          {message.combo && message.combo.enabled && (
            <AIComboCard combo={message.combo} />
          )}

          {/* Recommended Product Cards Grid */}
          {Array.isArray(message.recommendations) && message.recommendations.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block px-1">
                Recommended Products ({message.recommendations.length})
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {message.recommendations.map((rec, idx) => (
                  <AIProductCard
                    key={rec.productId || rec.product?.id || idx}
                    product={rec.product}
                    reason={rec.reason}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
