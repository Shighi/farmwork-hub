import { User } from './auth';
import { Job } from './jobs';

// Use intersection types to override the availability property
export interface UserProfile extends Omit<User, 'availability'> {
  workHistory?: WorkExperience[];
  // Removed education to avoid conflict with User base type
  certifications?: Certification[];
  languages?: string[];
  availability?: Availability; // Now this can be the complex Availability type
  preferences?: UserPreferences;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Availability {
  fullTime: boolean;
  partTime: boolean;
  seasonal: boolean;
  weekends: boolean;
  nightShift: boolean;
  remoteWork: boolean;
  travelWilling: boolean;
  maxTravelDistance?: number;
}

export interface UserPreferences {
  preferredJobTypes: string[];
  preferredLocations: string[];
  minimumSalary?: number;
  preferredSalaryType: string;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
}

// Renamed from Application to JobApplication to avoid conflicts
export interface JobApplication {
  id: string;
  applicantId: string; // Changed from userId for clarity
  jobId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  proposedSalary?: number;
  appliedAt: string;
  updatedAt: string;
  job: Job;
  user?: User;
}

export interface UserRating {
  id: string;
  raterId: string;
  ratedUserId: string;
  jobId: string;
  rating: number;
  review?: string;
  createdAt: string;
  rater?: User;
  job?: Job;
}

export interface CreateRatingData {
  rating: number;
  review?: string;
  jobId: string;
}

export interface UserStats {
  totalJobsPosted: number;
  totalApplications: number;
  totalJobsCompleted: number;
  averageRating: number;
  totalRatings: number;
  profileViews: number;
  responseRate: number;
  joinDate: string;
}

export interface SearchUsersFilters {
  userType?: 'worker' | 'employer';
  location?: string;
  skills?: string[];
  minRating?: number;
  isVerified?: boolean;
  search?: string;
  sortBy?: 'rating' | 'createdAt' | 'firstName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Re-export User type from auth
export type { User } from './auth';