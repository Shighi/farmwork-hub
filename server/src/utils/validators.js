const validator = require('validator');

/**
 * Validation utility functions for FarmWork Hub
 */

// Constants from the project document
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  JOB_TITLE_MAX_LENGTH: 100,
  JOB_DESCRIPTION_MAX_LENGTH: 2000,
  COVER_LETTER_MAX_LENGTH: 1500,
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// African countries for location validation
const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
  'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo',
  'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea',
  'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
  'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
  'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco',
  'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe',
  'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan',
  'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

// Valid job categories
const JOB_CATEGORIES = [
  'Crop Production', 'Livestock Farming', 'Poultry Farming', 'Fish Farming (Aquaculture)',
  'Dairy Farming', 'Horticulture', 'Agricultural Processing', 'Farm Management',
  'Agricultural Equipment Operation', 'Irrigation Systems', 'Organic Farming',
  'Greenhouse Management', 'Agricultural Sales & Marketing', 'Veterinary Services',
  'Agricultural Research', 'Forestry', 'Beekeeping', 'Seed Production',
  'Agricultural Consulting', 'Food Safety & Quality Control'
];

// Valid job types
const JOB_TYPES = ['temporary', 'seasonal', 'permanent', 'partTime', 'contract', 'internship', 'volunteer'];

// Valid salary types
const SALARY_TYPES = ['daily', 'weekly', 'monthly', 'fixed', 'seasonal', 'piece_rate'];

// Valid user types
const USER_TYPES = ['worker', 'employer', 'admin'];

// Valid application statuses
const APPLICATION_STATUS = ['pending', 'accepted', 'rejected', 'withdrawn', 'shortlisted', 'interview_scheduled'];

// Valid job statuses
const JOB_STATUS = ['draft', 'active', 'filled', 'expired', 'cancelled', 'paused'];

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
const validateEmail = (email) => {
  const result = { isValid: true, messages: [] };
  
  if (!email) {
    result.isValid = false;
    result.messages.push('Email is required');
    return result;
  }
  
  if (typeof email !== 'string') {
    result.isValid = false;
    result.messages.push('Email must be a string');
    return result;
  }
  
  if (!validator.isEmail(email)) {
    result.isValid = false;
    result.messages.push('Invalid email format');
  }
  
  if (email.length > 254) {
    result.isValid = false;
    result.messages.push('Email is too long');
  }
  
  return result;
};

/**
 * Validate name (first name or last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {Object} Validation result
 */
const validateName = (name, fieldName = 'Name') => {
  const result = { isValid: true, messages: [] };
  
  if (!name) {
    result.isValid = false;
    result.messages.push(`${fieldName} is required`);
    return result;
  }
  
  if (typeof name !== 'string') {
    result.isValid = false;
    result.messages.push(`${fieldName} must be a string`);
    return result;
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    result.isValid = false;
    result.messages.push(`${fieldName} must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`);
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`${fieldName} must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long`);
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    result.isValid = false;
    result.messages.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }
  
  return result;
};

/**
 * Validate phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {Object} Validation result
 */
const validatePhoneNumber = (phoneNumber) => {
  const result = { isValid: true, messages: [] };
  
  if (!phoneNumber) {
    result.isValid = false;
    result.messages.push('Phone number is required');
    return result;
  }
  
  if (typeof phoneNumber !== 'string') {
    result.isValid = false;
    result.messages.push('Phone number must be a string');
    return result;
  }
  
  if (!VALIDATION_RULES.PHONE_REGEX.test(phoneNumber)) {
    result.isValid = false;
    result.messages.push('Invalid phone number format');
  }
  
  return result;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const result = { isValid: true, messages: [] };
  
  if (!password) {
    result.isValid = false;
    result.messages.push('Password is required');
    return result;
  }
  
  if (typeof password !== 'string') {
    result.isValid = false;
    result.messages.push('Password must be a string');
    return result;
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    result.isValid = false;
    result.messages.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters long`);
  }
  
  return result;
};

/**
 * Validate user type
 * @param {string} userType - User type to validate
 * @returns {Object} Validation result
 */
const validateUserType = (userType) => {
  const result = { isValid: true, messages: [] };
  
  if (!userType) {
    result.isValid = false;
    result.messages.push('User type is required');
    return result;
  }
  
  if (!USER_TYPES.includes(userType)) {
    result.isValid = false;
    result.messages.push(`Invalid user type. Must be one of: ${USER_TYPES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate job title
 * @param {string} title - Job title to validate
 * @returns {Object} Validation result
 */
const validateJobTitle = (title) => {
  const result = { isValid: true, messages: [] };
  
  if (!title) {
    result.isValid = false;
    result.messages.push('Job title is required');
    return result;
  }
  
  if (typeof title !== 'string') {
    result.isValid = false;
    result.messages.push('Job title must be a string');
    return result;
  }
  
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length < 3) {
    result.isValid = false;
    result.messages.push('Job title must be at least 3 characters long');
  }
  
  if (trimmedTitle.length > VALIDATION_RULES.JOB_TITLE_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`Job title must be less than ${VALIDATION_RULES.JOB_TITLE_MAX_LENGTH} characters long`);
  }
  
  return result;
};

/**
 * Validate job description
 * @param {string} description - Job description to validate
 * @returns {Object} Validation result
 */
const validateJobDescription = (description) => {
  const result = { isValid: true, messages: [] };
  
  if (!description) {
    result.isValid = false;
    result.messages.push('Job description is required');
    return result;
  }
  
  if (typeof description !== 'string') {
    result.isValid = false;
    result.messages.push('Job description must be a string');
    return result;
  }
  
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < 10) {
    result.isValid = false;
    result.messages.push('Job description must be at least 10 characters long');
  }
  
  if (trimmedDescription.length > VALIDATION_RULES.JOB_DESCRIPTION_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`Job description must be less than ${VALIDATION_RULES.JOB_DESCRIPTION_MAX_LENGTH} characters long`);
  }
  
  return result;
};

/**
 * Validate job category
 * @param {string} category - Job category to validate
 * @returns {Object} Validation result
 */
const validateJobCategory = (category) => {
  const result = { isValid: true, messages: [] };
  
  if (!category) {
    result.isValid = false;
    result.messages.push('Job category is required');
    return result;
  }
  
  if (!JOB_CATEGORIES.includes(category)) {
    result.isValid = false;
    result.messages.push(`Invalid job category. Must be one of: ${JOB_CATEGORIES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate job type
 * @param {string} jobType - Job type to validate
 * @returns {Object} Validation result
 */
const validateJobType = (jobType) => {
  const result = { isValid: true, messages: [] };
  
  if (!jobType) {
    result.isValid = false;
    result.messages.push('Job type is required');
    return result;
  }
  
  if (!JOB_TYPES.includes(jobType)) {
    result.isValid = false;
    result.messages.push(`Invalid job type. Must be one of: ${JOB_TYPES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate salary type
 * @param {string} salaryType - Salary type to validate
 * @returns {Object} Validation result
 */
const validateSalaryType = (salaryType) => {
  const result = { isValid: true, messages: [] };
  
  if (!salaryType) {
    result.isValid = false;
    result.messages.push('Salary type is required');
    return result;
  }
  
  if (!SALARY_TYPES.includes(salaryType)) {
    result.isValid = false;
    result.messages.push(`Invalid salary type. Must be one of: ${SALARY_TYPES.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate salary amount
 * @param {number|string} salary - Salary amount to validate
 * @returns {Object} Validation result
 */
const validateSalary = (salary) => {
  const result = { isValid: true, messages: [] };
  
  if (salary === null || salary === undefined) {
    result.isValid = false;
    result.messages.push('Salary is required');
    return result;
  }
  
  const numSalary = Number(salary);
  
  if (isNaN(numSalary)) {
    result.isValid = false;
    result.messages.push('Salary must be a valid number');
    return result;
  }
  
  if (numSalary < 0) {
    result.isValid = false;
    result.messages.push('Salary cannot be negative');
  }
  
  if (numSalary > 1000000) {
    result.isValid = false;
    result.messages.push('Salary amount is too high');
  }
  
  return result;
};

/**
 * Validate location
 * @param {string} location - Location to validate
 * @returns {Object} Validation result
 */
const validateLocation = (location) => {
  const result = { isValid: true, messages: [] };
  
  if (!location) {
    result.isValid = false;
    result.messages.push('Location is required');
    return result;
  }
  
  if (typeof location !== 'string') {
    result.isValid = false;
    result.messages.push('Location must be a string');
    return result;
  }
  
  const trimmedLocation = location.trim();
  
  if (trimmedLocation.length < 2) {
    result.isValid = false;
    result.messages.push('Location must be at least 2 characters long');
  }
  
  if (trimmedLocation.length > 100) {
    result.isValid = false;
    result.messages.push('Location must be less than 100 characters long');
  }
  
  return result;
};

/**
 * Validate bio
 * @param {string} bio - Bio to validate
 * @returns {Object} Validation result
 */
const validateBio = (bio) => {
  const result = { isValid: true, messages: [] };
  
  if (!bio) {
    return result; // Bio is optional
  }
  
  if (typeof bio !== 'string') {
    result.isValid = false;
    result.messages.push('Bio must be a string');
    return result;
  }
  
  if (bio.trim().length > VALIDATION_RULES.BIO_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`Bio must be less than ${VALIDATION_RULES.BIO_MAX_LENGTH} characters long`);
  }
  
  return result;
};

/**
 * Validate cover letter
 * @param {string} coverLetter - Cover letter to validate
 * @returns {Object} Validation result
 */
const validateCoverLetter = (coverLetter) => {
  const result = { isValid: true, messages: [] };
  
  if (!coverLetter) {
    return result; // Cover letter is optional
  }
  
  if (typeof coverLetter !== 'string') {
    result.isValid = false;
    result.messages.push('Cover letter must be a string');
    return result;
  }
  
  if (coverLetter.trim().length > VALIDATION_RULES.COVER_LETTER_MAX_LENGTH) {
    result.isValid = false;
    result.messages.push(`Cover letter must be less than ${VALIDATION_RULES.COVER_LETTER_MAX_LENGTH} characters long`);
  }
  
  return result;
};

/**
 * Validate application status
 * @param {string} status - Application status to validate
 * @returns {Object} Validation result
 */
const validateApplicationStatus = (status) => {
  const result = { isValid: true, messages: [] };
  
  if (!status) {
    result.isValid = false;
    result.messages.push('Application status is required');
    return result;
  }
  
  if (!APPLICATION_STATUS.includes(status)) {
    result.isValid = false;
    result.messages.push(`Invalid application status. Must be one of: ${APPLICATION_STATUS.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate job status
 * @param {string} status - Job status to validate
 * @returns {Object} Validation result
 */
const validateJobStatus = (status) => {
  const result = { isValid: true, messages: [] };
  
  if (!status) {
    result.isValid = false;
    result.messages.push('Job status is required');
    return result;
  }
  
  if (!JOB_STATUS.includes(status)) {
    result.isValid = false;
    result.messages.push(`Invalid job status. Must be one of: ${JOB_STATUS.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {Object} Validation result
 */
const validateDate = (date, fieldName = 'Date') => {
  const result = { isValid: true, messages: [] };
  
  if (!date) {
    result.isValid = false;
    result.messages.push(`${fieldName} is required`);
    return result;
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    result.isValid = false;
    result.messages.push(`${fieldName} must be a valid date`);
  }
  
  return result;
};

/**
 * Validate workers needed
 * @param {number|string} workersNeeded - Number of workers needed
 * @returns {Object} Validation result
 */
const validateWorkersNeeded = (workersNeeded) => {
  const result = { isValid: true, messages: [] };
  
  if (!workersNeeded) {
    result.isValid = false;
    result.messages.push('Number of workers needed is required');
    return result;
  }
  
  const numWorkers = Number(workersNeeded);
  
  if (isNaN(numWorkers) || !Number.isInteger(numWorkers)) {
    result.isValid = false;
    result.messages.push('Number of workers must be a valid integer');
    return result;
  }
  
  if (numWorkers <= 0) {
    result.isValid = false;
    result.messages.push('Number of workers must be greater than 0');
  }
  
  if (numWorkers > 1000) {
    result.isValid = false;
    result.messages.push('Number of workers cannot exceed 1000');
  }
  
  return result;
};

/**
 * Validate skills array
 * @param {Array} skills - Skills array to validate
 * @returns {Object} Validation result
 */
const validateSkills = (skills) => {
  const result = { isValid: true, messages: [] };
  
  if (!skills) {
    return result; // Skills are optional
  }
  
  if (!Array.isArray(skills)) {
    result.isValid = false;
    result.messages.push('Skills must be an array');
    return result;
  }
  
  if (skills.length > 20) {
    result.isValid = false;
    result.messages.push('Maximum of 20 skills allowed');
  }
  
  for (let i = 0; i < skills.length; i++) {
    if (typeof skills[i] !== 'string') {
      result.isValid = false;
      result.messages.push('All skills must be strings');
      break;
    }
    
    if (skills[i].trim().length < 2) {
      result.isValid = false;
      result.messages.push('Each skill must be at least 2 characters long');
      break;
    }
    
    if (skills[i].trim().length > 50) {
      result.isValid = false;
      result.messages.push('Each skill must be less than 50 characters long');
      break;
    }
  }
  
  return result;
};

/**
 * Validate file upload
 * @param {Object} file - File object to validate
 * @param {string} type - File type ('image' or 'document')
 * @returns {Object} Validation result
 */
const validateFileUpload = (file, type = 'image') => {
  const result = { isValid: true, messages: [] };
  
  if (!file) {
    result.isValid = false;
    result.messages.push('File is required');
    return result;
  }
  
  if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
    result.isValid = false;
    result.messages.push(`File size must be less than ${VALIDATION_RULES.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  const allowedTypes = type === 'image' ? 
    VALIDATION_RULES.ALLOWED_IMAGE_TYPES : 
    VALIDATION_RULES.ALLOWED_DOCUMENT_TYPES;
  
  if (!allowedTypes.includes(file.mimetype)) {
    result.isValid = false;
    result.messages.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return result;
};

/**
 * Validate complete user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result
 */
const validateUserRegistration = (userData) => {
  const result = { isValid: true, messages: [] };
  
  const { firstName, lastName, email, password, phoneNumber, userType, location } = userData;
  
  // Validate required fields
  const firstNameValidation = validateName(firstName, 'First name');
  const lastNameValidation = validateName(lastName, 'Last name');
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const phoneValidation = validatePhoneNumber(phoneNumber);
  const userTypeValidation = validateUserType(userType);
  const locationValidation = validateLocation(location);
  
  // Collect all validation results
  const validations = [
    firstNameValidation,
    lastNameValidation,
    emailValidation,
    passwordValidation,
    phoneValidation,
    userTypeValidation,
    locationValidation
  ];
  
  // Check if any validation failed
  validations.forEach(validation => {
    if (!validation.isValid) {
      result.isValid = false;
      result.messages.push(...validation.messages);
    }
  });
  
  // Validate optional fields if present
  if (userData.bio) {
    const bioValidation = validateBio(userData.bio);
    if (!bioValidation.isValid) {
      result.isValid = false;
      result.messages.push(...bioValidation.messages);
    }
  }
  
  if (userData.skills) {
    const skillsValidation = validateSkills(userData.skills);
    if (!skillsValidation.isValid) {
      result.isValid = false;
      result.messages.push(...skillsValidation.messages);
    }
  }
  
  return result;
};

/**
 * Validate complete job posting data
 * @param {Object} jobData - Job posting data
 * @returns {Object} Validation result
 */
const validateJobPosting = (jobData) => {
  const result = { isValid: true, messages: [] };
  
  const { 
    title, description, category, location, salary, salaryType, 
    jobType, workersNeeded, startDate, endDate 
  } = jobData;
  
  // Validate required fields
  const titleValidation = validateJobTitle(title);
  const descriptionValidation = validateJobDescription(description);
  const categoryValidation = validateJobCategory(category);
  const locationValidation = validateLocation(location);
  const salaryValidation = validateSalary(salary);
  const salaryTypeValidation = validateSalaryType(salaryType);
  const jobTypeValidation = validateJobType(jobType);
  const workersValidation = validateWorkersNeeded(workersNeeded);
  
  // Collect all validation results
  const validations = [
    titleValidation,
    descriptionValidation,
    categoryValidation,
    locationValidation,
    salaryValidation,
    salaryTypeValidation,
    jobTypeValidation,
    workersValidation
  ];
  
  // Check if any validation failed
  validations.forEach(validation => {
    if (!validation.isValid) {
      result.isValid = false;
      result.messages.push(...validation.messages);
    }
  });
  
  // Validate dates if present
  if (startDate) {
    const startDateValidation = validateDate(startDate, 'Start date');
    if (!startDateValidation.isValid) {
      result.isValid = false;
      result.messages.push(...startDateValidation.messages);
    }
  }
  
  if (endDate) {
    const endDateValidation = validateDate(endDate, 'End date');
    if (!endDateValidation.isValid) {
      result.isValid = false;
      result.messages.push(...endDateValidation.messages);
    }
    
    // Check if end date is after start date
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      result.isValid = false;
      result.messages.push('End date must be after start date');
    }
  }
  
  // Validate optional fields if present
  if (jobData.skills) {
    const skillsValidation = validateSkills(jobData.skills);
    if (!skillsValidation.isValid) {
      result.isValid = false;
      result.messages.push(...skillsValidation.messages);
    }
  }
  
  return result;
};

/**
 * Validate job application data
 * @param {Object} applicationData - Job application data
 * @returns {Object} Validation result
 */
const validateJobApplication = (applicationData) => {
  const result = { isValid: true, messages: [] };
  
  const { jobId, applicantId, coverLetter, proposedSalary } = applicationData;
  
  // Validate required fields
  if (!jobId) {
    result.isValid = false;
    result.messages.push('Job ID is required');
  }
  
  if (!applicantId) {
    result.isValid = false;
    result.messages.push('Applicant ID is required');
  }
  
  // Validate optional fields if present
  if (coverLetter) {
    const coverLetterValidation = validateCoverLetter(coverLetter);
    if (!coverLetterValidation.isValid) {
      result.isValid = false;
      result.messages.push(...coverLetterValidation.messages);
    }
  }
  
  if (proposedSalary !== undefined && proposedSalary !== null) {
    const salaryValidation = validateSalary(proposedSalary);
    if (!salaryValidation.isValid) {
      result.isValid = false;
      result.messages.push(...salaryValidation.messages);
    }
  }
  
  return result;
};

// Export all validation functions
module.exports = {
  // Individual field validators
  validateEmail,
  validateName,
  validatePhoneNumber,
  validatePassword,
  validateUserType,
  validateJobTitle,
  validateJobDescription,
  validateJobCategory,
  validateJobType,
  validateSalaryType,
  validateSalary,
  validateLocation,
  validateBio,
  validateCoverLetter,
  validateApplicationStatus,
  validateJobStatus,
  validateDate,
  validateWorkersNeeded,
  validateSkills,
  validateFileUpload,
  
  // Compound validators
  validateUserRegistration,
  validateJobPosting,
  validateJobApplication,
  
  // Constants
  VALIDATION_RULES,
  AFRICAN_COUNTRIES,
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_TYPES,
  USER_TYPES,
  APPLICATION_STATUS,
  JOB_STATUS
};