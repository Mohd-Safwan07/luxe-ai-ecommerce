import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { 
  Smartphone, 
  Shirt, 
  Footprints, 
  Glasses, 
  Sparkles, 
  Home, 
  LayoutGrid,
  ArrowUpRight
} from 'lucide-react';

const iconMap = {
  Smartphone,
  Shirt,
  Footprints,
  Glasses,
  Sparkles,
  Home,
  LayoutGrid
};

export const Categories = ({ onCategorySelect }) => {
  const { selectedCategory, setSelectedCategory } = useShop();

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <section id="categories" className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Collections</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Explore By Category</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Click on any category to view available products filtered specifically for your lifestyle.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
            const IconComponent = iconMap[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`group relative p-6 rounded-3xl text-left transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 ring-2 ring-indigo-500'
                    : 'bg-white text-slate-800 border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Row: Icon & Arrow */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isSelected ? 'text-slate-400' : 'text-slate-300 group-hover:text-indigo-600'
                  }`} />
                </div>

                {/* Bottom Row: Name & Count */}
                <div>
                  <h3 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </h3>
                  <span className={`text-xs font-medium ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.count} Products
                  </span>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
