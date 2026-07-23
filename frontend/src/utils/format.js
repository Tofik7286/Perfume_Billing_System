/**
 * Formats a number as Indian Currency (e.g. ₹1,25,000)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Removes currency symbols, commas, and other non-numeric characters from a string,
 * returning a clean float.
 * @param {string|number} val
 * @returns {number}
 */
export const cleanAmount = (val) => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  const cleanStr = String(val).replace(/[^0-9.-]+/g, '');
  return Number(cleanStr) || 0;
};

/**
 * Converts YYYY-MM-DD date string to DD-MM-YYYY format
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('-').reverse().join('-');
};
