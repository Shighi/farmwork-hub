import { AFRICAN_COUNTRIES } from './constants';

/**
 * Format currency based on country/currency code
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
};

/**
 * Format salary range with appropriate currency
 */
export const formatSalaryRange = (
  minSalary: number,
  maxSalary: number,
  currency: string,
  salaryType: string = 'monthly'
): string => {
  const formattedMin = formatCurrency(minSalary, currency);
  const formattedMax = formatCurrency(maxSalary, currency);
  
  const period = salaryType === 'daily' ? '/day' : 
                salaryType === 'weekly' ? '/week' : 
                salaryType === 'monthly' ? '/month' : 
                salaryType === 'seasonal' ? '/season' :
                salaryType === 'fixed' ? ' (fixed)' : '';
  
  if (minSalary === maxSalary) {
    return `${formattedMin}${period}`;
  }
  
  return `${formattedMin} - ${formattedMax}${period}`;
};

/**
 * Format single salary amount
 */
export const formatSalary = (
  amount: number,
  currency: string,
  salaryType: string = 'monthly'
): string => {
  const formatted = formatCurrency(amount, currency);
  
  const period = salaryType === 'daily' ? '/day' : 
                salaryType === 'weekly' ? '/week' : 
                salaryType === 'monthly' ? '/month' : 
                salaryType === 'seasonal' ? '/season' :
                salaryType === 'piece_rate' ? '/piece' :
                salaryType === 'fixed' ? ' (fixed)' : '';
  
  return `${formatted}${period}`;
};

/**
 * Format dates for different contexts
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
      });
    
    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    
    case 'long':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    
    case 'relative':
      return formatRelativeTime(dateObj);
    
    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffInMinutes) < 1) {
    return 'just now';
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 7) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInWeeks) < 4) {
    return rtf.format(diffInWeeks, 'week');
  } else if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  } else {
    return rtf.format(diffInYears, 'year');
  }
};

/**
 * Format phone numbers for different African countries
 */
export const formatPhoneNumber = (phone: string, countryCode?: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If no country code provided, return cleaned number
  if (!countryCode) {
    return cleaned;
  }
  
  // Basic formatting for common African country codes
  const formatPatterns: Record<string, (num: string) => string> = {
    'KE': (num) => num.replace(/(\+254|0)(\d{3})(\d{3})(\d{3})/, '+254 $2 $3 $4'), // Kenya
    'NG': (num) => num.replace(/(\+234|0)(\d{3})(\d{3})(\d{4})/, '+234 $2 $3 $4'), // Nigeria
    'ZA': (num) => num.replace(/(\+27|0)(\d{2})(\d{3})(\d{4})/, '+27 $2 $3 $4'), // South Africa
    'GH': (num) => num.replace(/(\+233|0)(\d{2})(\d{3})(\d{4})/, '+233 $2 $3 $4'), // Ghana
    'UG': (num) => num.replace(/(\+256|0)(\d{3})(\d{3})(\d{3})/, '+256 $2 $3 $4'), // Uganda
    'TZ': (num) => num.replace(/(\+255|0)(\d{3})(\d{3})(\d{3})/, '+255 $2 $3 $4'), // Tanzania
    'EG': (num) => num.replace(/(\+20|0)(\d{2})(\d{4})(\d{4})/, '+20 $2 $3 $4'), // Egypt
    'ET': (num) => num.replace(/(\+251|0)(\d{2})(\d{3})(\d{4})/, '+251 $2 $3 $4'), // Ethiopia
    'MA': (num) => num.replace(/(\+212|0)(\d{3})(\d{2})(\d{2})(\d{2})/, '+212 $2 $3 $4 $5'), // Morocco
    'RW': (num) => num.replace(/(\+250|0)(\d{3})(\d{3})(\d{3})/, '+250 $2 $3 $4'), // Rwanda
  };
  
  const formatter = formatPatterns[countryCode];
  return formatter ? formatter(cleaned) : cleaned;
};

/**
 * Format user names properly
 */
export const formatName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'Anonymous User';
  if (!lastName) return firstName || '';
  if (!firstName) return lastName;
  
  return `${firstName} ${lastName}`;
};

/**
 * Format job duration
 */
export const formatJobDuration = (startDate: string | Date, endDate?: string | Date): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  
  if (!endDate) {
    return `Starting ${formatDate(start, 'medium')}`;
  }
  
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  
  if (durationDays <= 0) {
    return 'Invalid duration';
  } else if (durationDays === 1) {
    return '1 day';
  } else if (durationDays < 7) {
    return `${durationDays} days`;
  } else if (durationDays < 30) {
    const weeks = Math.ceil(durationDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else if (durationDays < 365) {
    const months = Math.ceil(durationDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    const years = Math.ceil(durationDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format numbers with appropriate suffixes (K, M, B)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format rating display
 */
export const formatRating = (rating: number, totalRatings: number): string => {
  if (totalRatings === 0) return 'No ratings';
  
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return `${stars} ${rating.toFixed(1)} (${formatNumber(totalRatings)} ${totalRatings === 1 ? 'rating' : 'ratings'})`;
};

/**
 * Format location display
 */
export const formatLocation = (location: string, countryCode?: string): string => {
  if (!location) return 'Location not specified';
  
  const country = AFRICAN_COUNTRIES.find(c => c.code === countryCode);
  if (country && !location.includes(country.name)) {
    return `${location}, ${country.name}`;
  }
  
  return location;
};

/**
 * Format experience level
 */
export const formatExperience = (years: number): string => {
  if (years === 0) return 'No experience required';
  if (years < 1) return 'Less than 1 year';
  if (years === 1) return '1 year';
  if (years < 3) return `${years} years`;
  if (years < 5) return `${years} years (Mid-level)`;
  if (years < 10) return `${years} years (Senior)`;
  return `${years}+ years (Expert)`;
};

/**
 * Format skills list
 */
export const formatSkills = (skills: string[], maxDisplay: number = 3): string => {
  if (!skills || skills.length === 0) return 'No skills specified';
  
  if (skills.length <= maxDisplay) {
    return skills.join(', ');
  }
  
  const displayed = skills.slice(0, maxDisplay);
  const remaining = skills.length - maxDisplay;
  
  return `${displayed.join(', ')} +${remaining} more`;
};

/**
 * Format application status for display
 */
export const formatApplicationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Under Review',
    'shortlisted': 'Shortlisted',
    'interview_scheduled': 'Interview Scheduled',
    'accepted': 'Accepted',
    'rejected': 'Not Selected',
    'withdrawn': 'Withdrawn'
  };
  
  return statusMap[status] || status;
};

/**
 * Format job type for display
 */
export const formatJobType = (jobType: string): string => {
  const typeMap: Record<string, string> = {
    'temporary': 'Temporary',
    'seasonal': 'Seasonal',
    'permanent': 'Permanent',
    'part_time': 'Part-time',
    'contract': 'Contract',
    'casual': 'Casual Work',
    'internship': 'Internship'
  };
  
  return typeMap[jobType] || jobType;
};

/**
 * Format job status for display
 */
export const formatJobStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'active': 'Active',
    'filled': 'Position Filled',
    'expired': 'Expired',
    'cancelled': 'Cancelled',
    'paused': 'Paused'
  };
  
  return statusMap[status] || status;
};

/**
 * Format distance (for location-based searches)
 */
export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m away`;
  } else if (distanceInKm < 100) {
    return `${distanceInKm.toFixed(1)}km away`;
  } else {
    return `${Math.round(distanceInKm)}km away`;
  }
};

/**
 * Format work schedule
 */
export const formatWorkSchedule = (schedule: string): string => {
  const scheduleMap: Record<string, string> = {
    'full_time': 'Full-time (8 hours/day)',
    'part_time': 'Part-time (4-6 hours/day)',
    'flexible': 'Flexible hours',
    'shift_work': 'Shift work',
    'seasonal': 'Seasonal work',
    'weekend_only': 'Weekends only',
    'evening_only': 'Evenings only'
  };
  
  return scheduleMap[schedule] || schedule;
};

/**
 * Format contract duration
 */
export const formatContractDuration = (
  startDate: string | Date,
  endDate: string | Date,
  contractType: string = 'fixed'
): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const duration = formatJobDuration(start, end);
  
  if (contractType === 'permanent') {
    return 'Permanent position';
  } else if (contractType === 'seasonal') {
    return `Seasonal contract (${duration})`;
  } else {
    return `${duration} contract`;
  }
};

/**
 * Format salary negotiability
 */
export const formatSalaryNegotiability = (isNegotiable: boolean): string => {
  return isNegotiable ? 'Negotiable' : 'Fixed rate';
};

/**
 * Format urgency level
 */
export const formatUrgency = (urgency: string): string => {
  const urgencyMap: Record<string, string> = {
    'low': 'No rush',
    'medium': 'Moderate urgency',
    'high': 'Urgent',
    'immediate': 'Immediate start required'
  };
  
  return urgencyMap[urgency] || urgency;
};

/**
 * Format employment benefits
 */
export const formatBenefits = (benefits: string[]): string => {
  if (!benefits || benefits.length === 0) return 'No additional benefits';
  
  const benefitMap: Record<string, string> = {
    'accommodation': 'Accommodation provided',
    'meals': 'Meals included',
    'transport': 'Transportation provided',
    'health_insurance': 'Health insurance',
    'overtime_pay': 'Overtime pay',
    'bonus': 'Performance bonus',
    'training': 'Training provided',
    'equipment': 'Equipment provided'
  };
  
  const formattedBenefits = benefits.map(benefit => 
    benefitMap[benefit] || benefit
  );
  
  return formattedBenefits.join(', ');
};

/**
 * Format age requirement
 */
export const formatAgeRequirement = (minAge?: number, maxAge?: number): string => {
  if (!minAge && !maxAge) return 'No age restriction';
  if (minAge && !maxAge) return `${minAge}+ years old`;
  if (!minAge && maxAge) return `Under ${maxAge} years old`;
  return `${minAge}-${maxAge} years old`;
};

/**
 * Format language requirements
 */
export const formatLanguages = (languages: string[]): string => {
  if (!languages || languages.length === 0) return 'No language requirements';
  
  const languageMap: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'ar': 'Arabic',
    'sw': 'Swahili',
    'ha': 'Hausa',
    'yo': 'Yoruba',
    'ig': 'Igbo',
    'am': 'Amharic',
    'zu': 'Zulu',
    'af': 'Afrikaans',
    'pt': 'Portuguese'
  };
  
  const formattedLanguages = languages.map(lang => 
    languageMap[lang] || lang
  );
  
  return formattedLanguages.join(', ');
};

/**
 * Format transportation method
 */
export const formatTransportation = (transport: string): string => {
  const transportMap: Record<string, string> = {
    'own_vehicle': 'Own vehicle required',
    'public_transport': 'Public transport accessible',
    'provided': 'Transportation provided',
    'walking_distance': 'Walking distance',
    'bicycle': 'Bicycle accessible',
    'motorcycle': 'Motorcycle required'
  };
  
  return transportMap[transport] || transport;
};