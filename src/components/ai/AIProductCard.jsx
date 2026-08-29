import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/formatters';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

export const AIProductCard = ({ product, reason }) => {
  const { addToCart, openQuickView } = useShop();
  const [addedAnim, setAddedAnim] = useState(false);

  const price = product.effectivePrice !== undefined ? product.effectivePrice : (product.discountedPrice !== undefined ? product.discountedPrice : product.price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-2.5">
      <div className="flex gap-3 items-start">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200 cursor-pointer"
          onClick={() => openQuickView(product)}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="font-bold text-indigo-600 uppercase tracking-wide truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-slate-800">{product.rating || 4.8}</span>
            </div>
          </div>

          <h4
            onClick={() => openQuickView(product)}
            className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors mt-0.5"
            title={product.name}
          >
            {product.name}
          </h4>

          {reason && (
            <p className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5">
              "{reason}"
            </p>
          )}

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-extrabold text-slate-900 text-sm">
              {formatINR(price)}
            </span>
            {product.originalPrice > price && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => openQuickView(product)}
          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>

        <button
          onClick={handleAddToCart}
          className={`flex-1 py-1.5 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
            addedAnim
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
          }`}
        >
          {addedAnim ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};
