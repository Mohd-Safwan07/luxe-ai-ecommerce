import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/formatters';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Star, 
  ShoppingBag,
  TrendingUp,
  Award
} from 'lucide-react';

export const Hero = ({ onExploreClick }) => {
  const { openQuickView, products } = useShop();
  const featuredProduct = products[0]; // iPhone 15 Pro Max

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-indigo-300 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Next-Generation E-Commerce Store</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Shop Smart, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover curated luxury gadgets, trendsetting fashion, footwear, and lifestyle essentials. High quality, unbeatable discounts, and express delivery right to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 py-4 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium rounded-2xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Categories</span>
              </button>
            </div>

            {/* Customer Rating stats */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                </div>
                <div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">12k+ Verified Reviews</span>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-slate-800" />

              <div className="hidden sm:flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">99.8% Customer Satisfaction</span>
              </div>
            </div>

          </div>

          {/* Right Column: Modern Shopping Visual & Cards */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Visual Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Showcase Card */}
              <div className="relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-2xl overflow-hidden group">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                    alt="iPhone 15 Pro Max"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Featured Deal
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Electronics</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">4.9</span> (342)
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    iPhone 15 Pro Max (256GB)
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-extrabold text-white">{formatINR(featuredProduct?.discountedPrice || 134900)}</span>
                      <span className="text-sm text-slate-400 line-through ml-2">{formatINR(featuredProduct?.originalPrice || 159900)}</span>
                    </div>
                    <button
                      onClick={() => openQuickView(featuredProduct)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-pulse-subtle">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Free Express Delivery</div>
                  <div className="text-[11px] text-slate-400">On all orders over ₹1,499</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">100% Authentic Guarantee</div>
                  <div className="text-[11px] text-slate-400">30 Days Easy Return</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
            <Truck className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Free Shipping</h4>
              <p className="text-xs text-slate-400">Orders over ₹1,499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
            <Clock className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Support</h4>
              <p className="text-xs text-slate-400">Dedicated assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
            <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payment</h4>
              <p className="text-xs text-slate-400">256-bit SSL encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
            <TrendingUp className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">Best Prices</h4>
              <p className="text-xs text-slate-400">Direct from brands</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
