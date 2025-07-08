const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// ===========================================
// CONSENT VALIDATION CONSTANTS
// ===========================================

// Valid consent types
const CONSENT_TYPES = [
  'GENERAL', 'MARKETING', 'ANALYTICS', 'COOKIES', 'LOCATION', 
  'PROFILE_DATA', 'JOB_MATCHING', 'COMMUNICATION', 'PAYMENT', 'THIRD_PARTY'
];

// Valid consent statuses
const CONSENT_STATUSES = [
  'PENDING', 'ACCEPTED', 'DECLINED', 'REVOKED', 'EXPIRED', 'WITHDRAWN'
];

// Valid consent purposes
const CONSENT_PURPOSES = [
  'Data Processing', 'Marketing Communications', 'Website Analytics',
  'Cookie Usage', 'Location Services', 'Profile Management',
  'Job Matching', 'User Communication', 'Payment Processing',
  'Third-party Integration', 'Service Improvement', 'Legal Compliance'
];

// ===========================================
// CORE VALIDATION HELPER
// ===========================================

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    return next(new AppError(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`, 400));
  }
  next();
};

// ===========================================
// CONSENT VALIDATION FUNCTIONS
// ===========================================

/**
 * Validate consent type
 * @param {string} consentType - Consent type to validate
 * @returns {Object} Validation result
 */
const validateConsentType = (consentType) => {
  const result = { isValid: true, messages: [] };
  
  if (!consentType) {
    result.isValid = false;
    result.messages.push('Consent type is required');
    return result;
  }
  
  if (!CONSENT_TYPES.includes(consentType)) {
    result.isValid = false;
    result.messages.push(`Invalid consent type. Must be one of: ${CONSENT_TYPES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate consent status
 * @param {string} status - Consent status to validate
 * @returns {Object} Validation result
 */
const validateConsentStatus = (status) => {
  const result = { isValid: true, messages: [] };
  
  if (!status) {
    result.isValid = false;
    result.messages.push('Consent status is required');
    return result;
  }
  
  if (!CONSENT_STATUSES.includes(status)) {
    result.isValid = false;
    result.messages.push(`Invalid consent status. Must be one of: ${CONSENT_STATUSES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate consent purpose
 * @param {string} purpose - Consent purpose to validate
 * @returns {Object} Validation result
 */
const validateConsentPurpose = (purpose) => {
  const result = { isValid: true, messages: [] };
  
  if (!purpose) {
    result.isValid = false;
    result.messages.push('Consent purpose is required');
    return result;
  }
  
  if (typeof purpose !== 'string') {
    result.isValid = false;
    result.messages.push('Consent purpose must be a string');
    return result;
  }
  
  if (purpose.trim().length < 3) {
    result.isValid = false;
    result.messages.push('Consent purpose must be at least 3 characters long');
  }
  
  if (purpose.trim().length > 200) {
    result.isValid = false;
    result.messages.push('Consent purpose must be less than 200 characters long');
  }
  
  return result;
};

/**
 * Validate consent text
 * @param {string} consentText - Consent text to validate
 * @returns {Object} Validation result
 */
const validateConsentText = (consentText) => {
  const result = { isValid: true, messages: [] };
  
  if (!consentText) {
    result.isValid = false;
    result.messages.push('Consent text is required');
    return result;
  }
  
  if (typeof consentText !== 'string') {
    result.isValid = false;
    result.messages.push('Consent text must be a string');
    return result;
  }
  
  if (consentText.trim().length < 10) {
    result.isValid = false;
    result.messages.push('Consent text must be at least 10 characters long');
  }
  
  if (consentText.trim().length > 5000) {
    result.isValid = false;
    result.messages.push('Consent text must be less than 5000 characters long');
  }
  
  return result;
};

/**
 * Validate session ID
 * @param {string} sessionId - Session ID to validate
 * @returns {Object} Validation result
 */
const validateSessionId = (sessionId) => {
  const result = { isValid: true, messages: [] };
  
  if (!sessionId) {
    result.isValid = false;
    result.messages.push('Session ID is required');
    return result;
  }
  
  if (typeof sessionId !== 'string') {
    result.isValid = false;
    result.messages.push('Session ID must be a string');
    return result;
  }
  
  // Check for UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    result.isValid = false;
    result.messages.push('Session ID must be a valid UUID');
  }
  
  return result;
};

/**
 * Validate IP address
 * @param {string} ipAddress - IP address to validate
 * @returns {Object} Validation result
 */
const validateIpAddress = (ipAddress) => {
  const result = { isValid: true, messages: [] };
  
  if (!ipAddress) {
    return result; // IP address is optional
  }
  
  if (typeof ipAddress !== 'string') {
    result.isValid = false;
    result.messages.push('IP address must be a string');
    return result;
  }
  
  // Basic IP validation (IPv4 and IPv6)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipv4Regex.test(ipAddress) && !ipv6Regex.test(ipAddress)) {
    result.isValid = false;
    result.messages.push('Invalid IP address format');
  }
  
  return result;
};

/**
 * Validate user agent
 * @param {string} userAgent - User agent to validate
 * @returns {Object} Validation result
 */
const validateUserAgent = (userAgent) => {
  const result = { isValid: true, messages: [] };
  
  if (!userAgent) {
    return result; // User agent is optional
  }
  
  if (typeof userAgent !== 'string') {
    result.isValid = false;
    result.messages.push('User agent must be a string');
    return result;
  }
  
  if (userAgent.length > 1000) {
    result.isValid = false;
    result.messages.push('User agent is too long (max 1000 characters)');
  }
  
  return result;
};

/**
 * Validate consent version
 * @param {string} version - Consent version to validate
 * @returns {Object} Validation result
 */
const validateConsentVersion = (version) => {
  const result = { isValid: true, messages: [] };
  
  if (!version) {
    result.isValid = false;
    result.messages.push('Consent version is required');
    return result;
  }
  
  if (typeof version !== 'string') {
    result.isValid = false;
    result.messages.push('Consent version must be a string');
    return result;
  }
  
  // Basic version format validation (e.g., "1.0", "2.1.3")
  const versionRegex = /^\d+\.\d+(\.\d+)?$/;
  if (!versionRegex.test(version)) {
    result.isValid = false;
    result.messages.push('Consent version must be in format X.Y or X.Y.Z');
  }
  
  return result;
};

/**
 * Validate language code
 * @param {string} language - Language code to validate
 * @returns {Object} Validation result
 */
const validateLanguage = (language) => {
  const result = { isValid: true, messages: [] };
  
  if (!language) {
    return result; // Language is optional
  }
  
  if (typeof language !== 'string') {
    result.isValid = false;
    result.messages.push('Language must be a string');
    return result;
  }
  
  // Basic language code validation (ISO 639-1)
  const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
  if (!languageRegex.test(language)) {
    result.isValid = false;
    result.messages.push('Language must be a valid ISO 639-1 code (e.g., "en", "en-US")');
  }
  
  return result;
};

/**
 * Validate consent metadata
 * @param {Object} metadata - Metadata object to validate
 * @returns {Object} Validation result
 */
const validateConsentMetadata = (metadata) => {
  const result = { isValid: true, messages: [] };
  
  if (!metadata) {
    return result; // Metadata is optional
  }
  
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    result.isValid = false;
    result.messages.push('Metadata must be an object');
    return result;
  }
  
  // Check if metadata can be serialized to JSON
  try {
    JSON.stringify(metadata);
  } catch (error) {
    result.isValid = false;
    result.messages.push('Metadata must be JSON serializable');
  }
  
  return result;
};

/**
 * Validate complete consent record
 * @param {Object} consentData - Consent data to validate
 * @returns {Object} Validation result
 */
const validateConsentRecord = (consentData) => {
  const result = { isValid: true, messages: [] };
  
  const {
    consentType, purpose, status, sessionId, consentText,
    version, userId, ipAddress, userAgent, language, metadata
  } = consentData;
  
  // Validate required fields
  const consentTypeValidation = validateConsentType(consentType);
  const purposeValidation = validateConsentPurpose(purpose);
  const statusValidation = validateConsentStatus(status);
  const sessionIdValidation = validateSessionId(sessionId);
  const consentTextValidation = validateConsentText(consentText);
  const versionValidation = validateConsentVersion(version);
  
  // Collect all validation results
  const validations = [
    consentTypeValidation,
    purposeValidation,
    statusValidation,
    sessionIdValidation,
    consentTextValidation,
    versionValidation
  ];
  
  // Check if any validation failed
  validations.forEach(validation => {
    if (!validation.isValid) {
      result.isValid = false;
      result.messages.push(...validation.messages);
    }
  });
  
  // Validate optional fields if present
  if (userId) {
    if (typeof userId !== 'string' || userId.trim().length === 0) {
      result.isValid = false;
      result.messages.push('User ID must be a non-empty string');
    }
  }
  
  if (ipAddress) {
    const ipValidation = validateIpAddress(ipAddress);
    if (!ipValidation.isValid) {
      result.isValid = false;
      result.messages.push(...ipValidation.messages);
    }
  }
  
  if (userAgent) {
    const userAgentValidation = validateUserAgent(userAgent);
    if (!userAgentValidation.isValid) {
      result.isValid = false;
      result.messages.push(...userAgentValidation.messages);
    }
  }
  
  if (language) {
    const languageValidation = validateLanguage(language);
    if (!languageValidation.isValid) {
      result.isValid = false;
      result.messages.push(...languageValidation.messages);
    }
  }
  
  if (metadata) {
    const metadataValidation = validateConsentMetadata(metadata);
    if (!metadataValidation.isValid) {
      result.isValid = false;
      result.messages.push(...metadataValidation.messages);
    }
  }
  
  return result;
};

/**
 * Validate consent update data
 * @param {Object} updateData - Consent update data to validate
 * @returns {Object} Validation result
 */
const validateConsentUpdate = (updateData) => {
  const result = { isValid: true, messages: [] };
  
  const { status, metadata } = updateData;
  
  // Status is required for updates
  if (!status) {
    result.isValid = false;
    result.messages.push('Status is required for consent updates');
    return result;
  }
  
  const statusValidation = validateConsentStatus(status);
  if (!statusValidation.isValid) {
    result.isValid = false;
    result.messages.push(...statusValidation.messages);
  }
  
  // Validate metadata if present
  if (metadata) {
    const metadataValidation = validateConsentMetadata(metadata);
    if (!metadataValidation.isValid) {
      result.isValid = false;
      result.messages.push(...metadataValidation.messages);
    }
  }
  
  return result;
};

// ===========================================
// EXPRESS-VALIDATOR BASED CONSENT VALIDATIONS
// ===========================================

// Consent creation validation
const validateConsentCreation = [
  body('consentType')
    .isIn(CONSENT_TYPES)
    .withMessage(`Consent type must be one of: ${CONSENT_TYPES.join(', ')}`),
  body('purpose')
    .isLength({ min: 3, max: 200 })
    .withMessage('Consent purpose must be between 3 and 200 characters'),
  body('status')
    .isIn(CONSENT_STATUSES)
    .withMessage(`Status must be one of: ${CONSENT_STATUSES.join(', ')}`),
  body('sessionId')
    .isUUID()
    .withMessage('Session ID must be a valid UUID'),
  body('consentText')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Consent text must be between 10 and 5000 characters'),
  body('version')
    .matches(/^\d+\.\d+(\.\d+)?$/)
    .withMessage('Version must be in format X.Y or X.Y.Z'),
  body('userId')
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('User ID must be a non-empty string'),
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('Invalid IP address format'),
  body('userAgent')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('User agent must be less than 1000 characters'),
  body('language')
    .optional()
    .matches(/^[a-z]{2}(-[A-Z]{2})?$/)
    .withMessage('Language must be a valid ISO 639-1 code'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  handleValidationErrors
];

// Consent update validation
const validateConsentUpdateEndpoint = [
  body('status')
    .isIn(CONSENT_STATUSES)
    .withMessage(`Status must be one of: ${CONSENT_STATUSES.join(', ')}`),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  handleValidationErrors
];

// ===========================================
// EXISTING USER & JOB VALIDATIONS
// ===========================================

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('location')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('userType')
    .isIn(['worker', 'employer'])
    .withMessage('User type must be either worker or employer'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

// New password validation
const validateNewPassword = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  handleValidationErrors
];

// Password update validation - THIS WAS MISSING!
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

// Job creation validation
const validateJobCreation = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Job description must be between 50 and 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Job category is required'),
  body('location')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('salary')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('salaryType')
    .isIn(['daily', 'weekly', 'monthly', 'fixed', 'seasonal', 'piece_rate'])
    .withMessage('Invalid salary type'),
  body('jobType')
    .isIn(['temporary', 'seasonal', 'permanent', 'partTime', 'contract', 'internship', 'volunteer'])
    .withMessage('Invalid job type'),
  body('workersNeeded')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Number of workers needed must be between 1 and 1000'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('requirements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Requirements must be less than 1000 characters'),
  handleValidationErrors
];

// Job update validation
const validateJobUpdate = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Job description must be between 50 and 2000 characters'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Job category cannot be empty'),
  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('salaryType')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'fixed', 'seasonal', 'piece_rate'])
    .withMessage('Invalid salary type'),
  body('jobType')
    .optional()
    .isIn(['temporary', 'seasonal', 'permanent', 'partTime', 'contract', 'internship', 'volunteer'])
    .withMessage('Invalid job type'),
  body('workersNeeded')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Number of workers needed must be between 1 and 1000'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('requirements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Requirements must be less than 1000 characters'),
  handleValidationErrors
];

// Job application validation
const validateJobApplication = [
  body('coverLetter')
    .optional()
    .isLength({ max: 1500 })
    .withMessage('Cover letter must be less than 1500 characters'),
  body('proposedSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Proposed salary must be a positive number'),
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  handleValidationErrors
];

// User rating validation
const validateUserRating = [
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review must be less than 500 characters'),
  handleValidationErrors
];

// Application status update validation
const validateApplicationStatusUpdate = [
  body('status')
    .isIn(['pending', 'accepted', 'rejected', 'withdrawn', 'shortlisted', 'interview_scheduled'])
    .withMessage('Invalid application status'),
  handleValidationErrors
];

// Query parameter validation for job filtering
const validateJobQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  query('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  query('jobType')
    .optional()
    .isIn(['temporary', 'seasonal', 'permanent', 'partTime', 'contract', 'internship', 'volunteer'])
    .withMessage('Invalid job type'),
  query('minSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  query('maxSalary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'salary', 'title', 'startDate'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

// UUID parameter validation
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Job ID parameter validation
const validateJobId = [
  param('jobId')
    .isUUID()
    .withMessage('Invalid job ID format'),
  handleValidationErrors
];

// User ID parameter validation
const validateUserId = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID format'),
  handleValidationErrors
];

// Application ID parameter validation
const validateApplicationId = [
  param('applicationId')
    .isUUID()
    .withMessage('Invalid application ID format'),
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return next(new AppError('File size too large. Maximum size is 5MB', 400));
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed', 400));
  }

  next();
};

// Document upload validation
const validateDocumentUpload = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const maxSize = 10 * 1024 * 1024; // 10MB for documents
  if (req.file.size > maxSize) {
    return next(new AppError('File size too large. Maximum size is 10MB', 400));
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid file type. Only PDF, DOC, and DOCX are allowed', 400));
  }

  next();
};

// Admin validation
const validateAdminAction = [
  body('action')
    .isIn(['approve', 'reject', 'suspend', 'activate', 'boost', 'feature'])
    .withMessage('Invalid admin action'),
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  handleValidationErrors
];

// Bulk operations validation
const validateBulkJobIds = [
  body('jobIds')
    .isArray({ min: 1, max: 100 })
    .withMessage('Job IDs must be an array with 1-100 items'),
  body('jobIds.*')
    .isUUID()
    .withMessage('Each job ID must be a valid UUID'),
  handleValidationErrors
];



// Search validation
const validateSearch = [
  query('q')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  query('experienceLevel')
    .optional()
    .isIn(['entry', 'junior', 'mid', 'senior', 'expert'])
    .withMessage('Invalid experience level'),
  handleValidationErrors
];

// Notification validation
const validateNotificationSettings = [
  body('jobAlerts')
    .optional()
    .isBoolean()
    .withMessage('Job alerts must be a boolean'),
  body('applicationUpdates')
    .optional()
    .isBoolean()
    .withMessage('Application updates must be a boolean'),
  body('marketingEmails')
    .optional()
    .isBoolean()
    .withMessage('Marketing emails must be a boolean'),
  handleValidationErrors
];

// Contact form validation
const validateContactForm = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  handleValidationErrors
];

// Report validation
const validateReport = [
  body('type')
    .isIn(['inappropriate_content', 'spam', 'fake_job', 'fraud', 'harassment', 'other'])
    .withMessage('Invalid report type'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Report description must be between 10 and 1000 characters'),
  handleValidationErrors
];

// ===========================================
// EXPORTS
// ===========================================

module.exports = {
  // Core validation helper
  handleValidationErrors,
  
  // Consent validation constants
  CONSENT_TYPES,
  CONSENT_STATUSES,
  CONSENT_PURPOSES,
  
  // Consent validation functions
  validateConsentType,
  validateConsentStatus,
  validateConsentPurpose,
  validateConsentText,
  validateSessionId,
  validateIpAddress,
  validateUserAgent,
  validateConsentVersion,
  validateLanguage,
  validateConsentMetadata,
  validateConsentRecord,
  validateConsentUpdate,
  
  // Express-validator based consent validations
  validateConsentCreation,
  validateConsentUpdateEndpoint,
  
  // User validation
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validateNewPassword,
  validatePasswordUpdate,
  validateProfileUpdate,
  validateUserRating,
  
  // Job validation
  validateJobCreation,
  validateJobUpdate,
  validateJobApplication,
  validateApplicationStatusUpdate,
  
  // Query and parameter validation
  validateJobQuery,
  validateUUID,
  validateJobId,
  validateUserId,
  validateApplicationId,
  validateSearch,
  
  // File upload validation
  validateFileUpload,
  validateDocumentUpload,
  
  // Admin validation
  validateAdminAction,
  validateBulkJobIds,
  
  // Additional validations
  validateNotificationSettings,
  validateContactForm,
  validateReport
};