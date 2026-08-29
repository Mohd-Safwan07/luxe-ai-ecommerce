import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';
import { formatINR } from '../utils/formatters';
import { 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const FeaturedProducts = () => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    minRating,
    setMinRating
  } = useShop();

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(150000);
    setSortBy('featured');
    setMinRating(0);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    priceRange < 150000 ||
    sortBy !== 'featured' ||
    minRating > 0;

  return (
    <section id="shop" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Products</h2>
          </div>

          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> items
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-6 mb-10 space-y-4">
          
          {/* Top Row: Category Pills & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>

          {/* Bottom Row: Price Slider & Sorting Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            
            {/* Price Filter Slider */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Max Price</span>
                  <span className="text-indigo-600 font-bold">{formatINR(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount %</option>
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-semibold text-slate-700">Min Rating:</span>
              <div className="flex gap-1">
                {[0, 4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      minRating === rating
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {rating === 0 ? 'All' : `${rating}★+`}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Products Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any products matching your current search or filter options.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
