const bcrypt = require('bcryptjs');

/**
 * BCrypt utility functions for FarmWork Hub
 */

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password, saltRounds = 12) => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }
    
    if (typeof password !== 'string') {
      throw new Error('Password must be a string');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      throw new Error('Password must be less than 128 characters long');
    }
    
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Compare password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }
    
    if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
      throw new Error('Password and hashed password must be strings');
    }
    
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Password comparison failed: ${error.message}`);
  }
};

/**
 * Generate random salt
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} Generated salt
 */
const generateSalt = async (saltRounds = 12) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
  } catch (error) {
    throw new Error(`Salt generation failed: ${error.message}`);
  }
};

/**
 * Hash password with provided salt
 * @param {string} password - Plain text password
 * @param {string} salt - Salt to use for hashing
 * @returns {Promise<string>} Hashed password
 */
const hashPasswordWithSalt = async (password, salt) => {
  try {
    if (!password || !salt) {
      throw new Error('Password and salt are required');
    }
    
    if (typeof password !== 'string' || typeof salt !== 'string') {
      throw new Error('Password and salt must be strings');
    }
    
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing with salt failed: ${error.message}`);
  }
};

/**
 * Get salt rounds from hashed password
 * @param {string} hashedPassword - Hashed password
 * @returns {number|null} Number of salt rounds or null if invalid
 */
const getSaltRounds = (hashedPassword) => {
  try {
    if (!hashedPassword || typeof hashedPassword !== 'string') {
      return null;
    }
    
    // bcrypt hash format: $2a$10$... or $2b$10$...
    const parts = hashedPassword.split('$');
    if (parts.length < 4) {
      return null;
    }
    
    const rounds = parseInt(parts[2], 10);
    return isNaN(rounds) ? null : rounds;
  } catch (error) {
    return null;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and messages
 */
const validatePasswordStrength = (password) => {
  const result = {
    isValid: true,
    messages: [],
    score: 0
  };
  
  if (!password) {
    result.isValid = false;
    result.messages.push('Password is required');
    return result;
  }
  
  if (typeof password !== 'string') {
    result.isValid = false;
    result.messages.push('Password must be a string');
    return result;
  }
  
  // Length check
  if (password.length < 8) {
    result.isValid = false;
    result.messages.push('Password must be at least 8 characters long');
  } else if (password.length >= 8) {
    result.score += 1;
  }
  
  if (password.length > 128) {
    result.isValid = false;
    result.messages.push('Password must be less than 128 characters long');
  }
  
  // Character type checks
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasLowerCase) {
    result.messages.push('Password should contain at least one lowercase letter');
  } else {
    result.score += 1;
  }
  
  if (!hasUpperCase) {
    result.messages.push('Password should contain at least one uppercase letter');
  } else {
    result.score += 1;
  }
  
  if (!hasNumbers) {
    result.messages.push('Password should contain at least one number');
  } else {
    result.score += 1;
  }
  
  if (!hasSpecialChar) {
    result.messages.push('Password should contain at least one special character');
  } else {
    result.score += 1;
  }
  
  // Common password patterns
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^admin/i,
    /^welcome/i,
    /^letmein/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      result.isValid = false;
      result.messages.push('Password contains common patterns that are easily guessable');
      break;
    }
  }
  
  // Sequential characters
  const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(password);
  if (hasSequential) {
    result.messages.push('Password should not contain sequential characters');
  }
  
  // Repeated characters
  const hasRepeated = /(.)\1{2,}/.test(password);
  if (hasRepeated) {
    result.messages.push('Password should not contain repeated characters');
  }
  
  return result;
};

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @param {Object} options - Options for password generation
 * @returns {string} Generated password
 */
const generateSecurePassword = (length = 12, options = {}) => {
  const {
    includeUpperCase = true,
    includeLowerCase = true,
    includeNumbers = true,
    includeSpecialChars = true,
    excludeSimilar = true
  } = options;
  
  let charset = '';
  
  if (includeLowerCase) {
    charset += excludeSimilar ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (includeUpperCase) {
    charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (includeNumbers) {
    charset += excludeSimilar ? '23456789' : '0123456789';
  }
  
  if (includeSpecialChars) {
    charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  if (!charset) {
    throw new Error('At least one character type must be included');
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

/**
 * Check if password needs rehashing (due to cost factor changes)
 * @param {string} hashedPassword - Current hashed password
 * @param {number} currentSaltRounds - Current salt rounds setting
 * @returns {boolean} True if password needs rehashing
 */
const needsRehash = (hashedPassword, currentSaltRounds = 12) => {
  try {
    const passwordSaltRounds = getSaltRounds(hashedPassword);
    return passwordSaltRounds !== currentSaltRounds;
  } catch (error) {
    return true; // If we can't determine, assume it needs rehashing
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateSalt,
  hashPasswordWithSalt,
  getSaltRounds,
  validatePasswordStrength,
  generateSecurePassword,
  needsRehash
};