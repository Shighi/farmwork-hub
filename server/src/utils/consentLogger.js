const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ConsentLogger {
  constructor() {
    this.logsDir = path.resolve(__dirname, '../../logs');
    this.consentLogFile = path.join(this.logsDir, 'consent.log');
    this.auditLogFile = path.join(this.logsDir, 'consent-audit.log');
    this.errorLogFile = path.join(this.logsDir, 'consent-errors.log');
  }

  /**
   * Ensure logs directory exists
   * @returns {Promise<string>} Logs directory path
   */
  async ensureLogsDirectory() {
    try {
      await fs.access(this.logsDir);
    } catch (error) {
      await fs.mkdir(this.logsDir, { recursive: true });
    }
    return this.logsDir;
  }

  /**
   * Generate a unique session ID
   * @returns {string} UUID v4 session ID
   */
  generateSessionId() {
    return crypto.randomUUID();
  }

  /**
   * Get client IP address with proper proxy handling
   * @param {Object} req - Express request object
   * @returns {string} Client IP address
   */
  getClientIP(req) {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress ||
           'unknown';
  }

  /**
   * Log consent to file system
   * @param {Object} consentData - Consent data to log
   * @returns {Promise<void>}
   */
  async logConsent(consentData) {
    try {
      await this.ensureLogsDirectory();

      const logEntry = {
        id: consentData.id,
        timestamp: consentData.timestamp || new Date().toISOString(),
        consent: consentData.consent,
        ip: this.sanitizeIP(consentData.ip),
        userAgent: consentData.userAgent || 'unknown',
        userId: consentData.userId || null,
        sessionId: consentData.sessionId,
        metadata: consentData.metadata || {},
        version: consentData.version || '1.0',
        logType: 'consent'
      };

      // Write to main consent log
      await fs.appendFile(
        this.consentLogFile, 
        JSON.stringify(logEntry) + '\n', 
        'utf8'
      );

      // Write to audit log with additional security info
      await this.logAuditEntry({
        action: 'consent_recorded',
        consentId: consentData.id,
        consent: consentData.consent,
        userId: consentData.userId,
        ip: this.sanitizeIP(consentData.ip),
        timestamp: logEntry.timestamp
      });

    } catch (error) {
      console.error('Error logging consent:', error);
      await this.logError('consent_logging_failed', error, consentData);
      throw error;
    }
  }

  /**
   * Log audit entry
   * @param {Object} auditData - Audit data to log
   * @returns {Promise<void>}
   */
  async logAuditEntry(auditData) {
    try {
      await this.ensureLogsDirectory();

      const auditEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        action: auditData.action,
        consentId: auditData.consentId,
        userId: auditData.userId,
        ip: auditData.ip,
        details: auditData.details || {},
        checksum: this.generateChecksum(auditData)
      };

      await fs.appendFile(
        this.auditLogFile, 
        JSON.stringify(auditEntry) + '\n', 
        'utf8'
      );

    } catch (error) {
      console.error('Error logging audit entry:', error);
      await this.logError('audit_logging_failed', error, auditData);
    }
  }

  /**
   * Log error
   * @param {string} errorType - Type of error
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   * @returns {Promise<void>}
   */
  async logError(errorType, error, context = {}) {
    try {
      await this.ensureLogsDirectory();

      const errorEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        errorType,
        message: error.message,
        stack: error.stack,
        context,
        severity: this.getErrorSeverity(errorType)
      };

      await fs.appendFile(
        this.errorLogFile, 
        JSON.stringify(errorEntry) + '\n', 
        'utf8'
      );

    } catch (logError) {
      console.error('Critical error: Failed to log error to file:', logError);
    }
  }

  /**
   * Get error severity level
   * @param {string} errorType - Type of error
   * @returns {string} Severity level
   */
  getErrorSeverity(errorType) {
    const severityMap = {
      'consent_logging_failed': 'critical',
      'audit_logging_failed': 'high',
      'file_access_error': 'medium',
      'validation_error': 'low'
    };
    return severityMap[errorType] || 'medium';
  }

  /**
   * Generate checksum for audit trail integrity
   * @param {Object} data - Data to generate checksum for
   * @returns {string} SHA-256 checksum
   */
  generateChecksum(data) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
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
   * Read consent logs
   * @param {Object} options - Options for reading logs
   * @returns {Promise<Array>} Array of log entries
   */
  async readConsentLogs(options = {}) {
    try {
      const { limit = 100, offset = 0, consent = null } = options;
      
      const logData = await fs.readFile(this.consentLogFile, 'utf8');
      const lines = logData.trim().split('\n').filter(line => line.trim());
      
      const entries = [];
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (!consent || entry.consent === consent) {
            entries.push(entry);
          }
        } catch (parseError) {
          console.warn('Invalid log entry found:', line);
        }
      }
      
      // Sort by timestamp (newest first)
      entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Apply pagination
      return entries.slice(offset, offset + limit);
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get log file statistics
   * @returns {Promise<Object>} Log file statistics
   */
  async getLogStats() {
    try {
      const [consentStats, auditStats, errorStats] = await Promise.all([
        this.getFileStats(this.consentLogFile),
        this.getFileStats(this.auditLogFile),
        this.getFileStats(this.errorLogFile)
      ]);

      return {
        consent: consentStats,
        audit: auditStats,
        errors: errorStats,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error getting log stats:', error);
      return {
        consent: { size: 0, lines: 0, exists: false },
        audit: { size: 0, lines: 0, exists: false },
        errors: { size: 0, lines: 0, exists: false },
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Get individual file statistics
   * @param {string} filePath - Path to log file
   * @returns {Promise<Object>} File statistics
   */
  async getFileStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const data = await fs.readFile(filePath, 'utf8');
      const lines = data.trim().split('\n').filter(line => line.trim()).length;

      return {
        size: stats.size,
        lines,
        exists: true,
        lastModified: stats.mtime.toISOString(),
        created: stats.birthtime.toISOString()
      };

    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          size: 0,
          lines: 0,
          exists: false,
          lastModified: null,
          created: null
        };
      }
      throw error;
    }
  }

  /**
   * Rotate log files when they get too large
   * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
   * @returns {Promise<void>}
   */
  async rotateLogsIfNeeded(maxSize = 10 * 1024 * 1024) {
    try {
      const files = [this.consentLogFile, this.auditLogFile, this.errorLogFile];
      
      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          if (stats.size > maxSize) {
            await this.rotateLogFile(file);
          }
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(`Error checking file size for ${file}:`, error);
          }
        }
      }

    } catch (error) {
      console.error('Error rotating logs:', error);
      await this.logError('log_rotation_failed', error);
    }
  }

  /**
   * Rotate a specific log file
   * @param {string} filePath - Path to log file
   * @returns {Promise<void>}
   */
  async rotateLogFile(filePath) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedPath = `${filePath}.${timestamp}`;
      
      await fs.rename(filePath, rotatedPath);
      
      // Create new empty log file
      await fs.writeFile(filePath, '', 'utf8');
      
      console.log(`Log file rotated: ${filePath} -> ${rotatedPath}`);
      
      await this.logAuditEntry({
        action: 'log_rotated',
        details: {
          originalFile: filePath,
          rotatedFile: rotatedPath,
          timestamp
        }
      });

    } catch (error) {
      console.error('Error rotating log file:', error);
      throw error;
    }
  }

  /**
   * Archive old log files
   * @param {number} daysToKeep - Number of days to keep log files
   * @returns {Promise<number>} Number of files archived
   */
  async archiveOldLogs(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const files = await fs.readdir(this.logsDir);
      const logFiles = files.filter(file => 
        file.endsWith('.log') && 
        file.includes('-') && 
        file !== 'consent.log' && 
        file !== 'consent-audit.log' && 
        file !== 'consent-errors.log'
      );
      
      let archivedCount = 0;
      
      for (const file of logFiles) {
        const filePath = path.join(this.logsDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          const archivePath = path.join(this.logsDir, 'archived', file);
          await fs.mkdir(path.dirname(archivePath), { recursive: true });
          await fs.rename(filePath, archivePath);
          archivedCount++;
        }
      }
      
      if (archivedCount > 0) {
        await this.logAuditEntry({
          action: 'logs_archived',
          details: {
            filesArchived: archivedCount,
            cutoffDate: cutoffDate.toISOString()
          }
        });
      }
      
      return archivedCount;

    } catch (error) {
      console.error('Error archiving old logs:', error);
      await this.logError('log_archiving_failed', error);
      return 0;
    }
  }

  /**
   * Validate log file integrity
   * @param {string} filePath - Path to log file
   * @returns {Promise<Object>} Validation results
   */
  async validateLogIntegrity(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const lines = data.trim().split('\n').filter(line => line.trim());
      
      const results = {
        totalLines: lines.length,
        validLines: 0,
        invalidLines: 0,
        errors: []
      };
      
      for (let i = 0; i < lines.length; i++) {
        try {
          const entry = JSON.parse(lines[i]);
          
          // Basic validation
          if (!entry.id || !entry.timestamp) {
            results.errors.push({
              line: i + 1,
              error: 'Missing required fields (id, timestamp)'
            });
            results.invalidLines++;
          } else {
            results.validLines++;
          }
          
        } catch (parseError) {
          results.errors.push({
            line: i + 1,
            error: 'Invalid JSON format'
          });
          results.invalidLines++;
        }
      }
      
      return results;

    } catch (error) {
      console.error('Error validating log integrity:', error);
      return {
        totalLines: 0,
        validLines: 0,
        invalidLines: 0,
        errors: [{ error: error.message }]
      };
    }
  }

  /**
   * Clean up test entries from logs
   * @returns {Promise<number>} Number of test entries removed
   */
  async cleanupTestEntries() {
    try {
      const data = await fs.readFile(this.consentLogFile, 'utf8');
      const lines = data.trim().split('\n').filter(line => line.trim());
      
      const cleanedLines = [];
      let removedCount = 0;
      
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          
          // Remove test entries
          if (entry.metadata?.test || 
              entry.userAgent === 'health-check' ||
              entry.sessionId?.includes('health-check')) {
            removedCount++;
          } else {
            cleanedLines.push(line);
          }
          
        } catch (parseError) {
          // Keep invalid entries for manual review
          cleanedLines.push(line);
        }
      }
      
      if (removedCount > 0) {
        await fs.writeFile(this.consentLogFile, cleanedLines.join('\n') + '\n', 'utf8');
        
        await this.logAuditEntry({
          action: 'test_entries_cleaned',
          details: {
            removedCount,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      return removedCount;

    } catch (error) {
      console.error('Error cleaning up test entries:', error);
      await this.logError('test_cleanup_failed', error);
      return 0;
    }
  }
}

// Export utility functions
const consentLogger = new ConsentLogger();

module.exports = consentLogger;
module.exports.generateSessionId = () => consentLogger.generateSessionId();
module.exports.getClientIP = (req) => consentLogger.getClientIP(req);