// server/src/utils/logRotation.js
const fs = require('fs').promises;
const path = require('path');

/**
 * Rotate consent logs to prevent files from growing too large
 * This helps with GDPR compliance and log management
 */
class LogRotator {
  constructor(options = {}) {
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 10;
    this.logsDir = options.logsDir || path.resolve(__dirname, '../logs');
  }

  /**
   * Check if a log file needs rotation
   */
  async shouldRotate(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size > this.maxFileSize;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Rotate a log file
   */
  async rotateFile(filePath) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create rotated filename
    const rotatedPath = path.join(dir, `${baseName}-${timestamp}${ext}`);
    
    try {
      // Move current file to rotated name
      await fs.rename(filePath, rotatedPath);
      
      // Create new empty file
      await fs.writeFile(filePath, '', 'utf8');
      
      console.log(`Log rotated: ${filePath} -> ${rotatedPath}`);
      
      // Clean up old files
      await this.cleanupOldFiles(dir, baseName, ext);
      
      return rotatedPath;
    } catch (error) {
      console.error('Error rotating log file:', error);
      throw error;
    }
  }

  /**
   * Clean up old rotated files
   */
  async cleanupOldFiles(dir, baseName, ext) {
    try {
      const files = await fs.readdir(dir);
      const rotatedFiles = files
        .filter(file => file.startsWith(`${baseName}-`) && file.endsWith(ext))
        .map(file => ({
          name: file,
          path: path.join(dir, file)
        }));

      if (rotatedFiles.length > this.maxFiles) {
        // Sort by creation time and remove oldest files
        const fileStats = await Promise.all(
          rotatedFiles.map(async file => {
            const stats = await fs.stat(file.path);
            return {
              ...file,
              birthtime: stats.birthtime
            };
          })
        );

        fileStats.sort((a, b) => a.birthtime - b.birthtime);
        
        const filesToDelete = fileStats.slice(0, fileStats.length - this.maxFiles);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          console.log(`Deleted old log file: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old log files:', error);
    }
  }

  /**
   * Rotate consent logs if needed
   */
  async rotateConsentLogs() {
    const consentLogPath = path.join(this.logsDir, 'consent.log');
    const accessLogPath = path.join(this.logsDir, 'consented-access.log');
    
    try {
      if (await this.shouldRotate(consentLogPath)) {
        await this.rotateFile(consentLogPath);
      }
      
      if (await this.shouldRotate(accessLogPath)) {
        await this.rotateFile(accessLogPath);
      }
    } catch (error) {
      console.error('Error rotating consent logs:', error);
    }
  }

  /**
   * Schedule automatic log rotation
   */
  scheduleRotation(intervalMs = 24 * 60 * 60 * 1000) { // Daily by default
    setInterval(async () => {
      await this.rotateConsentLogs();
    }, intervalMs);
    
    console.log(`Log rotation scheduled every ${intervalMs / 1000 / 60} minutes`);
  }

  /**
   * Archive old consent logs for compliance
   */
  async archiveOldLogs(retentionDays = 365) {
    const archiveDir = path.join(this.logsDir, 'archive');
    
    try {
      await fs.mkdir(archiveDir, { recursive: true });
      
      const files = await fs.readdir(this.logsDir);
      const logFiles = files.filter(file => 
        file.includes('consent') && file.endsWith('.log') && file !== 'consent.log'
      );
      
      for (const file of logFiles) {
        const filePath = path.join(this.logsDir, file);
        const stats = await fs.stat(filePath);
        const daysSinceCreation = (Date.now() - stats.birthtime) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreation > retentionDays) {
          const archivePath = path.join(archiveDir, file);
          await fs.rename(filePath, archivePath);
          console.log(`Archived old log: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error archiving old logs:', error);
    }
  }
}

// Export singleton instance
const logRotator = new LogRotator();

module.exports = {
  LogRotator,
  logRotator
};