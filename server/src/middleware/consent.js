// server/src/middleware/consent.js
const fs = require('fs').promises;
const path = require('path');

/**
 * Middleware to check if user has provided consent before accessing certain endpoints
 * This can be used to ensure GDPR compliance
 */
const checkConsent = async (req, res, next) => {
  try {
    // Skip consent check for certain endpoints
    const skipConsentPaths = [
      '/api/consent',
      '/api/consent/health',
      '/api/auth/register',
      '/api/auth/login',
      '/health',
      '/api/docs',
      '/'
    ];
    
    if (skipConsentPaths.some(path => req.path.startsWith(path))) {
      return next();
    }
    
    // Get consent from headers or query params
    const consentToken = req.headers['x-consent-token'] || req.query.consentToken;
    
    if (!consentToken) {
      return res.status(403).json({
        error: 'Consent required to access this resource',
        code: 'CONSENT_REQUIRED',
        message: 'Please provide consent before accessing this API endpoint'
      });
    }
    
    // Verify consent token exists in our logs
    const isValidConsent = await verifyConsentToken(consentToken);
    
    if (!isValidConsent) {
      return res.status(403).json({
        error: 'Invalid or expired consent token',
        code: 'INVALID_CONSENT',
        message: 'The provided consent token is invalid or has expired'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking consent:', error);
    // In case of error, allow access but log the issue
    next();
  }
};

/**
 * Verify if a consent token is valid by checking our logs
 */
const verifyConsentToken = async (token) => {
  try {
    const logsDir = path.resolve(__dirname, '../logs');
    const logPath = path.join(logsDir, 'consent.log');
    
    try {
      const logData = await fs.readFile(logPath, 'utf8');
      const lines = logData.trim().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.id === token && entry.consent === 'accepted') {
            // Check if consent is still valid (not older than 1 year)
            const consentDate = new Date(entry.timestamp);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            
            return consentDate > oneYearAgo;
          }
        } catch (parseError) {
          continue;
        }
      }
      
      return false;
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        return false;
      }
      throw fileError;
    }
  } catch (error) {
    console.error('Error verifying consent token:', error);
    return false;
  }
};

/**
 * Middleware to log API access for users with consent
 */
const logConsentedAccess = async (req, res, next) => {
  try {
    const consentToken = req.headers['x-consent-token'] || req.query.consentToken;
    
    if (consentToken) {
      const accessLog = {
        id: require('crypto').randomUUID(),
        timestamp: new Date().toISOString(),
        consentToken,
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown'
      };
      
      const logsDir = path.resolve(__dirname, '../logs');
      const accessLogPath = path.join(logsDir, 'consented-access.log');
      
      await fs.appendFile(accessLogPath, JSON.stringify(accessLog) + '\n', 'utf8');
    }
    
    next();
  } catch (error) {
    console.error('Error logging consented access:', error);
    next();
  }
};

/**
 * Rate limiting specifically for users without consent
 */
const consentBasedRateLimit = (req, res, next) => {
  const consentToken = req.headers['x-consent-token'] || req.query.consentToken;
  
  if (!consentToken) {
    // Apply stricter rate limiting for users without consent
    req.rateLimit = {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 10 // 10 requests per 5 minutes
    };
  }
  
  next();
};

module.exports = {
  checkConsent,
  verifyConsentToken,
  logConsentedAccess,
  consentBasedRateLimit
};