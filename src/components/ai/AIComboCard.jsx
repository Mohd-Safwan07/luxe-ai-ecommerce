import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/formatters';
import { Sparkles, ShoppingBag, Check, AlertCircle } from 'lucide-react';

export const AIComboCard = ({ combo }) => {
  const { addToCart, addToast } = useShop();
  const [addedAll, setAddedAll] = useState(false);

  if (!combo || !combo.enabled || !Array.isArray(combo.products) || combo.products.length === 0) {
    return null;
  }

  const handleAddComboToCart = () => {
    let addedCount = 0;
    combo.products.forEach((product) => {
      if (product && (product.stock === undefined || product.stock > 0)) {
        addToCart(product, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setAddedAll(true);
      addToast(`🎉 Added complete ${combo.title || 'outfit'} (${addedCount} items) to your cart!`, 'success');
      setTimeout(() => setAddedAll(false), 2500);
    } else {
      addToast('Sorry, none of the items in this combo are currently in stock.', 'error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-500/30 shadow-xl space-y-4 my-3">
      {/* Combo Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">
              {combo.title || '✨ Complete Outfit Combo'}
            </h4>
            <span className="text-[10px] text-indigo-300">
              {combo.products.length} Matching Products
            </span>
          </div>
        </div>

        <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black px-3 py-1 rounded-full">
          {formatINR(combo.total)}
        </span>
      </div>

      {/* Itemized Combo Products List */}
      <div className="space-y-2.5">
        {combo.products.map((item, idx) => {
          const itemPrice = item.effectivePrice !== undefined ? item.effectivePrice : (item.discountedPrice !== undefined ? item.discountedPrice : item.price);
          return (
            <div
              key={item.id || item._id || idx}
              className="flex items-center justify-between bg-slate-900/80 border border-indigo-900/60 rounded-2xl p-2.5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-xl bg-slate-800 border border-slate-700 shrink-0"
                />
                <div>
                  <span className="font-bold text-xs text-white block line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-indigo-300 capitalize">
                    {item.category}
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-xs text-emerald-400">
                {formatINR(itemPrice)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reasoning & Remaining Budget Banner */}
      <div className="space-y-1.5 text-xs text-slate-300 pt-1">
        {combo.reason && (
          <p className="text-[11px] text-indigo-200 leading-relaxed italic bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/40">
            "{combo.reason}"
          </p>
        )}

        {combo.remainingBudget !== null && combo.remainingBudget !== undefined && (
          <div className="flex justify-between items-center text-[11px] font-semibold text-emerald-300 pt-1">
            <span>Remaining Budget:</span>
            <span className="font-bold">{formatINR(combo.remainingBudget)}</span>
          </div>
        )}
      </div>

      {/* Add Complete Outfit to Cart Action */}
      <button
        onClick={handleAddComboToCart}
        className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
          addedAll
            ? 'bg-emerald-500 text-slate-950 scale-98'
            : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20 active:scale-98'
        }`}
      >
        {addedAll ? (
          <>
            <Check className="w-4 h-4" /> Added Complete Outfit to Cart!
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> Add Complete Outfit to Cart ({formatINR(combo.total)})
          </>
        )}
      </button>
    </div>
  );
};
