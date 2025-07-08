const consentService = require('../services/consentService');
const { generateSessionId, getClientIP } = require('../utils/consentLogger');

class ConsentController {
  /**
   * Record user consent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async recordConsent(req, res) {
    try {
      const { consent, userAgent: customUserAgent, metadata } = req.body;
      const userId = req.user ? req.user.id : null; // Get user ID if authenticated
      const ip = getClientIP(req);
      const userAgent = customUserAgent || req.headers['user-agent'] || 'unknown';
      const sessionId = generateSessionId();

      // Prepare consent data
      const consentData = {
        consent,
        ip,
        userAgent,
        metadata: {
          ...metadata,
          headers: {
            'accept-language': req.headers['accept-language'] || 'unknown',
            'dnt': req.headers['dnt'] || 'unknown',
            'referer': req.headers['referer'] || 'unknown'
          }
        },
        userId,
        sessionId
      };

      // Record consent using service
      const consentRecord = await consentService.recordConsent(consentData);

      // Log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Consent recorded:', {
          id: consentRecord.id,
          consent,
          ip,
          userId,
          timestamp: consentRecord.timestamp
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Consent recorded successfully',
        data: {
          id: consentRecord.id,
          sessionId,
          timestamp: consentRecord.timestamp,
          consent: consentRecord.consent
        }
      });

    } catch (error) {
      console.error('Error in recordConsent controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to record consent',
        code: 'CONSENT_RECORD_ERROR'
      });
    }
  }

  /**
   * Get consent statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getConsentStats(req, res) {
    try {
      // Check admin authorization
      const authHeader = req.headers.authorization;
      const adminKey = process.env.ADMIN_API_KEY;
      
      if (!adminKey || !authHeader || authHeader !== `Bearer ${adminKey}`) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized access to consent statistics',
          code: 'UNAUTHORIZED'
        });
      }

      const { startDate, endDate, consent } = req.query;
      const filters = {};
      
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (consent) filters.consent = consent;

      const stats = await consentService.getConsentStats(filters);

      return res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error in getConsentStats controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve consent statistics',
        code: 'STATS_ERROR'
      });
    }
  }

  /**
   * Get user's consent history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserConsentHistory(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const history = await consentService.getUserConsentHistory(userId);

      return res.status(200).json({
        success: true,
        data: {
          userId,
          history
        }
      });

    } catch (error) {
      console.error('Error in getUserConsentHistory controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve consent history',
        code: 'HISTORY_ERROR'
      });
    }
  }

  /**
   * Get latest user consent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLatestUserConsent(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const latestConsent = await consentService.getLatestUserConsent(userId);

      return res.status(200).json({
        success: true,
        data: {
          userId,
          latestConsent
        }
      });

    } catch (error) {
      console.error('Error in getLatestUserConsent controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve latest consent',
        code: 'LATEST_CONSENT_ERROR'
      });
    }
  }

  /**
   * Check if user has valid consent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkValidConsent(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const hasValidConsent = await consentService.hasValidConsent(userId);

      return res.status(200).json({
        success: true,
        data: {
          userId,
          hasValidConsent,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error in checkValidConsent controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to check consent validity',
        code: 'CONSENT_CHECK_ERROR'
      });
    }
  }

  /**
   * Withdraw user consent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async withdrawConsent(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const ip = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';
      const sessionId = generateSessionId();

      const requestData = {
        ip,
        userAgent,
        sessionId,
        metadata: {
          withdrawalMethod: 'user_request',
          timestamp: new Date().toISOString()
        }
      };

      const withdrawalRecord = await consentService.withdrawConsent(userId, requestData);

      return res.status(200).json({
        success: true,
        message: 'Consent withdrawn successfully',
        data: {
          id: withdrawalRecord.id,
          timestamp: withdrawalRecord.timestamp
        }
      });

    } catch (error) {
      console.error('Error in withdrawConsent controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to withdraw consent',
        code: 'WITHDRAW_ERROR'
      });
    }
  }

  /**
   * Export user consent data (GDPR compliance)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportUserConsentData(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const exportData = await consentService.exportUserConsentData(userId);

      return res.status(200).json({
        success: true,
        data: exportData
      });

    } catch (error) {
      console.error('Error in exportUserConsentData controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to export consent data',
        code: 'EXPORT_ERROR'
      });
    }
  }

  /**
   * Health check for consent service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async healthCheck(req, res) {
    try {
      // Test database connection
      const testRecord = await consentService.recordConsent({
        consent: 'accepted',
        ip: '127.0.0.1',
        userAgent: 'health-check',
        sessionId: 'health-check-' + Date.now(),
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      });

      return res.status(200).json({
        success: true,
        status: 'healthy',
        service: 'consent-service',
        database: 'connected',
        timestamp: new Date().toISOString(),
        testRecordId: testRecord.id
      });

    } catch (error) {
      console.error('Consent service health check failed:', error);
      return res.status(500).json({
        success: false,
        status: 'unhealthy',
        service: 'consent-service',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Clean up old consent records (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async cleanupOldRecords(req, res) {
    try {
      // Check admin authorization
      const authHeader = req.headers.authorization;
      const adminKey = process.env.ADMIN_API_KEY;
      
      if (!adminKey || !authHeader || authHeader !== `Bearer ${adminKey}`) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized access to cleanup function',
          code: 'UNAUTHORIZED'
        });
      }

      const deletedCount = await consentService.cleanupOldRecords();

      return res.status(200).json({
        success: true,
        message: 'Old consent records cleaned up successfully',
        data: {
          deletedCount,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error in cleanupOldRecords controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to cleanup old records',
        code: 'CLEANUP_ERROR'
      });
    }
  }
}

module.exports = new ConsentController();