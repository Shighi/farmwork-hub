import { useState, useEffect, useCallback, useMemo } from 'react';
import { Job, JobFilters, JobApplication, ApplyJobData, CreateJobData } from '../types/jobs';
import { PAGINATION } from '../utils/constants';
import { demoJobs, demoApplications } from '../data/demoData';

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

  // Apply for job function
  const applyForJob = useCallback(async (jobId: string, applicationData: ApplyJobData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to submit the application
      // For demo purposes, we'll just log the application data
      console.log('Applying for job:', {
        jobId,
        applicationData,
        timestamp: new Date().toISOString()
      });

      // Simulate success - in a real app, you'd handle the API response
      return {
        success: true,
        applicationId: `app-${Date.now()}`,
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

export function useJob(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const foundJob = demoJobs.find(j => j.id === jobId);
      if (!foundJob) {
        throw new Error('Job not found');
      }

      setJob(foundJob);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch job');
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

export function useJobApplications(jobId?: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Filter applications for the specific job
      const jobApplications = demoApplications.filter(app => app.jobId === jobId);
      setApplications(jobApplications);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
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