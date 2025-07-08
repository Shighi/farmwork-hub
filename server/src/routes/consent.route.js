const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

// Validation middleware for consent data
const validateConsent = (req, res, next) => {
  const { consent } = req.body;
  
  if (!consent) {
    return res.status(400).json({ 
      error: 'Consent value is required',
      code: 'CONSENT_REQUIRED' 
    });
  }
  
  if (!['accepted', 'declined'].includes(consent)) {
    return res.status(400).json({ 
      error: 'Invalid consent value. Must be "accepted" or "declined"',
      code: 'INVALID_CONSENT_VALUE' 
    });
  }
  
  next();
};

// Utility function to ensure logs directory exists
const ensureLogsDirectory = async () => {
  const logsDir = path.resolve(__dirname, '../logs');
  try {
    await fs.access(logsDir);
  } catch (error) {
    await fs.mkdir(logsDir, { recursive: true });
  }
  return logsDir;
};

// Generate a unique session ID for tracking
const generateSessionId = () => {
  return crypto.randomUUID();
};

// Get client IP address with proper proxy handling
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
};

// Main consent logging endpoint
router.post('/consent', validateConsent, async (req, res) => {
  try {
    const { consent, userAgent: customUserAgent, metadata } = req.body;
    const ip = getClientIP(req);
    const userAgent = customUserAgent || req.headers['user-agent'] || 'unknown';
    const sessionId = generateSessionId();
    
    // Create comprehensive log entry
    const logEntry = {
      id: sessionId,
      timestamp: new Date().toISOString(),
      consent,
      ip: ip.replace(/^::ffff:/, ''), // Clean IPv4-mapped IPv6 addresses
      userAgent,
      headers: {
        'accept-language': req.headers['accept-language'] || 'unknown',
        'dnt': req.headers['dnt'] || 'unknown',
        'referer': req.headers['referer'] || 'unknown'
      },
      metadata: metadata || {},
      version: '1.0'
    };

    // Ensure logs directory exists
    const logsDir = await ensureLogsDirectory();
    const logPath = path.join(logsDir, 'consent.log');

    // Write to log file
    await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n', 'utf8');

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Consent logged:', {
        id: sessionId,
        consent,
        ip: logEntry.ip,
        timestamp: logEntry.timestamp
      });
    }

    return res.status(200).json({ 
      message: 'Consent logged successfully',
      sessionId,
      timestamp: logEntry.timestamp
    });

  } catch (error) {
    console.error('Error logging consent:', error);
    return res.status(500).json({ 
      error: 'Failed to log consent',
      code: 'CONSENT_LOG_ERROR'
    });
  }
});

// Endpoint to retrieve consent statistics (for admin use)
router.get('/consent/stats', async (req, res) => {
  try {
    // Basic authentication check (you should implement proper admin auth)
    const authHeader = req.headers.authorization;
    const adminKey = process.env.ADMIN_API_KEY;
    
    if (!adminKey || !authHeader || authHeader !== `Bearer ${adminKey}`) {
      return res.status(401).json({ 
        error: 'Unauthorized access to consent statistics',
        code: 'UNAUTHORIZED'
      });
    }

    const logsDir = await ensureLogsDirectory();
    const logPath = path.join(logsDir, 'consent.log');
    
    try {
      const logData = await fs.readFile(logPath, 'utf8');
      const lines = logData.trim().split('\n').filter(line => line.trim());
      
      const stats = {
        total: lines.length,
        accepted: 0,
        declined: 0,
        byDate: {},
        lastUpdated: new Date().toISOString()
      };
      
      lines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (entry.consent === 'accepted') stats.accepted++;
          if (entry.consent === 'declined') stats.declined++;
          
          const date = entry.timestamp.split('T')[0];
          if (!stats.byDate[date]) {
            stats.byDate[date] = { accepted: 0, declined: 0 };
          }
          stats.byDate[date][entry.consent]++;
        } catch (parseError) {
          console.warn('Invalid log entry found:', line);
        }
      });
      
      return res.json(stats);
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        return res.json({
          total: 0,
          accepted: 0,
          declined: 0,
          byDate: {},
          lastUpdated: new Date().toISOString()
        });
      }
      throw fileError;
    }
    
  } catch (error) {
    console.error('Error retrieving consent statistics:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve consent statistics',
      code: 'STATS_ERROR'
    });
  }
});

// Health check for consent logging service
router.get('/consent/health', async (req, res) => {
  try {
    const logsDir = await ensureLogsDirectory();
    const logPath = path.join(logsDir, 'consent.log');
    
    // Check if we can write to the log file
    const testEntry = {
      test: true,
      timestamp: new Date().toISOString()
    };
    
    await fs.appendFile(logPath, JSON.stringify(testEntry) + '\n', 'utf8');
    
    res.json({
      status: 'healthy',
      logsDirectory: logsDir,
      canWrite: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;