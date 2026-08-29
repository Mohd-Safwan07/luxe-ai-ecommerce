import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, ArrowRight, Zap, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const FlashSaleBanner = ({ onShopNow }) => {
  const { addToast } = useShop();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SUMMER50');
    setCopied(true);
    addToast('Coupon code "SUMMER50" copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="deals" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
          
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span>Limited Time Promotion</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Summer Flash Sale <br />
                <span className="text-emerald-400">Up to 50% Off Everything</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
                Upgrade your tech & fashion gear today. Use discount coupon code below at checkout for an extra 15% instant savings.
              </p>

              {/* Promo Code Box */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 px-4 py-2.5 rounded-2xl">
                  <span className="text-xs text-slate-400 font-medium">Coupon Code:</span>
                  <span className="text-sm font-extrabold text-amber-400 tracking-wider">SUMMER50</span>
                  <button
                    onClick={handleCopyCode}
                    className="ml-2 text-slate-400 hover:text-white transition-colors"
                    title="Copy Promo Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={onShopNow}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Claim Deal Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Timer Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Timer className="w-4 h-4 text-rose-400" />
                <span>Hurry, Sale Ends In</span>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center justify-center gap-3">
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-inner">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2 uppercase">Hours</span>
                </div>

                <span className="text-2xl font-bold text-slate-600 pb-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-inner">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2 uppercase">Mins</span>
                </div>

                <span className="text-2xl font-bold text-slate-600 pb-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-rose-400 shadow-inner">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2 uppercase">Secs</span>
                </div>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-full w-3/4 rounded-full animate-pulse" />
              </div>
              <span className="text-xs text-slate-400">🔥 78% of flash stock already claimed!</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
