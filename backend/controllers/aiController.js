import Product from '../models/Product.js';
import { generateGeminiRecommendations } from '../services/geminiService.js';

/**
 * Detect language: English vs Hinglish / Roman Hindi
 */
const detectLanguage = (text) => {
  const hinglishWords = [
    'bhai', 'bro', 'jhuta', 'joota', 'joote', 'chahiye', 'bata', 'dikha', 'karo', 'kao',
    'dekh', 'par', 'mai', 'me', 'tak', 'ke andar', 'ke under', 'kaise', 'kaisa', 'haal', 
    'badhiya', 'sasta', 'thoda', 'achha', 'accha', 'wala', 'wali', 'dhanyawad',
    'shukriya', 'namaste', 'kaunsa', 'mast', 'soch', 'raha'
  ];
  const lower = text.toLowerCase();
  return hinglishWords.some(word => lower.includes(word)) ? 'hinglish' : 'english';
};

/**
 * Detect specific product sub-type accurately from query.
 */
const detectSpecificProductType = (text) => {
  const lower = text.toLowerCase();

  // Order matters: check t-shirt before shirt
  if (/\b(t-?shirts?|tee|tees)\b/i.test(lower)) return 'tshirt';
  if (/\b(shirts?|formal shirt|casual shirt|linen shirt)\b/i.test(lower)) return 'shirt';
  if (/\b(jeans|denim|trousers|chinos|pants)\b/i.test(lower)) return 'jeans';
  if (/\b(shoes?|sneakers?|running shoes?|footwear|joota|joote|jhuta)\b/i.test(lower)) return 'shoes';
  if (/\b(hoodie|hoodies|sweatshirt|sweatshirts|jacket|jackets|sweater)\b/i.test(lower)) return 'hoodie';
  if (/\b(headphones?|earphones?|earbuds?|speaker|speakers)\b/i.test(lower)) return 'headphones';
  if (/\b(phone|phones|smartphone|smartphones|mobile|mobiles|iphone|galaxy)\b/i.test(lower)) return 'phone';
  if (/\b(watch|watches|smartwatch)\b/i.test(lower)) return 'watch';
  if (/\b(wallet|wallets|cardholder|backpack|bag|bags)\b/i.test(lower)) return 'wallet';

  return null;
};

/**
 * Bulletproof numeric budget parser for all Indian Rupee formats and Hinglish suffixes/prefixes.
 */
const extractNumericBudget = (text) => {
  const lower = text.toLowerCase();

  // 1. "1k", "1.5k", "8k" -> 1000, 1500, 8000
  const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }

  // 2. Suffix Match: e.g. "800 ke under", "800 ke andar", "800 me", "800 mai", "800 tak", "800 rs", "800 rupees", "800 rupaye", "800 inr", "800 budget", "800 max"
  const suffixMatch = lower.match(/(\d[\d,]*)\s*(?:ke\s+under|ke\s+andar|under|andar|me|mai|tak|rs|rupees|rupaye|inr|budget|max)\b/i);
  if (suffixMatch) {
    const val = parseInt(suffixMatch[1].replace(/,/g, ''), 10);
    if (val >= 50) return val;
  }

  // 3. Prefix Match: e.g. "under 800", "below 800", "within 800", "budget 800", "around 800", "less than 800", "approx 800"
  const prefixMatch = lower.match(/(?:under|below|around|less than|budget|within|approx|rs\.?|inr|rupees|rupaye|₹)\s*₹?\s*(\d[\d,]*)/i);
  if (prefixMatch) {
    const val = parseInt(prefixMatch[1].replace(/,/g, ''), 10);
    if (val >= 50) return val;
  }

  // 4. Rupee symbol match: e.g. "₹800", "₹ 800", "rs 800", "rs. 800"
  const rupeeMatch = lower.match(/(?:₹|rs\.?)\s*(\d[\d,]*)/i);
  if (rupeeMatch) {
    const val = parseInt(rupeeMatch[1].replace(/,/g, ''), 10);
    if (val >= 50) return val;
  }

  // 5. Bare trailing number if sentence expresses budget intent e.g. "bhai shoes 800"
  const trailingNum = lower.match(/\b(\d{3,6})\b/);
  if (trailingNum && /shoes|jhuta|joota|joote|tshirt|shirt|jeans|hoodie|outfit|gift|phone|under|below|kao|karo/i.test(lower)) {
    const val = parseInt(trailingNum[1], 10);
    if (val >= 100) return val;
  }

  return null;
};

/**
 * Natural language intent & constraint classifier.
 */
const classifyUserIntent = (prompt, history = []) => {
  const text = prompt.trim().toLowerCase();
  const language = detectLanguage(text);

  // 1. Check Greetings
  const isGreeting = /^(hy|hi|hello|hey|helo|hii|namaste|ssup|yo)\b/i.test(text) ||
                     /kaisa hai|kaise ho|kya haal|kya chal|bhai kya/i.test(text);

  // 2. Check Thanks
  const isThanks = /^(thanks|thank you|dhanyawad|shukriya|thx|tq)\b/i.test(text);

  // 3. Check Goodbye
  const isGoodbye = /^(bye|goodbye|alvida|cya|see you)\b/i.test(text);

  // 4. Check Casual Remarks
  const isCasual = /^(ok|okay|nice|great|achha|accha|sahi hai|mast|theek hai)\b/i.test(text);

  // 5. Check Outfit Intent
  const isOutfitRequest = /outfit|combo|full outfit|complete outfit|complete look|dress combination|look|bundle|set|pair|wear/i.test(text);

  // 6. Check Gift Intent
  const isGiftRequest = /gift|present|birthday gift|anniversary/i.test(text);

  // 7. Check Specific Product Type
  const specificProductType = detectSpecificProductType(text);

  // 8. Extract Numeric Budget
  const parsedBudget = extractNumericBudget(text);
  const budget = parsedBudget;
  const hasExplicitBudget = parsedBudget !== null;

  // 9. Category Mapping
  let category = null;
  if (specificProductType === 'phone' || specificProductType === 'headphones' || specificProductType === 'watch') {
    category = 'Electronics';
  } else if (specificProductType === 'shirt' || specificProductType === 'tshirt' || specificProductType === 'jeans' || specificProductType === 'hoodie') {
    category = 'Fashion';
  } else if (specificProductType === 'shoes') {
    category = 'Shoes';
  } else if (specificProductType === 'wallet') {
    category = 'Accessories';
  }

  // Determine Primary Intent
  let intent = 'general_search';

  if (isGreeting) {
    intent = 'GREETING';
  } else if (isThanks) {
    intent = 'THANKS';
  } else if (isGoodbye) {
    intent = 'GOODBYE';
  } else if (isCasual && !specificProductType && !isOutfitRequest && !isGiftRequest) {
    intent = 'CASUAL_CONVERSATION';
  } else if (isOutfitRequest) {
    intent = 'complete_outfit';
  } else if (specificProductType) {
    intent = 'single_product';
  } else if (isGiftRequest) {
    intent = 'gift';
  } else if (category || hasExplicitBudget) {
    intent = 'general_search';
  } else {
    intent = 'GREETING';
  }

  return {
    intent,
    language,
    budget,
    hasExplicitBudget,
    category,
    specificProductType,
    isOutfitRequest: intent === 'complete_outfit',
    isGiftRequest: intent === 'gift',
    isShoppingIntent: ['single_product', 'complete_outfit', 'gift', 'general_search'].includes(intent)
  };
};

/**
 * Handle Conversational / Non-Shopping Responses
 */
const getConversationalResponse = (intent, language) => {
  if (intent === 'GREETING') {
    if (language === 'hinglish') {
      return "Hey bhai! 👋 Badhiya hoon! Aaj kya dekhna hai? Shirts, T-shirts, Shoes ya koi outfit?";
    }
    return "Hey! 👋 I'm Luxe AI, your personal shopping copilot. What are you looking for today?";
  }

  if (intent === 'THANKS') {
    if (language === 'hinglish') {
      return "Anytime bhai! 😄 Kuch aur help chahiye toh batao.";
    }
    return "You're welcome! 😄 Let me know if you need anything else!";
  }

  if (intent === 'GOODBYE') {
    if (language === 'hinglish') {
      return "Bye bhai! 👋 Happy shopping on LuxeStore!";
    }
    return "Goodbye! Have a great day and happy shopping! 👋";
  }

  if (intent === 'CASUAL_CONVERSATION') {
    if (language === 'hinglish') {
      return "Sahi hai bhai 😄 Batao, aaj shopping mein kya search karein?";
    }
    return "Awesome! What can I help you find today?";
  }

  return "Hello! How can I assist your shopping today?";
};

/**
 * Categorize real products into subcategories: Tops, Bottoms, Footwear, Accessories.
 */
const categorizeProducts = (products) => {
  const tops = [];
  const bottoms = [];
  const footwear = [];
  const accessories = [];

  products.forEach((p) => {
    const name = p.name.toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const price = p.discountedPrice !== undefined ? p.discountedPrice : p.price;

    const prodObj = { ...p, effectivePrice: price };

    if (cat === 'shoes') {
      footwear.push(prodObj);
    } else if (cat === 'accessories') {
      accessories.push(prodObj);
    } else if (cat === 'fashion') {
      if (/jeans|trousers|chinos|pants|shorts/i.test(name) || /jeans|pants/i.test(desc)) {
        bottoms.push(prodObj);
      } else {
        tops.push(prodObj);
      }
    } else {
      accessories.push(prodObj);
    }
  });

  return { tops, bottoms, footwear, accessories };
};

/**
 * Deterministic multi-category outfit combination builder.
 */
const buildOutfitCombination = (allProducts, constraints) => {
  const { tops, bottoms, footwear, accessories } = categorizeProducts(allProducts);
  const targetBudget = constraints.budget || 5000;

  let bestComboProducts = [];
  let bestTotal = 0;
  let comboType = '';

  // 1. Try 3-Piece Outfit (Top + Bottom + Footwear)
  for (const t of tops) {
    for (const b of bottoms) {
      for (const f of footwear) {
        const sum = t.effectivePrice + b.effectivePrice + f.effectivePrice;
        if (sum <= targetBudget) {
          if (sum > bestTotal || bestComboProducts.length < 3) {
            bestComboProducts = [t, b, f];
            bestTotal = sum;
            comboType = '3-piece';
          }
        }
      }
    }
  }

  // 2. Try adding an accessory if budget permits on 3-piece outfit
  if (comboType === '3-piece' && accessories.length > 0) {
    for (const a of accessories) {
      const sumWithAcc = bestTotal + a.effectivePrice;
      if (sumWithAcc <= targetBudget) {
        bestComboProducts.push(a);
        bestTotal = sumWithAcc;
        break;
      }
    }
  }

  // 3. Fallback: Try 2-Piece Outfits (Top + Bottom, Top + Footwear, Bottom + Footwear)
  if (bestComboProducts.length === 0) {
    const pairs = [
      [tops, bottoms],
      [tops, footwear],
      [bottoms, footwear]
    ];

    for (const [listA, listB] of pairs) {
      for (const itemA of listA) {
        for (const itemB of listB) {
          const sum = itemA.effectivePrice + itemB.effectivePrice;
          if (sum <= targetBudget && sum > bestTotal) {
            bestComboProducts = [itemA, itemB];
            bestTotal = sum;
            comboType = '2-piece';
          }
        }
      }
    }
  }

  return { comboProducts: bestComboProducts, total: bestTotal, comboType };
};

/**
 * Filter products strictly by specific subcategory type.
 */
const filterBySpecificProductType = (products, type) => {
  if (!type) return products;

  return products.filter((p) => {
    const name = p.name.toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();

    if (type === 'shirt') {
      return /\bshirts?\b/i.test(name) && !/\bt-?shirts?\b/i.test(name) && !/\btee\b/i.test(name);
    }
    if (type === 'tshirt') {
      return /\b(t-?shirts?|tee|crews?)\b/i.test(name);
    }
    if (type === 'jeans') {
      return /\b(jeans|denim|trousers|chinos|pants)\b/i.test(name);
    }
    if (type === 'shoes') {
      return cat === 'shoes' || /\b(shoes?|sneakers?|running|footwear|boots?|joota|joote|jhuta)\b/i.test(name);
    }
    if (type === 'hoodie') {
      return /\b(hoodie|sweatshirt|jacket|sweater)\b/i.test(name);
    }
    if (type === 'headphones') {
      return /\b(headphones?|earphones?|earbuds?|speaker)\b/i.test(name);
    }
    if (type === 'phone') {
      return /\b(phone|smartphone|mobile|iphone|galaxy)\b/i.test(name);
    }
    if (type === 'watch') {
      return /\b(watch|smartwatch)\b/i.test(name);
    }
    if (type === 'wallet') {
      return /\b(wallet|cardholder|backpack|bag)\b/i.test(name);
    }

    return true;
  });
};

/**
 * Controller: POST /api/ai/shopping-assistant
 */
export const getAIShoppingAssistant = async (req, res, next) => {
  try {
    const { prompt, history = [] } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt message string is required.' });
    }

    // 1. Intent & Constraint Classification
    const meta = classifyUserIntent(prompt, history);

    // 2. Handle Non-Shopping Intents (Greetings, Thanks, Goodbye, Casual)
    if (!meta.isShoppingIntent) {
      const conversationalMsg = getConversationalResponse(meta.intent, meta.language);
      return res.json({
        message: conversationalMsg,
        recommendations: [],
        combo: { enabled: false },
        queryMeta: {
          intent: meta.intent,
          language: meta.language
        }
      });
    }

    // Handle missing budget for explicit outfit request
    if (meta.intent === 'complete_outfit' && !meta.hasExplicitBudget) {
      meta.budget = 5000;
    }

    // 3. Query Products from MongoDB Atlas
    let candidates = await Product.find({ stock: { $gt: 0 } }).lean();

    // Perform Strict Subcategory Filtering if user requested a specific single product type
    if (meta.intent === 'single_product' && meta.specificProductType) {
      candidates = filterBySpecificProductType(candidates, meta.specificProductType);
    } else if (meta.category && !meta.isOutfitRequest) {
      const catFiltered = candidates.filter(p => (p.category || '').toLowerCase() === meta.category.toLowerCase());
      if (catFiltered.length > 0) candidates = catFiltered;
    }

    // Perform Strict Budget Filtering (PRICE MUST BE <= BUDGET)
    if (meta.budget && meta.hasExplicitBudget) {
      candidates = candidates.filter((p) => {
        const price = typeof p.discountedPrice === 'number' ? p.discountedPrice : p.price;
        return price <= meta.budget;
      });
    }

    // If NO candidate products match the strict budget and subcategory
    if (candidates.length === 0) {
      const typeLabel = meta.specificProductType || meta.category || 'product';
      const emptyMsg = meta.language === 'hinglish'
        ? `Sorry bhai, ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : ''} ke andar mujhe koi suitable ${typeLabel} nahi mile. Kya main budget ₹1200 ya ₹1500 tak increase karke options dikhaun?`
        : `Sorry, I couldn't find any suitable ${typeLabel}s under ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : 'that budget'}. Would you like me to show options with a slightly higher budget?`;

      return res.json({
        message: emptyMsg,
        recommendations: [],
        combo: { enabled: false }
      });
    }

    const candidateMap = new Map();
    candidates.forEach((p) => candidateMap.set(p._id.toString(), p));

    let aiResult = null;

    // 4. Try Gemini API if key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        aiResult = await generateGeminiRecommendations(prompt, candidates, meta);
      } catch (geminiError) {
        console.warn('Gemini API execution failed, executing deterministic engine:', geminiError.message);
      }
    }

    // 5. Fallback Engine execution if Gemini unavailable or failed
    if (!aiResult || !Array.isArray(aiResult.recommendations)) {
      if (meta.intent === 'complete_outfit') {
        const allInStock = await Product.find({ stock: { $gt: 0 } }).lean();
        const detCombo = buildOutfitCombination(allInStock, meta);

        if (detCombo.comboProducts.length >= 2) {
          const remainingBudget = meta.budget ? Math.max(0, meta.budget - detCombo.total) : null;
          const comboMsg = meta.language === 'hinglish'
            ? `Bilkul bhai! ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : '5,000'} ke andar ye complete outfit dekho:`
            : `Here is a complete outfit curated for you within your budget of ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : '5,000'}:`;

          aiResult = {
            message: comboMsg,
            recommendations: detCombo.comboProducts.map((p) => ({
              productId: p._id.toString(),
              reason: 'Matching piece for your outfit.'
            })),
            combo: {
              enabled: true,
              title: '✨ Complete Curated Outfit',
              products: detCombo.comboProducts,
              total: detCombo.total,
              remainingBudget,
              reason: 'These pieces create a stylish look while staying within your budget.'
            }
          };
        } else {
          aiResult = {
            message: meta.language === 'hinglish'
              ? `Bhai ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : 'budget'} ke andar complete outfit nahi ban paya, par ye option hai:`
              : `I couldn't build a complete multi-piece outfit within your budget, so here is the best available option:`,
            recommendations: detCombo.comboProducts.slice(0, 1).map((p) => ({
              productId: p._id.toString(),
              reason: 'Best available matching item.'
            })),
            combo: { enabled: false }
          };
        }
      } else {
        // Single Product or General Search Fallback
        const recs = candidates.slice(0, 3).map((p) => ({
          productId: p._id.toString(),
          reason: meta.language === 'hinglish'
            ? `Aapke search (${meta.specificProductType || 'product'}) aur budget ke hisab se perfect choice.`
            : `Fits your ${meta.specificProductType || 'search'} request under budget.`
        }));

        const searchMsg = meta.language === 'hinglish'
          ? `Bilkul bhai! ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : ''} ke andar ye ${meta.specificProductType || 'item'} dekho:`
          : `Here are the top ${meta.specificProductType || 'product'} recommendations matching your search:`;

        aiResult = {
          message: searchMsg,
          recommendations: recs,
          combo: { enabled: false }
        };
      }
    }

    // 6. Validate Product IDs and Recalculate Totals from MongoDB Data
    let validatedRecs = [];
    if (Array.isArray(aiResult.recommendations)) {
      for (const item of aiResult.recommendations) {
        const prodId = item.productId || item.id || item._id;
        if (prodId && candidateMap.has(prodId.toString())) {
          const dbProd = candidateMap.get(prodId.toString());
          const price = typeof dbProd.discountedPrice === 'number' ? dbProd.discountedPrice : dbProd.price;

          // Double check strict single product subcategory match
          if (meta.intent === 'single_product' && meta.specificProductType) {
            const matchesType = filterBySpecificProductType([dbProd], meta.specificProductType).length > 0;
            if (!matchesType) continue; // Skip leaking category items
          }

          // RULE 5: DISPLAY VALIDATION & STRICT BUDGET ENFORCEMENT
          // Double check numeric price MUST BE <= meta.budget
          if (meta.budget && meta.hasExplicitBudget && price > meta.budget) {
            continue; // Strictly reject over-budget items!
          }

          validatedRecs.push({
            productId: dbProd._id.toString(),
            reason: item.reason || `Fits your request.`,
            product: {
              ...dbProd,
              id: dbProd._id.toString(),
              effectivePrice: price
            }
          });
        }
      }
    }

    // If Gemini recommendations were filtered out due to category/budget mismatch, fall back to valid candidate list
    if (meta.intent === 'single_product' && validatedRecs.length === 0 && candidates.length > 0) {
      validatedRecs = candidates.slice(0, 3).map((p) => ({
        productId: p._id.toString(),
        reason: meta.language === 'hinglish'
          ? `Perfect ${meta.specificProductType} matching your budget.`
          : `Matches your ${meta.specificProductType} request within budget.`,
        product: {
          ...p,
          id: p._id.toString(),
          effectivePrice: typeof p.discountedPrice === 'number' ? p.discountedPrice : p.price
        }
      }));
    }

    // If NO validated products remain after strict budget enforcement
    if (validatedRecs.length === 0 && !aiResult.combo?.enabled) {
      const typeLabel = meta.specificProductType || meta.category || 'product';
      const noMatchMsg = meta.language === 'hinglish'
        ? `Sorry bhai, ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : ''} ke andar mujhe koi suitable ${typeLabel} nahi mile. Kya main budget ₹1200 ya ₹1500 tak increase karke options dikhaun?`
        : `Sorry, I couldn't find any suitable ${typeLabel}s under ₹${meta.budget ? meta.budget.toLocaleString('en-IN') : 'that budget'}. Would you like me to show options with a slightly higher budget?`;

      return res.json({
        message: noMatchMsg,
        recommendations: [],
        combo: { enabled: false }
      });
    }

    // 7. Validate Outfit Combo ONLY if intent is complete_outfit
    let validatedCombo = { enabled: false };
    if (meta.intent === 'complete_outfit' && aiResult.combo && aiResult.combo.enabled) {
      let comboProds = [];
      let comboTotal = 0;

      if (Array.isArray(aiResult.combo.products)) {
        comboProds = aiResult.combo.products;
      } else if (Array.isArray(aiResult.combo.productIds)) {
        for (const id of aiResult.combo.productIds) {
          if (id && candidateMap.has(id.toString())) {
            const dbP = candidateMap.get(id.toString());
            const price = typeof dbP.discountedPrice === 'number' ? dbP.discountedPrice : dbP.price;
            comboProds.push({
              ...dbP,
              id: dbP._id.toString(),
              effectivePrice: price
            });
          }
        }
      }

      comboTotal = comboProds.reduce((sum, p) => sum + (p.effectivePrice || p.price), 0);

      // Enforce budget limit
      if (meta.budget && comboTotal > meta.budget) {
        let pruned = [];
        let prunedTotal = 0;
        for (const p of comboProds) {
          const pPrice = p.effectivePrice || p.price;
          if (prunedTotal + pPrice <= meta.budget) {
            pruned.push(p);
            prunedTotal += pPrice;
          }
        }
        comboProds = pruned;
        comboTotal = prunedTotal;
      }

      if (comboProds.length >= 2) {
        const remainingBudget = meta.budget ? Math.max(0, meta.budget - comboTotal) : null;
        validatedCombo = {
          enabled: true,
          title: aiResult.combo.title || '✨ Complete Outfit Combo',
          products: comboProds,
          total: comboTotal,
          remainingBudget,
          reason: aiResult.combo.reason || 'These pieces create a stylish look while staying within your budget.'
        };
      }
    }

    // 8. Return Final Structured Response
    return res.json({
      message: aiResult.message || 'Here are the top recommendations matching your search:',
      recommendations: validatedRecs,
      combo: validatedCombo,
      queryMeta: {
        intent: meta.intent,
        specificProductType: meta.specificProductType,
        language: meta.language,
        budget: meta.budget
      }
    });

  } catch (error) {
    next(error);
  }
};
