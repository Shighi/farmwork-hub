import { User } from './auth';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  salaryType: 'daily' | 'weekly' | 'monthly' | 'fixed';
  jobType: 'temporary' | 'seasonal' | 'permanent';
  startDate: string;
  endDate?: string;
  workersNeeded: number;
  skills: string[];
  requirements: string;
  employerId: string;
  employer?: User;
  company?: string;
  status: 'active' | 'filled' | 'expired' | 'cancelled';
  isBoosted: boolean;
  applicationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  job?: Job;
  applicant?: User;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter: string;
  proposedSalary?: number;
  appliedAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  salaryType: 'daily' | 'weekly' | 'monthly' | 'fixed';
  jobType: 'temporary' | 'seasonal' | 'permanent';
  startDate: string;
  endDate?: string;
  workersNeeded: number;
  skills: string[];
  requirements: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  status?: 'active' | 'filled' | 'expired' | 'cancelled';
}

export interface SalaryRange {
  min: number;
  max: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  jobType?: string;
  salaryType?: string;
  salaryRange?: SalaryRange;
  minSalary?: number;
  maxSalary?: number;
  skills?: string[];
  sortBy?: 'newest' | 'oldest' | 'salary-high' | 'salary-low' | 'location' | 'title' | 'createdAt' | 'salary';
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApplyJobData {
  coverLetter: string;
  proposedSalary?: number;
}

export type JobFormData = {
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number;
  salaryType: 'daily' | 'weekly' | 'monthly' | 'fixed';
  jobType: 'temporary' | 'seasonal' | 'permanent';
  startDate: string;
  endDate?: string;
  workersNeeded: number;
  skills: string[];
  requirements: string;
};

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  filledJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
}

export const JOB_CATEGORIES = [
  'Crop Production',
  'Livestock',
  'Dairy Farming',
  'Poultry',
  'Fishing',
  'Farm Management',
  'Agricultural Equipment',
  'Harvesting',
  'Irrigation',
  'Organic Farming',
  'Greenhouse',
  'Food Processing',
  'Agricultural Research',
  'Veterinary Services',
  'Agricultural Sales',
] as const;

export const SALARY_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'fixed', label: 'Fixed Rate' },
] as const;

export const JOB_TYPES = [
  { value: 'temporary', label: 'Temporary' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'permanent', label: 'Permanent' },
] as const;

export const AFRICAN_LOCATIONS = [
  'Nairobi, Kenya',
  'Lagos, Nigeria',
  'Cape Town, South Africa',
  'Cairo, Egypt',
  'Accra, Ghana',
  'Addis Ababa, Ethiopia',
  'Kampala, Uganda',
  'Dar es Salaam, Tanzania',
  'Kigali, Rwanda',
  'Abuja, Nigeria',
  'Johannesburg, South Africa',
  'Casablanca, Morocco',
  'Tunis, Tunisia',
  'Lusaka, Zambia',
  'Harare, Zimbabwe',
  'Maputo, Mozambique',
  'Dakar, Senegal',
  'Bamako, Mali',
  'Ouagadougou, Burkina Faso',
  'Lomé, Togo',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'salary-high', label: 'Highest Salary' },
  { value: 'salary-low', label: 'Lowest Salary' },
  { value: 'location', label: 'By Location' },
  { value: 'title', label: 'By Title' },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];