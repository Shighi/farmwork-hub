// src/services/jobs.ts
import apiService from './api';
import { Job, JobFilters, CreateJobData, JobApplication } from '../types/jobs';
import { API_ENDPOINTS } from '../utils/constants';



export class JobsService {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = queryParams.toString() 
        ? `${API_ENDPOINTS.JOBS.LIST}?${queryParams.toString()}` 
        : API_ENDPOINTS.JOBS.LIST;
        
      const response = await apiService.get<Job[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch jobs');
    }
  }

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await apiService.get<Job>(API_ENDPOINTS.JOBS.DETAIL(id));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch job');
    }
  }

  async createJob(jobData: CreateJobData): Promise<Job> {
    try {
      const response = await apiService.post<Job>(API_ENDPOINTS.JOBS.CREATE, jobData);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create job');
    }
  }

  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    try {
      const response = await apiService.put<Job>(API_ENDPOINTS.JOBS.UPDATE(id), jobData);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update job');
    }
  }

  async deleteJob(id: string): Promise<void> {
    try {
      const response = await apiService.delete(API_ENDPOINTS.JOBS.DELETE(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete job');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete job');
    }
  }

  // Updated applyForJob method with file upload support
  async applyForJob(jobId: string, applicationData: { 
    coverLetter: string; 
    proposedSalary?: number;
    resume?: File;
    additionalDocuments?: File[];
  }): Promise<JobApplication> {
    try {
      // Check if we have files to upload
      const hasFiles = applicationData.resume || (applicationData.additionalDocuments && applicationData.additionalDocuments.length > 0);
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        formData.append('coverLetter', applicationData.coverLetter);
        
        if (applicationData.proposedSalary) {
          formData.append('proposedSalary', applicationData.proposedSalary.toString());
        }
        
        if (applicationData.resume) {
          formData.append('resume', applicationData.resume);
        }
        
        if (applicationData.additionalDocuments) {
          applicationData.additionalDocuments.forEach((file, index) => {
            formData.append(`additionalDocuments[${index}]`, file);
          });
        }

        // Get the API base URL - you'll need to define this constant
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
        
        // Use fetch directly for FormData to handle file uploads
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS.APPLY(jobId)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth token
            // Don't set Content-Type header - let browser set it for FormData
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          return result.data;
        }
        
        throw new Error(result.message || 'Failed to apply for job');
      } else {
        // Use regular API service for non-file uploads
        const response = await apiService.post<JobApplication>(
          API_ENDPOINTS.JOBS.APPLY(jobId), 
          {
            coverLetter: applicationData.coverLetter,
            proposedSalary: applicationData.proposedSalary
          }
        );
        
        if (response.success) {
          return response.data;
        }
        
        throw new Error(response.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error instanceof Error ? error : new Error('Failed to apply for job');
    }
  }

  // Alternative simpler version if you're not handling file uploads yet
  // You can use this instead of the above method if you don't need file uploads
  async applyForJobSimple(jobId: string, applicationData: { 
    coverLetter: string; 
    proposedSalary?: number 
  }): Promise<JobApplication> {
    try {
      const response = await apiService.post<JobApplication>(
        API_ENDPOINTS.JOBS.APPLY(jobId), 
        applicationData
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to apply for job');
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error instanceof Error ? error : new Error('Failed to apply for job');
    }
  }

  async getMyPostedJobs(): Promise<Job[]> {
    try {
      const response = await apiService.get<Job[]>(API_ENDPOINTS.JOBS.MY_POSTED_JOBS);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch your posted jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch your posted jobs');
    }
  }

  async getMyAppliedJobs(): Promise<Job[]> {
    try {
      const response = await apiService.get<Job[]>(API_ENDPOINTS.JOBS.MY_APPLIED_JOBS);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch your applied jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch your applied jobs');
    }
  }

  async getFeaturedJobs(): Promise<Job[]> {
    try {
      const response = await apiService.get<Job[]>(API_ENDPOINTS.JOBS.FEATURED);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch featured jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch featured jobs');
    }
  }

  async searchJobs(query: string, filters?: JobFilters): Promise<Job[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `${API_ENDPOINTS.JOBS.SEARCH}?${queryParams.toString()}`;
      const response = await apiService.get<Job[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search jobs');
    }
  }

  async boostJob(id: string): Promise<Job> {
    try {
      const response = await apiService.post<Job>(API_ENDPOINTS.JOBS.BOOST(id));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to boost job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to boost job');
    }
  }

  async featureJob(id: string): Promise<Job> {
    try {
      const response = await apiService.post<Job>(API_ENDPOINTS.JOBS.FEATURE(id));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to feature job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to feature job');
    }
  }

  async getJobCategories(): Promise<string[]> {
    try {
      // First try to get categories from backend
      const response = await apiService.get<string[]>('/jobs/categories');
      
      if (response.success) {
        return response.data;
      }
      
      // If backend doesn't have categories endpoint, use local constants
      const { JOB_CATEGORIES } = await import('../utils/constants');
      return JOB_CATEGORIES;
    } catch (error) {
      console.error('Failed to fetch job categories:', error);
      // Fallback to local constants
      const { JOB_CATEGORIES } = await import('../utils/constants');
      return JOB_CATEGORIES;
    }
  }

  async getRecommendedJobs(userId?: string): Promise<Job[]> {
    try {
      const endpoint = userId ? `/jobs/recommended/${userId}` : '/jobs/recommended';
      const response = await apiService.get<Job[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      // If no recommendations endpoint, return recent jobs
      return this.getJobs({ limit: 3 });
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
      // Fallback to recent jobs
      try {
        return await this.getJobs({ limit: 3 });
      } catch {
        return [];
      }
    }
  }
}

export const jobsService = new JobsService();