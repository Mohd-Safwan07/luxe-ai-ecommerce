import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/formatters';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const QuickViewModal = () => {
  const {
    isQuickViewOpen,
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);
  const currentImage = activeImage || product.image;
  const currentColor = selectedColor || (product.colors ? product.colors[0] : null);

  const handleAddToCart = () => {
    addToCart(product, quantity, currentColor);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all animate-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Image Section */}
            <div className="md:col-span-6 bg-slate-100 p-6 flex flex-col justify-between">
              
              <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/80 mb-4 shadow-inner">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-white ${
                    currentImage === product.image ? 'border-indigo-600' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img src={product.image} alt="Preview 1" className="w-full h-full object-cover" />
                </button>
                {product.secondaryImage && (
                  <button
                    onClick={() => setActiveImage(product.secondaryImage)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-white ${
                      currentImage === product.secondaryImage ? 'border-indigo-600' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={product.secondaryImage} alt="Preview 2" className="w-full h-full object-cover" />
                  </button>
                )}
              </div>

            </div>

            {/* Right Product Info */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatINR(product.discountedPrice !== undefined ? product.discountedPrice : product.price)}
                  </span>
                  {product.originalPrice > (product.discountedPrice !== undefined ? product.discountedPrice : product.price) && (
                    <span className="text-base text-slate-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
                  {product.description}
                </p>

                {/* Specs List */}
                {product.specs && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Key Specifications:</span>
                    <ul className="grid grid-cols-1 gap-1">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-900 block mb-2">Available Colors:</span>
                    <div className="flex gap-2">
                      {product.colors.map((hex, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(hex)}
                          style={{ backgroundColor: hex }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            currentColor === hex ? 'ring-2 ring-indigo-600 scale-110 border-white' : 'border-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-slate-600 hover:bg-white rounded-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-slate-900 text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-white rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      inWishlist
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Delivery Note */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-500" /> Free express delivery in 48h
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> 30-Day Money Back Guarantee
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
