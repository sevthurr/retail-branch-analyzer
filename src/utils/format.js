// Utility functions for formatting data

/**
 * Format a number as Philippine Peso currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₱0.00';
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a number with comma separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a date string to readable format
 * @param {string} dateString - Date string (YYYY-MM-DD or YYYY-MM)
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  // Handle YYYY-MM format (month only)
  if (dateString.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = dateString.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
  
  // Handle full date
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Format branch type to readable text
 * @param {string} type - Branch type enum value
 * @returns {string} - Formatted branch type
 */
export const formatBranchType = (type) => {
  const types = {
    mall: 'Mall',
    roadside: 'Roadside',
    campus: 'Campus',
    commercial: 'Commercial'
  };
  return types[type] || type;
};

/**
 * Format area class to readable text
 * @param {string} areaClass - Area class enum value
 * @returns {string} - Formatted area class
 */
export const formatAreaClass = (areaClass) => {
  const classes = {
    residential: 'Residential',
    mixed: 'Mixed Use',
    commercial: 'Commercial'
  };
  return classes[areaClass] || areaClass;
};

/**
 * Get color for risk level
 * @param {string} riskLevel - Risk level (low/medium/high)
 * @returns {string} - Color hex code
 */
export const getRiskColor = (riskLevel) => {
  const colors = {
    low: '#10b981',    // green
    medium: '#f59e0b', // orange
    high: '#ef4444'    // red
  };
  return colors[riskLevel] || '#64748b'; // default gray
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
