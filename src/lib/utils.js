// src/lib/utils.js

/**
 * Generate a unique slug for portfolio URLs
 * @param {string} userId - User ID from Firebase
 * @returns {string} Unique slug
 */
export function generateUniqueSlug(userId) {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${userId.substring(0, 8)}-${timestamp}-${randomStr}`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

/**
 * Calculate completion percentage of portfolio
 * @param {Object} portfolioData - Portfolio data object
 * @returns {number} Completion percentage (0-100)
 */
export function calculateCompletion(portfolioData) {
  let filledFields = 0;
  const totalFields = 12; // Total number of important fields
  
  // Personal Info (4 fields)
  if (portfolioData?.personalInfo?.name) filledFields++;
  if (portfolioData?.personalInfo?.email) filledFields++;
  if (portfolioData?.personalInfo?.title) filledFields++;
  if (portfolioData?.personalInfo?.location) filledFields++;
  
  // About Me (1 field)
  if (portfolioData?.aboutMe?.summary) filledFields++;
  
  // Experience (2 fields)
  if (portfolioData?.experience?.length > 0) filledFields += 2;
  
  // Education (1 field)
  if (portfolioData?.education?.length > 0) filledFields++;
  
  // Skills (2 fields)
  if (portfolioData?.skills?.technical?.length > 0) filledFields++;
  if (portfolioData?.skills?.soft?.length > 0) filledFields++;
  
  // Projects (1 field)
  if (portfolioData?.projects?.length > 0) filledFields++;
  
  // Social Links (1 field)
  if (portfolioData?.socialLinks && Object.keys(portfolioData.socialLinks).length > 0) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Sanitize text for safe display
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (!text) return '';
  
  // Remove HTML tags
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export function getInitials(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export function isValidUrl(url) {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
}

/**
 * Convert file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 