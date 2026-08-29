/**
 * Standard Indian Rupee (INR) currency formatter.
 * Formats numbers into ₹ standard representation (e.g. ₹999, ₹1,299, ₹12,999, ₹1,00,000)
 *
 * @param {number|string} amount
 * @param {boolean} showDecimals
 * @returns {string}
 */
export const formatINR = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '₹0';
  const numeric = Number(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(numeric);
  return `₹${formatted}`;
};
