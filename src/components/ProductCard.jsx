import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/formatters';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product._id || product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer" onClick={() => openQuickView(product)}>
        
        {/* Main Image */}
        <img
          src={isHovered && product.secondaryImage ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/90 text-slate-600 hover:bg-rose-500 hover:text-white hover:scale-110'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Quick View Trigger */}
        <div className={`absolute inset-x-4 bottom-4 z-10 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-full py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-2xl backdrop-blur-md shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>

      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-600 uppercase tracking-wide text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => openQuickView(product)}
            className="font-bold text-slate-900 text-base line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900">
                {formatINR(product.discountedPrice !== undefined ? product.discountedPrice : product.price)}
              </span>
              {product.originalPrice > (product.discountedPrice !== undefined ? product.discountedPrice : product.price) && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
              addedAnim
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
