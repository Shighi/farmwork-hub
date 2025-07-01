import { VALIDATION_RULES } from './constants';

// Types for validation results
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Job form data type
export interface JobFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number | string;
  salaryType: string;
  jobType: string;
  startDate: string | Date;
  endDate?: string | Date;
  workersNeeded: number | string;
  skills: string[];
}

// Email validation - supports international domains
export const validateEmail = (email: string): FieldValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!VALIDATION_RULES.EMAIL_PATTERN.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// Password validation with strength requirements
export const validatePassword = (password: string): FieldValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long` 
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): FieldValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

// African phone number validation - supports multiple countries
export const validatePhoneNumber = (phoneNumber: string, country?: string): FieldValidationResult => {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove spaces and special characters for validation
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Country-specific patterns
  const patterns = {
    KE: /^(\+254|0)(7|1)\d{8}$/, // Kenya
    UG: /^(\+256|0)(7|3|4)\d{8}$/, // Uganda
    TZ: /^(\+255|0)(7|6)\d{8}$/, // Tanzania
    RW: /^(\+250|0)(7|2)\d{8}$/, // Rwanda
    ET: /^(\+251|0)(9|7)\d{8}$/, // Ethiopia
    GH: /^(\+233|0)(2|5)\d{8}$/, // Ghana
    NG: /^(\+234|0)(7|8|9)\d{9}$/, // Nigeria
    ZA: /^(\+27|0)(6|7|8)\d{8}$/, // South Africa
    // Generic African pattern for other countries
    generic: /^(\+\d{1,3}|0)\d{8,12}$/
  };

  // Use country-specific pattern if provided, otherwise try all patterns
  if (country && patterns[country as keyof typeof patterns]) {
    const pattern = patterns[country as keyof typeof patterns];
    if (!pattern.test(cleanNumber)) {
      return { isValid: false, error: 'Please enter a valid phone number for your country' };
    }
  } else {
    // Try all patterns to see if any match
    const isValid = Object.values(patterns).some(pattern => pattern.test(cleanNumber));
    if (!isValid) {
      return { isValid: false, error: 'Please enter a valid African phone number' };
    }
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): FieldValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long` 
    };
  }

  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `${fieldName} must not exceed ${VALIDATION_RULES.NAME_MAX_LENGTH} characters` 
    };
  }

  // Allow letters, spaces, hyphens, and apostrophes (for African names)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true };
};

// Bio validation
export const validateBio = (bio: string): FieldValidationResult => {
  if (!bio || !bio.trim()) {
    return { isValid: false, error: 'Bio is required' };
  }

  if (bio.trim().length > VALIDATION_RULES.BIO_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Bio must not exceed ${VALIDATION_RULES.BIO_MAX_LENGTH} characters` 
    };
  }

  return { isValid: true };
};

// Job title validation
export const validateJobTitle = (title: string): FieldValidationResult => {
  if (!title || !title.trim()) {
    return { isValid: false, error: 'Job title is required' };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > VALIDATION_RULES.JOB_TITLE_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Job title must not exceed ${VALIDATION_RULES.JOB_TITLE_MAX_LENGTH} characters` 
    };
  }

  return { isValid: true };
};

// Job description validation
export const validateJobDescription = (description: string): FieldValidationResult => {
  if (!description || !description.trim()) {
    return { isValid: false, error: 'Job description is required' };
  }

  if (description.trim().length > VALIDATION_RULES.JOB_DESCRIPTION_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Job description must not exceed ${VALIDATION_RULES.JOB_DESCRIPTION_MAX_LENGTH} characters` 
    };
  }

  return { isValid: true };
};

// Cover letter validation
export const validateCoverLetter = (coverLetter: string): FieldValidationResult => {
  if (!coverLetter || !coverLetter.trim()) {
    return { isValid: false, error: 'Cover letter is required' };
  }

  if (coverLetter.trim().length > VALIDATION_RULES.COVER_LETTER_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Cover letter must not exceed ${VALIDATION_RULES.COVER_LETTER_MAX_LENGTH} characters` 
    };
  }

  return { isValid: true };
};

// Salary validation
export const validateSalary = (salary: number | string): FieldValidationResult => {
  if (!salary || salary === '') {
    return { isValid: false, error: 'Salary is required' };
  }

  const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;

  if (isNaN(numericSalary) || numericSalary <= 0) {
    return { isValid: false, error: 'Please enter a valid salary amount' };
  }

  // Maximum reasonable salary (in local currency)
  if (numericSalary > 10000000) {
    return { isValid: false, error: 'Salary amount seems too high' };
  }

  return { isValid: true };
};

// Date validation
export const validateDate = (date: string | Date, fieldName: string = 'Date'): FieldValidationResult => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }

  return { isValid: true };
};

// Start date validation (must be future date)
export const validateStartDate = (startDate: string | Date): FieldValidationResult => {
  const dateValidation = validateDate(startDate, 'Start date');
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const dateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  return { isValid: true };
};

// End date validation (must be after start date)
export const validateEndDate = (endDate: string | Date, startDate: string | Date): FieldValidationResult => {
  const dateValidation = validateDate(endDate, 'End date');
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;

  if (endDateObj <= startDateObj) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
};

// Workers needed validation
export const validateWorkersNeeded = (workersNeeded: number | string): FieldValidationResult => {
  if (!workersNeeded || workersNeeded === '') {
    return { isValid: false, error: 'Number of workers needed is required' };
  }

  const numericWorkers = typeof workersNeeded === 'string' ? parseInt(workersNeeded) : workersNeeded;

  if (isNaN(numericWorkers) || numericWorkers < 1) {
    return { isValid: false, error: 'Number of workers must be at least 1' };
  }

  if (numericWorkers > 1000) {
    return { isValid: false, error: 'Number of workers cannot exceed 1000' };
  }

  return { isValid: true };
};

// File validation
export const validateFile = (file: File, type: 'image' | 'document'): FieldValidationResult => {
  if (!file) {
    return { isValid: false, error: 'File is required' };
  }

  // Check file size
  if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size is too large. Maximum size is 5MB' };
  }

  // Check file type
  const allowedTypes = type === 'image' 
    ? VALIDATION_RULES.ALLOWED_IMAGE_TYPES 
    : VALIDATION_RULES.ALLOWED_DOCUMENT_TYPES;

  if (!allowedTypes.includes(file.type)) {
    const typeNames = type === 'image' ? 'JPEG, PNG, or WebP' : 'PDF, DOC, or DOCX';
    return { isValid: false, error: `Please select a valid ${typeNames} file` };
  }

  return { isValid: true };
};

// Location validation (African cities/regions)
export const validateLocation = (location: string): FieldValidationResult => {
  if (!location || !location.trim()) {
    return { isValid: false, error: 'Location is required' };
  }

  const trimmedLocation = location.trim();

  if (trimmedLocation.length < 2) {
    return { isValid: false, error: 'Location must be at least 2 characters long' };
  }

  if (trimmedLocation.length > 100) {
    return { isValid: false, error: 'Location must not exceed 100 characters' };
  }

  return { isValid: true };
};

// Skills validation
export const validateSkills = (skills: string[]): FieldValidationResult => {
  if (!skills || skills.length === 0) {
    return { isValid: false, error: 'At least one skill is required' };
  }

  if (skills.length > 20) {
    return { isValid: false, error: 'Maximum 20 skills allowed' };
  }

  // Check each skill
  for (const skill of skills) {
    if (!skill || !skill.trim()) {
      return { isValid: false, error: 'Skills cannot be empty' };
    }

    if (skill.trim().length > 50) {
      return { isValid: false, error: 'Each skill must not exceed 50 characters' };
    }
  }

  return { isValid: true };
};

// Comprehensive form validation
export const validateLoginForm = (data: { email: string; password: string }): ValidationResult => {
  const errors: string[] = [];

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid && emailResult.error) {
    errors.push(emailResult.error);
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRegistrationForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  userType: string;
  location: string;
}): ValidationResult => {
  const errors: string[] = [];

  const firstNameResult = validateName(data.firstName, 'First name');
  if (!firstNameResult.isValid && firstNameResult.error) {
    errors.push(firstNameResult.error);
  }

  const lastNameResult = validateName(data.lastName, 'Last name');
  if (!lastNameResult.isValid && lastNameResult.error) {
    errors.push(lastNameResult.error);
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid && emailResult.error) {
    errors.push(emailResult.error);
  }

  const phoneResult = validatePhoneNumber(data.phoneNumber);
  if (!phoneResult.isValid && phoneResult.error) {
    errors.push(phoneResult.error);
  }

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.push(passwordResult.error);
  }

  const confirmPasswordResult = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmPasswordResult.isValid && confirmPasswordResult.error) {
    errors.push(confirmPasswordResult.error);
  }

  if (!data.userType || !['worker', 'employer'].includes(data.userType)) {
    errors.push('Please select a valid user type');
  }

  const locationResult = validateLocation(data.location);
  if (!locationResult.isValid && locationResult.error) {
    errors.push(locationResult.error);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateJobForm = (data: JobFormData): ValidationResult => {
  const errors: string[] = [];

  const titleResult = validateJobTitle(data.title);
  if (!titleResult.isValid && titleResult.error) {
    errors.push(titleResult.error);
  }

  const descriptionResult = validateJobDescription(data.description);
  if (!descriptionResult.isValid && descriptionResult.error) {
    errors.push(descriptionResult.error);
  }

  if (!data.category || !data.category.trim()) {
    errors.push('Job category is required');
  }

  const locationResult = validateLocation(data.location);
  if (!locationResult.isValid && locationResult.error) {
    errors.push(locationResult.error);
  }

  const salaryResult = validateSalary(data.salary);
  if (!salaryResult.isValid && salaryResult.error) {
    errors.push(salaryResult.error);
  }

  if (!data.salaryType || !['daily', 'weekly', 'monthly', 'fixed'].includes(data.salaryType)) {
    errors.push('Please select a valid salary type');
  }

  if (!data.jobType || !['temporary', 'seasonal', 'permanent'].includes(data.jobType)) {
    errors.push('Please select a valid job type');
  }

  const startDateResult = validateStartDate(data.startDate);
  if (!startDateResult.isValid && startDateResult.error) {
    errors.push(startDateResult.error);
  }

  if (data.endDate) {
    const endDateResult = validateEndDate(data.endDate, data.startDate);
    if (!endDateResult.isValid && endDateResult.error) {
      errors.push(endDateResult.error);
    }
  }

  const workersResult = validateWorkersNeeded(data.workersNeeded);
  if (!workersResult.isValid && workersResult.error) {
    errors.push(workersResult.error);
  }

  const skillsResult = validateSkills(data.skills);
  if (!skillsResult.isValid && skillsResult.error) {
    errors.push(skillsResult.error);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation
export const validateUrl = (url: string): FieldValidationResult => {
  if (!url) {
    return { isValid: true }; // URL is optional
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Age validation (for user profiles)
export const validateAge = (birthDate: string | Date): FieldValidationResult => {
  if (!birthDate) {
    return { isValid: false, error: 'Birth date is required' };
  }

  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  const age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    // Adjust age if birthday hasn't occurred this year
  }

  if (age < 16) {
    return { isValid: false, error: 'You must be at least 16 years old to register' };
  }

  if (age > 100) {
    return { isValid: false, error: 'Please enter a valid birth date' };
  }

  return { isValid: true };
};

// Export all validators for easy access
export const validators = {
  email: validateEmail,
  password: validatePassword,
  passwordConfirmation: validatePasswordConfirmation,
  phoneNumber: validatePhoneNumber,
  name: validateName,
  bio: validateBio,
  jobTitle: validateJobTitle,
  jobDescription: validateJobDescription,
  coverLetter: validateCoverLetter,
  salary: validateSalary,
  date: validateDate,
  startDate: validateStartDate,
  endDate: validateEndDate,
  workersNeeded: validateWorkersNeeded,
  file: validateFile,
  location: validateLocation,
  skills: validateSkills,
  url: validateUrl,
  age: validateAge,
  forms: {
    login: validateLoginForm,
    registration: validateRegistrationForm,
    job: validateJobForm,
  }
};