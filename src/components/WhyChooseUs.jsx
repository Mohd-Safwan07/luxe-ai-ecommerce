import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Express Shipping',
    description: 'Complimentary 2-day delivery on all orders over ₹1,499 across India.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    icon: RotateCcw,
    title: '30-Day Easy Returns',
    description: 'Not satisfied with your order? Return hassle-free within 30 days.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic Guarantee',
    description: 'Direct sourcing from verified brand manufacturers worldwide.',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: Headset,
    title: '24/7 Customer Care',
    description: 'Round-the-clock live chat & email support for all your shopping queries.',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Shopping Confidence</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Why Choose LuxeStore?</h2>
          <p className="text-slate-500 text-sm mt-2">
            We prioritize customer satisfaction, authentic quality, and rapid delivery above everything else.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
