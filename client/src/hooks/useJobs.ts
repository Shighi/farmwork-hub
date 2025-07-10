import { useState, useEffect, useCallback, useMemo } from 'react';
import { Job, JobFilters, JobApplication, ApplyJobData, CreateJobData } from '../types/jobs';
import { PAGINATION } from '../utils/constants';
import { demoJobs, demoApplications } from '../data/demoData';
import { jobsService } from '../services/jobs';

interface UseJobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

interface UseJobsParams {
  filters?: JobFilters;
  pageSize?: number;
  autoFetch?: boolean;
}

export function useJobs({ filters, pageSize = PAGINATION.DEFAULT_PAGE_SIZE, autoFetch = true }: UseJobsParams = {}) {
  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    loading: false,
    error: null,
    totalCount: 0,
    hasMore: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort jobs based on filters
  const filteredJobs = useMemo(() => {
    let filtered = [...demoJobs];

    if (filters) {
      // Location filter
      if (filters.location) {
        filtered = filtered.filter(job =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(job => job.category === filters.category);
      }

      // Job type filter
      if (filters.jobType) {
        filtered = filtered.filter(job => job.jobType === filters.jobType);
      }

      // Salary range filter
      if (filters.salaryRange) {
        if (filters.salaryRange.min !== undefined) {
          filtered = filtered.filter(job => job.salary >= filters.salaryRange!.min);
        }
        if (filters.salaryRange.max !== undefined) {
          filtered = filtered.filter(job => job.salary <= filters.salaryRange!.max);
        }
      }

      // Legacy salary filters (for backward compatibility)
      if (filters.minSalary !== undefined) {
        filtered = filtered.filter(job => job.salary >= filters.minSalary!);
      }
      if (filters.maxSalary !== undefined) {
        filtered = filtered.filter(job => job.salary <= filters.maxSalary!);
      }

      // Salary type filter
      if (filters.salaryType) {
        filtered = filtered.filter(job => job.salaryType === filters.salaryType);
      }

      // Search query filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        filtered = filtered.filter(job =>
          filters.skills!.some(skill =>
            job.skills.some(jobSkill =>
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
    }

    // Sort jobs based on sortBy option
    filtered.sort((a, b) => {
      // Always prioritize boosted jobs first
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;

      // Then sort by the selected option
      const sortBy = filters?.sortBy || 'newest';
      const sortOrder = filters?.sortOrder || 'desc';
      
      let comparison = 0;
      
      switch (sortBy) {
        case 'oldest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'salary-high':
          comparison = b.salary - a.salary;
          break;
        case 'salary-low':
          comparison = a.salary - b.salary;
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'salary':
          comparison = sortOrder === 'asc' ? a.salary - b.salary : b.salary - a.salary;
          break;
        case 'createdAt':
          comparison = sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'newest':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }
      
      return comparison;
    });

    return filtered;
  }, [filters]);

  // Paginated jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredJobs.slice(0, endIndex);
  }, [filteredJobs, currentPage, pageSize]);

  const fetchJobs = useCallback(async (page: number = 1, reset: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageJobs = filteredJobs.slice(startIndex, endIndex);

      setState(prev => ({
        ...prev,
        jobs: reset ? pageJobs : [...prev.jobs, ...pageJobs],
        loading: false,
        totalCount: filteredJobs.length,
        hasMore: endIndex < filteredJobs.length,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      }));
    }
  }, [filteredJobs, pageSize]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchJobs(nextPage, false);
    }
  }, [currentPage, state.loading, state.hasMore, fetchJobs]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    fetchJobs(1, true);
  }, [fetchJobs]);

  // Create job function
  const createJob = useCallback(async (jobData: CreateJobData): Promise<Job> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new job object
      const newJob: Job = {
        id: `job-${Date.now()}`,
        ...jobData,
        employerId: 'current-user-id', // In real app, get from auth context
        status: 'active',
        isBoosted: false,
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, this would make an API call to create the job
      // For demo purposes, we'll just add it to the local state
      console.log('Creating job:', newJob);

      // Add to beginning of jobs array for immediate visibility
      setState(prev => ({
        ...prev,
        jobs: [newJob, ...prev.jobs],
        totalCount: prev.totalCount + 1,
      }));

      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job. Please try again.');
    }
  }, []);

  // Updated Apply for job function - now using the actual service
  const applyForJob = useCallback(async (jobId: string, applicationData: ApplyJobData) => {
    try {
      // Call the actual API service instead of just console.log
      const result = await jobsService.applyForJob(jobId, applicationData);
      
      return {
        success: true,
        applicationId: result.id,
        message: 'Application submitted successfully!'
      };
    } catch (error) {
      console.error('Error applying for job:', error);
      throw new Error('Failed to submit application. Please try again.');
    }
  }, []);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      setCurrentPage(1);
      setState(prev => ({ ...prev, jobs: [] }));
      fetchJobs(1, true);
    }
  }, [filters, autoFetch, fetchJobs]);

  // Update jobs when paginated jobs change (for initial load)
  useEffect(() => {
    if (currentPage === 1) {
      setState(prev => ({
        ...prev,
        jobs: paginatedJobs,
        totalCount: filteredJobs.length,
        hasMore: paginatedJobs.length < filteredJobs.length,
      }));
    }
  }, [paginatedJobs, filteredJobs.length, currentPage]);

  return {
    ...state,
    loadMore,
    refresh,
    createJob,
    applyForJob,
    currentPage,
    isFirstPage: currentPage === 1,
    totalPages: Math.ceil(filteredJobs.length / pageSize),
  };
}

// New dedicated hook for job applications
export function useJobApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const applyForJob = useCallback(async (jobId: string, applicationData: ApplyJobData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the actual API service
      const result = await jobsService.applyForJob(jobId, applicationData);
      
      setSuccess(true);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    applyForJob,
    loading,
    error,
    success,
    reset
  };
}

// FIXED: Enhanced useJob hook with better error handling and fallback
export function useJob(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setError('Job ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // First try to find the job in demoJobs
      let foundJob = demoJobs.find(j => j.id === jobId);
      
      // If not found, try to find by converting jobId to different formats
      if (!foundJob) {
        // Try to find by ID without prefix
        const idWithoutPrefix = jobId.replace(/^job-/, '');
        foundJob = demoJobs.find(j => j.id === idWithoutPrefix || j.id === `job-${idWithoutPrefix}`);
      }
      
      // If still not found, try to find by index (if jobId is a number)
      if (!foundJob && !isNaN(Number(jobId))) {
        const index = parseInt(jobId) - 1;
        if (index >= 0 && index < demoJobs.length) {
          foundJob = demoJobs[index];
        }
      }

      if (!foundJob) {
        console.error('Job not found. Available jobs:', demoJobs.map(j => ({ id: j.id, title: j.title })));
        console.error('Looking for job ID:', jobId);
        throw new Error(`Job with ID "${jobId}" not found`);
      }

      setJob(foundJob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job';
      setError(errorMessage);
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refresh: fetchJob,
  };
}

// Enhanced useJobApplications hook with better error handling
export function useJobApplications(jobId?: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!jobId) {
      setApplications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Filter applications for the specific job
      const jobApplications = demoApplications.filter(app => app.jobId === jobId);
      setApplications(jobApplications);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch applications';
      setError(errorMessage);
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: JobApplication['status']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status, updatedAt: new Date().toISOString() }
            : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    updateApplicationStatus,
    refresh: fetchApplications,
  };
}