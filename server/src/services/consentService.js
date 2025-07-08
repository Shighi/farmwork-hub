const { PrismaClient } = require('@prisma/client');
const consentLogger = require('../utils/consentLogger');
const consentConfig = require('../config/consent');

const prisma = new PrismaClient();

class ConsentService {
  /**
   * Record user consent
   * @param {Object} consentData - Consent data object
   * @returns {Promise<Object>} Created consent record
   */
  async recordConsent(consentData) {
    try {
      const {
        consent,
        ip,
        userAgent,
        metadata = {},
        userId = null,
        sessionId
      } = consentData;

      // Validate consent value
      if (!['accepted', 'declined'].includes(consent)) {
        throw new Error('Invalid consent value. Must be "accepted" or "declined"');
      }

      // Create consent record in database
      const consentRecord = await prisma.consent.create({
        data: {
          consent,
          ip: this.sanitizeIP(ip),
          userAgent: userAgent || 'unknown',
          metadata: metadata || {},
          userId,
          sessionId,
          timestamp: new Date(),
          version: consentConfig.CURRENT_VERSION
        }
      });

      // Log to file system for audit trail
      await consentLogger.logConsent({
        id: consentRecord.id,
        consent,
        ip: this.sanitizeIP(ip),
        userAgent,
        metadata,
        userId,
        sessionId,
        timestamp: consentRecord.timestamp,
        version: consentConfig.CURRENT_VERSION
      });

      return consentRecord;
    } catch (error) {
      console.error('Error recording consent:', error);
      throw new Error('Failed to record consent');
    }
  }

  /**
   * Get consent statistics
   * @param {Object} filters - Optional filters for statistics
   * @returns {Promise<Object>} Consent statistics
   */
  async getConsentStats(filters = {}) {
    try {
      const { startDate, endDate, consent } = filters;

      const whereClause = {};
      
      if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate) whereClause.timestamp.gte = new Date(startDate);
        if (endDate) whereClause.timestamp.lte = new Date(endDate);
      }
      
      if (consent) {
        whereClause.consent = consent;
      }

      const [total, accepted, declined, byDate] = await Promise.all([
        // Total count
        prisma.consent.count({ where: whereClause }),
        
        // Accepted count
        prisma.consent.count({ 
          where: { ...whereClause, consent: 'accepted' } 
        }),
        
        // Declined count
        prisma.consent.count({ 
          where: { ...whereClause, consent: 'declined' } 
        }),
        
        // By date aggregation
        prisma.consent.groupBy({
          by: ['consent'],
          where: whereClause,
          _count: {
            consent: true
          }
        })
      ]);

      // Get daily statistics
      const dailyStats = await this.getDailyConsentStats(whereClause);

      return {
        total,
        accepted,
        declined,
        acceptanceRate: total > 0 ? ((accepted / total) * 100).toFixed(2) : 0,
        byDate: dailyStats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting consent statistics:', error);
      throw new Error('Failed to retrieve consent statistics');
    }
  }

  /**
   * Get daily consent statistics
   * @param {Object} whereClause - Prisma where clause
   * @returns {Promise<Object>} Daily statistics
   */
  async getDailyConsentStats(whereClause = {}) {
    try {
      const records = await prisma.consent.findMany({
        where: whereClause,
        select: {
          consent: true,
          timestamp: true
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      const dailyStats = {};
      
      records.forEach(record => {
        const date = record.timestamp.toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = { accepted: 0, declined: 0 };
        }
        dailyStats[date][record.consent]++;
      });

      return dailyStats;
    } catch (error) {
      console.error('Error getting daily consent stats:', error);
      return {};
    }
  }

  /**
   * Get user's consent history
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's consent records
   */
  async getUserConsentHistory(userId) {
    try {
      const records = await prisma.consent.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          timestamp: 'desc'
        },
        select: {
          id: true,
          consent: true,
          timestamp: true,
          version: true,
          sessionId: true
        }
      });

      return records;
    } catch (error) {
      console.error('Error getting user consent history:', error);
      throw new Error('Failed to retrieve user consent history');
    }
  }

  /**
   * Get latest consent for user
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Latest consent record
   */
  async getLatestUserConsent(userId) {
    try {
      const latestConsent = await prisma.consent.findFirst({
        where: {
          userId: userId
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return latestConsent;
    } catch (error) {
      console.error('Error getting latest user consent:', error);
      return null;
    }
  }

  /**
   * Check if user has valid consent
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Whether user has valid consent
   */
  async hasValidConsent(userId) {
    try {
      const latestConsent = await this.getLatestUserConsent(userId);
      
      if (!latestConsent) {
        return false;
      }

      // Check if consent is still valid based on retention period
      const consentAge = Date.now() - latestConsent.timestamp.getTime();
      const maxAge = consentConfig.RETENTION_PERIOD_DAYS * 24 * 60 * 60 * 1000;
      
      return latestConsent.consent === 'accepted' && consentAge < maxAge;
    } catch (error) {
      console.error('Error checking valid consent:', error);
      return false;
    }
  }

  /**
   * Withdraw consent for user
   * @param {string} userId - User ID
   * @param {Object} requestData - Request metadata
   * @returns {Promise<Object>} Withdrawal record
   */
  async withdrawConsent(userId, requestData = {}) {
    try {
      const withdrawalRecord = await this.recordConsent({
        ...requestData,
        consent: 'declined',
        userId,
        metadata: {
          ...requestData.metadata,
          withdrawalReason: 'user_requested',
          previousConsent: 'accepted'
        }
      });

      return withdrawalRecord;
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      throw new Error('Failed to withdraw consent');
    }
  }

  /**
   * Clean up old consent records based on retention policy
   * @returns {Promise<number>} Number of records cleaned up
   */
  async cleanupOldRecords() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - consentConfig.RETENTION_PERIOD_DAYS);

      const result = await prisma.consent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Cleaned up ${result.count} old consent records`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old consent records:', error);
      throw new Error('Failed to cleanup old consent records');
    }
  }

  /**
   * Sanitize IP address
   * @param {string} ip - IP address
   * @returns {string} Sanitized IP
   */
  sanitizeIP(ip) {
    if (!ip) return 'unknown';
    
    // Remove IPv4-mapped IPv6 prefix
    const cleanIP = ip.replace(/^::ffff:/, '');
    
    // Basic IP validation
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (ipv4Regex.test(cleanIP) || ipv6Regex.test(cleanIP)) {
      return cleanIP;
    }
    
    return 'unknown';
  }

  /**
   * Export consent data for user (GDPR compliance)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's consent data
   */
  async exportUserConsentData(userId) {
    try {
      const records = await prisma.consent.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return {
        userId,
        exportDate: new Date().toISOString(),
        consentRecords: records.map(record => ({
          id: record.id,
          consent: record.consent,
          timestamp: record.timestamp,
          version: record.version,
          sessionId: record.sessionId,
          metadata: record.metadata
        }))
      };
    } catch (error) {
      console.error('Error exporting user consent data:', error);
      throw new Error('Failed to export user consent data');
    }
  }
}

module.exports = new ConsentService();