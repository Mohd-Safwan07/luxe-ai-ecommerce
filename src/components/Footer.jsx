import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Mail, 
  Send, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const { addToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    addToast(`Thanks for subscribing! Check ${newsletterEmail} for your 15% discount code.`, 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Signup Box */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-2 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Exclusive Insider Access</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Subscribe & Save 15% Off Your Next Order</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Join 50,000+ shoppers and get early flash deal access, weekly coupons, and lifestyle news.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Luxe<span className="text-indigo-400">Store</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              LuxeStore is a premier e-commerce platform delivering high-quality tech electronics, footwear, apparel, and lifestyle accessories directly to consumers worldwide.
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#shop" onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Electronics & Phones</a></li>
              <li><a href="#shop" onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Fashion & Apparel</a></li>
              <li><a href="#shop" onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Footwear & Sneakers</a></li>
              <li><a href="#shop" onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Accessories & Bags</a></li>
              <li><a href="#shop" onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Home & Living</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Customer Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#why" onClick={() => onNavigate('why')} className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="#why" onClick={() => onNavigate('why')} className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#why" onClick={() => onNavigate('why')} className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#why" onClick={() => onNavigate('why')} className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#why" onClick={() => onNavigate('why')} className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Headquarters</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>500 Howard St, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-LUXE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>support@luxestore.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuxeStore Inc. All rights reserved. Designed with React.js & Tailwind CSS.</p>
          
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold">VISA</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold">MasterCard</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold">Apple Pay</span>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold">PayPal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
