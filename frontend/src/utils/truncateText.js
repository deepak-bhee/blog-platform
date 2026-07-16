/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum character length
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Truncate text at word boundary.
 * @param {string} text
 * @param {number} maxWords
 */
export const truncateWords = (text, maxWords = 30) => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};
