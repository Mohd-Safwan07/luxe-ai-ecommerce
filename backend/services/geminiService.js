/**
 * Gemini Service — Encapsulates Google Gemini API calls for Luxe AI Copilot.
 * Accepts structured product candidate context & user query, returns JSON response.
 */

export const generateGeminiRecommendations = async (userPrompt, candidates, constraints) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment.');
  }

  // System instruction and structured output schema
  const systemInstruction = `
You are Luxe AI, the personal luxury shopping copilot for LuxeStore e-commerce in India.
Your goal is to recommend real products matching the customer's request, style, occasion, and budget.

CRITICAL RULES:
1. You MUST ONLY recommend products from the provided Candidates List.
2. NEVER invent fake product IDs, titles, prices, or details. Use exact "_id" values from Candidates.
3. Budget is in Indian Rupees (₹).
4. If user requests an outfit, bundle, or combo (e.g. "college outfit", "summer style", "complete look"), enable the "combo" object in response and select matching complementary items.
5. If user requests a specific single product type (e.g. shirt, jeans, shoes, hoodie), ONLY recommend products matching that exact product type. NEVER recommend unrelated categories (e.g. do not include jeans or shoes when user asks for a shirt).
6. Output MUST be valid JSON strictly adhering to the JSON schema specified.
`;

  const candidatesFormatted = candidates.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    category: c.category,
    price: c.discountedPrice !== undefined ? c.discountedPrice : c.price,
    originalPrice: c.originalPrice,
    rating: c.rating,
    badge: c.badge || '',
    stock: c.stock,
    description: c.description
  }));

  const promptContent = `
Customer Query: "${userPrompt}"
Extracted Constraints: Budget: ${constraints.budget ? '₹' + constraints.budget : 'Flexible'}, Category: ${constraints.category || 'Any'}, Keywords: ${constraints.keywords.join(', ')}

Available Real Product Candidates (${candidatesFormatted.length} items):
${JSON.stringify(candidatesFormatted, null, 2)}

Respond with JSON:
{
  "message": "Friendly markdown response explaining the selection in 2-3 sentences.",
  "recommendations": [
    {
      "productId": "<exact _id from candidate>",
      "reason": "Why this product fits style/budget"
    }
  ],
  "combo": {
    "enabled": true|false,
    "title": "Name of outfit combo if applicable",
    "productIds": ["<exact _id>", "<exact _id>"],
    "reason": "Explanation of why these products form a great combo"
  }
}
`;

  // Models to try (2.5-flash primary, 1.5-flash fallback)
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              parts: [{ text: promptContent }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response payload from Gemini API.');
      }

      // Parse JSON output
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
      return parsed;
    } catch (err) {
      console.warn(`Gemini Service attempt with ${model} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini API model attempts failed.');
};
