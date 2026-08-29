import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { TrendingUp, Flame } from 'lucide-react';

export const TrendingProducts = () => {
  const { products } = useShop();
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  return (
    <section id="trending" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>Hot This Week</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Trending Products</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Our most sought-after products with high demand and top customer satisfaction ratings.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
