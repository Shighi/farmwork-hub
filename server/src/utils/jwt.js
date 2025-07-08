const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * JWT utility functions for FarmWork Hub
 */

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.userType - User type (worker, employer, admin)
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    }
  );
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    }
  );
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
};

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @returns {string} Password reset token
 */
const generatePasswordResetToken = (userId) => {
  return jwt.sign(
    { userId, type: 'password-reset' },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    }
  );
};

/**
 * Verify password reset token
 * @param {string} token - Password reset token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    });
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Password reset token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid password reset token');
    } else {
      throw new Error('Password reset token verification failed');
    }
  }
};

/**
 * Generate email verification token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} Email verification token
 */
const generateEmailVerificationToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'email-verification' },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    }
  );
};

/**
 * Verify email verification token
 * @param {string} token - Email verification token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'farmwork-hub',
      audience: 'farmwork-hub-users'
    });
    
    if (decoded.type !== 'email-verification') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Email verification token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid email verification token');
    } else {
      throw new Error('Email verification token verification failed');
    }
  }
};

/**
 * Generate random token for secure operations
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} Random hex token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if not found
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Decode token without verification (useful for expired token inspection)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generateSecureToken,
  extractTokenFromHeader,
  decodeToken,
  isTokenExpired,
  getTokenExpiration
};