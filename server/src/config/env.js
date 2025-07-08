// Environment configuration module for FarmWork Hub
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Environment configuration object
const config = {
  // Application
  app: {
    name: process.env.APP_NAME || 'FarmWork Hub',
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
    // Parse DATABASE_URL for individual components if needed
    ...(process.env.DATABASE_URL && {
      host: process.env.DATABASE_URL.split('@')[1]?.split(':')[0] || 'localhost',
      port: parseInt(process.env.DATABASE_URL.split(':')[3]?.split('/')[0]) || 5432,
      name: process.env.DATABASE_URL.split('/').pop()?.split('?')[0] || 'farmwork_hub',
      schema: 'public'
    })
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    algorithm: 'HS256',
    issuer: 'farmwork-hub'
  },

  // Security
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
    sessionMaxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 86400000, // 24 hours
    corsOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://localhost:3001'],
    trustProxy: process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10,
    consentMaxRequests: parseInt(process.env.CONSENT_RATE_LIMIT_MAX_REQUESTS) || 50
  },

  // Email Configuration
  email: {
    from: process.env.EMAIL_FROM || 'noreply@farmworkhub.com',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    enabled: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
  },

  // File Upload (Cloudinary)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    enabled: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'farmwork_hub',
    folder: process.env.CLOUDINARY_FOLDER || 'farmwork-hub',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx']
  },

  // Payment (Flutterwave)
  flutterwave: {
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
    enabled: !!(process.env.FLUTTERWAVE_PUBLIC_KEY && process.env.FLUTTERWAVE_SECRET_KEY),
    webhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH,
    baseUrl: process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3'
  },

  // Admin Configuration
  admin: {
    apiKey: process.env.ADMIN_API_KEY || 'fallback-admin-key',
    email: process.env.ADMIN_EMAIL || 'admin@farmworkhub.com'
  },

  // Consent and Privacy
  consent: {
    logRetentionDays: parseInt(process.env.CONSENT_LOG_RETENTION_DAYS) || 365,
    privacyPolicyUrl: process.env.PRIVACY_POLICY_URL || 'https://farmworkhub.com/privacy',
    termsOfServiceUrl: process.env.TERMS_OF_SERVICE_URL || 'https://farmworkhub.com/terms'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    fileMaxSize: process.env.LOG_FILE_MAX_SIZE || '10m',
    fileMaxFiles: parseInt(process.env.LOG_FILE_MAX_FILES) || 5,
    enableConsole: process.env.NODE_ENV !== 'production',
    enableFile: process.env.NODE_ENV === 'production'
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    enableSentry: !!process.env.SENTRY_DSN,
    enableAnalytics: !!process.env.GOOGLE_ANALYTICS_ID
  },

  // Development
  development: {
    debug: process.env.DEBUG || 'farmwork:*',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableCors: process.env.NODE_ENV !== 'production',
    enableMorganLogging: true,
    reloadOnChange: process.env.NODE_ENV === 'development'
  },

  // Feature Flags
  features: {
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    enableFileUploads: process.env.ENABLE_FILE_UPLOADS !== 'false',
    enablePayments: process.env.ENABLE_PAYMENTS === 'true',
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true'
  }
};

// Validation functions
const validateConfig = () => {
  const errors = [];

  // Validate JWT secrets
  if (config.jwt.secret === 'your-super-secret-jwt-key-here') {
    errors.push('JWT_SECRET should be changed from default value');
  }

  if (config.jwt.refreshSecret === 'your-refresh-token-secret-here') {
    errors.push('JWT_REFRESH_SECRET should be changed from default value');
  }

  // Validate database URL
  if (!config.database.url.startsWith('postgresql://')) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validate email configuration if enabled
  if (config.features.enableEmailNotifications && !config.email.enabled) {
    console.warn('⚠️  Email notifications are enabled but email configuration is incomplete');
  }

  // Validate file upload configuration if enabled
  if (config.features.enableFileUploads && !config.cloudinary.enabled) {
    console.warn('⚠️  File uploads are enabled but Cloudinary configuration is incomplete');
  }

  // Validate payment configuration if enabled
  if (config.features.enablePayments && !config.flutterwave.enabled) {
    console.warn('⚠️  Payments are enabled but Flutterwave configuration is incomplete');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    if (config.app.isProduction) {
      process.exit(1);
    }
  }

  return errors.length === 0;
};

// Log configuration status
const logConfigStatus = () => {
  console.log('📋 Configuration Status:');
  console.log(`   Environment: ${config.app.env}`);
  console.log(`   Port: ${config.app.port}`);
  console.log(`   Database: ${config.database.url ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`   JWT: ${config.jwt.secret ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   Email: ${config.email.enabled ? '✅ Enabled' : '⚠️  Disabled'}`);
  console.log(`   File Upload: ${config.cloudinary.enabled ? '✅ Enabled' : '⚠️  Disabled'}`);
  console.log(`   Payments: ${config.flutterwave.enabled ? '✅ Enabled' : '⚠️  Disabled'}`);
  console.log(`   Rate Limiting: ${config.features.enableRateLimiting ? '✅ Enabled' : '⚠️  Disabled'}`);
};

// Initialize configuration
const initConfig = () => {
  if (config.app.isDevelopment) {
    logConfigStatus();
  }
  
  validateConfig();
  
  return config;
};

// Export configuration
module.exports = initConfig();

// Export individual sections for convenience
module.exports.app = config.app;
module.exports.database = config.database;
module.exports.jwt = config.jwt;
module.exports.security = config.security;
module.exports.rateLimit = config.rateLimit;
module.exports.email = config.email;
module.exports.cloudinary = config.cloudinary;
module.exports.flutterwave = config.flutterwave;
module.exports.admin = config.admin;
module.exports.consent = config.consent;
module.exports.logging = config.logging;
module.exports.monitoring = config.monitoring;
module.exports.development = config.development;
module.exports.features = config.features;