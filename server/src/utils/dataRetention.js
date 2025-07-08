const { PrismaClient } = require('@prisma/client');
const consentLogger = require('./consentLogger');
const consentConfig = require('../config/consent');

const prisma = new PrismaClient();

class DataRetentionManager {
  constructor() {
    this.retentionPeriodDays = consentConfig.RETENTION_PERIOD_DAYS;
    this.batchSize = consentConfig.CLEANUP_BATCH_SIZE;
  }

  /**
   * Clean up expired consent records
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupExpiredConsents() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);

      console.log(`Starting consent cleanup for records older than ${cutoffDate.toISOString()}`);

      // Get count of records to be deleted
      const recordsToDelete = await prisma.consent.count({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      if (recordsToDelete === 0) {
        console.log('No expired consent records found');
        return {
          deletedCount: 0,
          batchesProcessed: 0,
          errors: [],
          completedAt: new Date().toISOString()
        };
      }

      console.log(`Found ${recordsToDelete} expired consent records to delete`);

      // Delete in batches to avoid overwhelming the database
      let totalDeleted = 0;
      let batchesProcessed = 0;
      const errors = [];

      while (totalDeleted < recordsToDelete) {
        try {
          const batchResult = await prisma.consent.deleteMany({
            where: {
              timestamp: {
                lt: cutoffDate
              }
            },
            take: this.batchSize
          });

          totalDeleted += batchResult.count;
          batchesProcessed++;

          console.log(`Batch ${batchesProcessed}: Deleted ${batchResult.count} records (Total: ${totalDeleted}/${recordsToDelete})`);

          // Add small delay between batches to reduce database load
          if (batchResult.count > 0) {
            await this.sleep(100);
          } else {
            break; // No more records to delete
          }

        } catch (batchError) {
          console.error(`Error in batch ${batchesProcessed + 1}:`, batchError);
          errors.push({
            batch: batchesProcessed + 1,
            error: batchError.message,
            timestamp: new Date().toISOString()
          });
          break;
        }
      }

      // Log the cleanup activity
      await consentLogger.logAuditEntry({
        action: 'consent_cleanup_completed',
        details: {
          deletedCount: totalDeleted,
          batchesProcessed,
          cutoffDate: cutoffDate.toISOString(),
          errors: errors.length
        }
      });

      const result = {
        deletedCount: totalDeleted,
        batchesProcessed,
        errors,
        completedAt: new Date().toISOString()
      };

      console.log('Consent cleanup completed:', result);
      return result;

    } catch (error) {
      console.error('Error during consent cleanup:', error);
      await consentLogger.logError('consent_cleanup_failed', error);
      throw error;
    }
  }

  /**
   * Archive old consent records instead of deleting them
   * @returns {Promise<Object>} Archive results
   */
  async archiveOldConsents() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);

      console.log(`Starting consent archival for records older than ${cutoffDate.toISOString()}`);

      // Get records to archive
      const recordsToArchive = await prisma.consent.findMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      });

      if (recordsToArchive.length === 0) {
        console.log('No consent records found for archival');
        return {
          archivedCount: 0,
          errors: [],
          completedAt: new Date().toISOString()
        };
      }

      console.log(`Found ${recordsToArchive.length} consent records to archive`);

      // Create archive entries
      const archivePromises = recordsToArchive.map(async (record) => {
        try {
          // Create archive record
          await prisma.consentArchive.create({
            data: {
              originalId: record.id,
              consent: record.consent,
              ip: record.ip,
              userAgent: record.userAgent,
              userId: record.userId,
              sessionId: record.sessionId,
              metadata: record.metadata,
              version: record.version,
              originalTimestamp: record.timestamp,
              archivedAt: new Date()
            }
          });

          // Delete original record
          await prisma.consent.delete({
            where: {
              id: record.id
            }
          });

          return { success: true, id: record.id };

        } catch (error) {
          console.error(`Error archiving record ${record.id}:`, error);
          return { success: false, id: record.id, error: error.message };
        }
      });

      // Process archives in batches
      const results = await this.processBatches(archivePromises, this.batchSize);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      // Log the archival activity
      await consentLogger.logAuditEntry({
        action: 'consent_archival_completed',
        details: {
          archivedCount: successful.length,
          failedCount: failed.length,
          cutoffDate: cutoffDate.toISOString()
        }
      });

      const result = {
        archivedCount: successful.length,
        errors: failed,
        completedAt: new Date().toISOString()
      };

      console.log('Consent archival completed:', result);
      return result;

    } catch (error) {
      console.error('Error during consent archival:', error);
      await consentLogger.logError('consent_archival_failed', error);
      throw error;
    }
  }

  /**
   * Clean up old log files
   * @returns {Promise<Object>} Log cleanup results
   */
  async cleanupOldLogs() {
    try {
      console.log('Starting log file cleanup');

      // Rotate large log files
      await consentLogger.rotateLogsIfNeeded();

      // Archive old log files
      const archivedCount = await consentLogger.archiveOldLogs(this.retentionPeriodDays);

      // Clean up test entries
      const testEntriesRemoved = await consentLogger.cleanupTestEntries();

      const result = {
        logsArchived: archivedCount,
        testEntriesRemoved,
        completedAt: new Date().toISOString()
      };

      console.log('Log cleanup completed:', result);
      return result;

    } catch (error) {
      console.error('Error during log cleanup:', error);
      await consentLogger.logError('log_cleanup_failed', error);
      throw error;
    }
  }

  /**
   * Get data retention statistics
   * @returns {Promise<Object>} Retention statistics
   */
  async getRetentionStats() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);

      const [
        totalRecords,
        expiredRecords,
        recentRecords,
        archivedRecords
      ] = await Promise.all([
        prisma.consent.count(),
        prisma.consent.count({
          where: {
            timestamp: {
              lt: cutoffDate
            }
          }
        }),
        prisma.consent.count({
          where: {
            timestamp: {
              gte: cutoffDate
            }
          }
        }),
        prisma.consentArchive ? prisma.consentArchive.count() : 0
      ]);

      const stats = {
        totalRecords,
        expiredRecords,
        recentRecords,
        archivedRecords,
        retentionPeriodDays: this.retentionPeriodDays,
        cutoffDate: cutoffDate.toISOString(),
        nextCleanupRecommended: expiredRecords > 0,
        storageEfficiency: {
          activeRecords: recentRecords,
          expiredRecords,
          archivedRecords,
          percentageExpired: totalRecords > 0 ? ((expiredRecords / totalRecords) * 100).toFixed(2) : 0
        },
        lastUpdated: new Date().toISOString()
      };

      return stats;

    } catch (error) {
      console.error('Error getting retention stats:', error);
      throw error;
    }
  }

  /**
   * Schedule automatic cleanup
   * @param {string} cronExpression - Cron expression for scheduling
   * @returns {Promise<void>}
   */
  async scheduleCleanup(cronExpression = '0 2 * * *') {
    try {
      // This would typically use a job scheduler like node-cron
      // For now, we'll just log the scheduling intention
      console.log(`Scheduling automatic cleanup with cron: ${cronExpression}`);
      
      await consentLogger.logAuditEntry({
        action: 'cleanup_scheduled',
        details: {
          cronExpression,
          retentionPeriodDays: this.retentionPeriodDays,
          scheduledAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error scheduling cleanup:', error);
      throw error;
    }
  }

  /**
   * Perform full data retention maintenance
   * @returns {Promise<Object>} Maintenance results
   */
  async performMaintenance() {
    try {
      console.log('Starting full data retention maintenance');

      const results = {
        startTime: new Date().toISOString(),
        consent: null,
        logs: null,
        stats: null,
        errors: []
      };

      // Clean up expired consents
      try {
        results.consent = await this.cleanupExpiredConsents();
      } catch (error) {
        results.errors.push({ type: 'consent_cleanup', error: error.message });
      }

      // Clean up old logs
      try {
        results.logs = await this.cleanupOldLogs();
      } catch (error) {
        results.errors.push({ type: 'log_cleanup', error: error.message });
      }

      // Get updated statistics
      try {
        results.stats = await this.getRetentionStats();
      } catch (error) {
        results.errors.push({ type: 'stats_retrieval', error: error.message });
      }

      results.endTime = new Date().toISOString();
      results.duration = new Date(results.endTime) - new Date(results.startTime);

      console.log('Data retention maintenance completed:', results);

      // Log maintenance completion
      await consentLogger.logAuditEntry({
        action: 'maintenance_completed',
        details: {
          duration: results.duration,
          consentRecordsDeleted: results.consent?.deletedCount || 0,
          logsArchived: results.logs?.logsArchived || 0,
          errors: results.errors.length
        }
      });

      return results;

    } catch (error) {
      console.error('Error during maintenance:', error);
      await consentLogger.logError('maintenance_failed', error);
      throw error;
    }
  }

  /**
   * Process promises in batches
   * @param {Array} promises - Array of promises to process
   * @param {number} batchSize - Size of each batch
   * @returns {Promise<Array>} Results from all promises
   */
  async processBatches(promises, batchSize) {
    const results = [];
    
    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
      
      // Add small delay between batches
      if (i + batchSize < promises.length) {
        await this.sleep(50);
      }
    }
    
    return results;
  }

  /**
   * Sleep utility function
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate data retention configuration
   * @returns {Promise<Object>} Validation results
   */
  async validateConfiguration() {
    try {
      const validation = {
        retentionPeriod: {
          valid: this.retentionPeriodDays > 0 && this.retentionPeriodDays <= 365,
          value: this.retentionPeriodDays,
          message: this.retentionPeriodDays > 0 && this.retentionPeriodDays <= 365 
            ? 'Valid retention period' 
            : 'Invalid retention period (must be 1-365 days)'
        },
        batchSize: {
          valid: this.batchSize > 0 && this.batchSize <= 1000,
          value: this.batchSize,
          message: this.batchSize > 0 && this.batchSize <= 1000 
            ? 'Valid batch size' 
            : 'Invalid batch size (must be 1-1000)'
        },
        database: {
          valid: true,
          message: 'Database connection active'
        }
      };

      // Test database connection
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (error) {
        validation.database.valid = false;
        validation.database.message = `Database connection failed: ${error.message}`;
      }

      const isValid = Object.values(validation).every(v => v.valid);

      return {
        valid: isValid,
        details: validation,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error validating configuration:', error);
      return {
        valid: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new DataRetentionManager();