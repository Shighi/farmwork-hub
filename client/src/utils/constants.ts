// Application constants for FarmWork Hub
export const APP_CONFIG = {
  APP_NAME: 'FarmWork Hub',
  VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  PAGINATION_LIMIT: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
};

// API Base URL - adjust based on your environment
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
};

// African countries and their currencies
export const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algeria', currency: 'DZD', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', currency: 'AOA', flag: '🇦🇴' },
  { code: 'BJ', name: 'Benin', currency: 'XOF', flag: '🇧🇯' },
  { code: 'BW', name: 'Botswana', currency: 'BWP', flag: '🇧🇼' },
  { code: 'BF', name: 'Burkina Faso', currency: 'XOF', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', currency: 'BIF', flag: '🇧🇮' },
  { code: 'CM', name: 'Cameroon', currency: 'XAF', flag: '🇨🇲' },
  { code: 'CV', name: 'Cape Verde', currency: 'CVE', flag: '🇨🇻' },
  { code: 'CF', name: 'Central African Republic', currency: 'XAF', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', currency: 'XAF', flag: '🇹🇩' },
  { code: 'KM', name: 'Comoros', currency: 'KMF', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', currency: 'XAF', flag: '🇨🇬' },
  { code: 'CD', name: 'Democratic Republic of the Congo', currency: 'CDF', flag: '🇨🇩' },
  { code: 'DJ', name: 'Djibouti', currency: 'DJF', flag: '🇩🇯' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', flag: '🇪🇬' },
  { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', currency: 'ERN', flag: '🇪🇷' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹' },
  { code: 'GA', name: 'Gabon', currency: 'XAF', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', currency: 'GMD', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinea', currency: 'GNF', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', currency: 'XOF', flag: '🇬🇼' },
  { code: 'CI', name: 'Ivory Coast', currency: 'XOF', flag: '🇨🇮' },
  { code: 'KE', name: 'Kenya', currency: 'KES', flag: '🇰🇪' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', currency: 'LRD', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', currency: 'LYD', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar', currency: 'MGA', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', currency: 'MWK', flag: '🇲🇼' },
  { code: 'ML', name: 'Mali', currency: 'XOF', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritania', currency: 'MRU', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', currency: 'MUR', flag: '🇲🇺' },
  { code: 'MA', name: 'Morocco', currency: 'MAD', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', currency: 'NAD', flag: '🇳🇦' },
  { code: 'NE', name: 'Niger', currency: 'XOF', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼' },
  { code: 'ST', name: 'São Tomé and Príncipe', currency: 'STN', flag: '🇸🇹' },
  { code: 'SN', name: 'Senegal', currency: 'XOF', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles', currency: 'SCR', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', currency: 'SLE', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalia', currency: 'SOS', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', currency: 'SSP', flag: '🇸🇸' },
  { code: 'SD', name: 'Sudan', currency: 'SDG', flag: '🇸🇩' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿' },
  { code: 'TG', name: 'Togo', currency: 'XOF', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisia', currency: 'TND', flag: '🇹🇳' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', flag: '🇿🇼' }
];

// Job categories specific to African agriculture
export const JOB_CATEGORIES = [
  'Crop Production',
  'Livestock Farming',
  'Poultry Farming',
  'Fish Farming (Aquaculture)',
  'Dairy Farming',
  'Horticulture',
  'Agricultural Processing',
  'Farm Management',
  'Agricultural Equipment Operation',
  'Irrigation Systems',
  'Organic Farming',
  'Greenhouse Management',
  'Agricultural Sales & Marketing',
  'Veterinary Services',
  'Agricultural Research',
  'Forestry',
  'Beekeeping',
  'Seed Production',
  'Agricultural Consulting',
  'Food Safety & Quality Control'
];

// Agricultural skills common across Africa
export const AGRICULTURAL_SKILLS = [
  'Crop Cultivation',
  'Livestock Management',
  'Irrigation Management',
  'Pest Control',
  'Fertilizer Application',
  'Harvesting',
  'Post-Harvest Handling',
  'Farm Equipment Operation',
  'Soil Management',
  'Plant Disease Management',
  'Animal Health Care',
  'Organic Farming Practices',
  'Greenhouse Operations',
  'Agricultural Marketing',
  'Quality Control',
  'Food Safety Standards',
  'Agricultural Record Keeping',
  'Sustainable Farming',
  'Seed Selection',
  'Water Management',
  'Farm Planning',
  'Agricultural Economics',
  'Supply Chain Management',
  'Cooperative Management'
];

// Salary types
export const SALARY_TYPES = [
  { value: 'daily', label: 'Daily Rate' },
  { value: 'weekly', label: 'Weekly Rate' },
  { value: 'monthly', label: 'Monthly Salary' },
  { value: 'fixed', label: 'Fixed Project Rate' },
  { value: 'seasonal', label: 'Seasonal Contract' },
  { value: 'piece_rate', label: 'Piece Rate' }
];

// Salary ranges for filtering (in USD equivalent for consistency)
export const SALARY_RANGES = [
  { min: 0, max: 500, label: 'Under $500' },
  { min: 500, max: 1000, label: '$500 - $1,000' },
  { min: 1000, max: 2000, label: '$1,000 - $2,000' },
  { min: 2000, max: 5000, label: '$2,000 - $5,000' },
  { min: 5000, max: 10000, label: '$5,000 - $10,000' },
  { min: 10000, max: 20000, label: '$10,000 - $20,000' },
  { min: 20000, max: 50000, label: '$20,000 - $50,000' },
  { min: 50000, max: 100000, label: '$50,000 - $100,000' },
  { min: 100000, max: null, label: '$100,000+' }
];

// Job types (updated to match usage in JobFilters)
export const JOB_TYPES = [
  'temporary',
  'seasonal', 
  'permanent',
  'partTime',
  'contract',
  'internship',
  'volunteer'
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-1 years)', min: 0, max: 1 },
  { value: 'junior', label: 'Junior (1-3 years)', min: 1, max: 3 },
  { value: 'mid', label: 'Mid-level (3-5 years)', min: 3, max: 5 },
  { value: 'senior', label: 'Senior (5+ years)', min: 5, max: 20 },
  { value: 'expert', label: 'Expert (10+ years)', min: 10, max: 30 }
];

// Application status options
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled'
};

// Job status options
export const JOB_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  FILLED: 'filled',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PAUSED: 'paused'
};

// User types
export const USER_TYPES = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
  ADMIN: 'admin'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh'
  },
  JOBS: {
    LIST: '/api/jobs',
    CREATE: '/api/jobs',
    DETAIL: (id: string) => `/api/jobs/${id}`,
    UPDATE: (id: string) => `/api/jobs/${id}`,
    DELETE: (id: string) => `/api/jobs/${id}`,
    APPLY: (id: string) => `/api/jobs/${id}/apply`,
    MY_JOBS: '/api/jobs/my-jobs',
    FEATURED: '/api/jobs/featured',
    SEARCH: '/api/jobs/search'
  },
  APPLICATIONS: {
    LIST: '/api/applications',
    DETAIL: (id: string) => `/api/applications/${id}`,
    UPDATE: (id: string) => `/api/applications/${id}`,
    WITHDRAW: (id: string) => `/api/applications/${id}`,
    BY_JOB: (jobId: string) => `/api/applications/job/${jobId}`
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    UPLOAD_AVATAR: '/api/users/upload-avatar',
    RATING: (id: string) => `/api/users/${id}/rating`,
    RATE_USER: (id: string) => `/api/users/${id}/rate`
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'farmwork_auth_token',
  REFRESH_TOKEN: 'farmwork_refresh_token',
  USER_DATA: 'farmwork_user_data',
  SEARCH_FILTERS: 'farmwork_search_filters',
  LANGUAGE_PREFERENCE: 'farmwork_language',
  THEME_PREFERENCE: 'farmwork_theme'
};

// Validation rules - Updated with all required properties
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  JOB_TITLE_MAX_LENGTH: 100,
  JOB_DESCRIPTION_MAX_LENGTH: 2000,
  COVER_LETTER_MAX_LENGTH: 1500, // Added missing property
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Added missing property (alias for EMAIL_REGEX)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // Added missing property (5MB)
  ALLOWED_IMAGE_TYPES: [ // Added missing property
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  ALLOWED_DOCUMENT_TYPES: [ // Added missing property
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: `Only ${APP_CONFIG.SUPPORTED_IMAGE_FORMATS.join(', ')} files are allowed`
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  JOB_POSTED: 'Job posted successfully!',
  JOB_UPDATED: 'Job updated successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully!'
};

// Theme colors (matching the design system)
export const THEME_COLORS = {
  PRIMARY: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Primary green
    600: '#16a34a', // Secondary green
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  ORANGE: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Accent orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12'
  },
  GRAY: {
    50: '#fafafa', // Background
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3', // Earth brown
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#1f2937' // Text primary
  }
};

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};