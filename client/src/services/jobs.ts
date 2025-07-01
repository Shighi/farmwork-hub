// src/services/jobs.ts
import apiService from './api';
import { Job, JobFilters, CreateJobData, JobApplication } from '../types/jobs';
import { demoJobs, demoApplications } from '../data/demoData';

export class JobsService {
  private isUsingDemo = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

  async getJobs(filters?: JobFilters): Promise<Job[]> {
    if (this.isUsingDemo) {
      // Demo mode - filter demo jobs
      let filteredJobs = [...demoJobs];

      if (filters) {
        if (filters.location) {
          filteredJobs = filteredJobs.filter(job =>
            job.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }

        if (filters.category) {
          filteredJobs = filteredJobs.filter(job =>
            job.category.toLowerCase() === filters.category!.toLowerCase()
          );
        }

        if (filters.jobType) {
          filteredJobs = filteredJobs.filter(job =>
            job.jobType === filters.jobType
          );
        }

        // Fixed: Use the correct property names that exist in JobFilters
        if (filters.salaryMin !== undefined) {
          filteredJobs = filteredJobs.filter(job =>
            job.salary >= filters.salaryMin!
          );
        }

        if (filters.salaryMax !== undefined) {
          filteredJobs = filteredJobs.filter(job =>
            job.salary <= filters.salaryMax!
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredJobs = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
          );
        }
      }

      // Sort by creation date (newest first)
      filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return filteredJobs;
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
    if (this.isUsingDemo) {
      const job = demoJobs.find(j => j.id === id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    }

    try {
      const response = await apiService.get<Job>(`/jobs/${id}`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch job');
    }
  }

  async createJob(jobData: CreateJobData): Promise<Job> {
    if (this.isUsingDemo) {
      const newJob: Job = {
        id: `demo-job-${Date.now()}`,
        ...jobData,
        employerId: 'demo-employer-1', // In real app, get from auth context
        // Fixed: Create a proper User object with all required properties
        employer: {
          id: 'demo-employer-1',
          firstName: 'Demo',
          lastName: 'Employer',
          email: 'demo.employer@example.com',
          phoneNumber: '+254700000001',
          location: 'Nairobi, Kenya',
          userType: 'employer',
          profilePicture: '',
          bio: 'Demo employer account',
          skills: ['Farm Management'],
          isVerified: true,
          rating: 4.5,
          totalRatings: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        applicationsCount: 0,
        status: 'active',
        isBoosted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      demoJobs.unshift(newJob);
      return newJob;
    }

    try {
      const response = await apiService.post<Job>('/jobs', jobData);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create job');
    }
  }

  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    if (this.isUsingDemo) {
      const jobIndex = demoJobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }

      const updatedJob: Job = {
        ...demoJobs[jobIndex],
        ...jobData,
        updatedAt: new Date().toISOString(),
      };

      demoJobs[jobIndex] = updatedJob;
      return updatedJob;
    }

    try {
      const response = await apiService.put<Job>(`/jobs/${id}`, jobData);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update job');
    }
  }

  async deleteJob(id: string): Promise<void> {
    if (this.isUsingDemo) {
      const jobIndex = demoJobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }

      demoJobs.splice(jobIndex, 1);
      return;
    }

    try {
      const response = await apiService.delete(`/jobs/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete job');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete job');
    }
  }

  async applyForJob(jobId: string, applicationData: { coverLetter?: string; proposedSalary?: number }): Promise<JobApplication> {
    if (this.isUsingDemo) {
      const job = demoJobs.find(j => j.id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      // Check if already applied
      const existingApplication = demoApplications.find(
        app => app.jobId === jobId && app.applicantId === 'demo-user-1'
      );
      
      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }

      const newApplication: JobApplication = {
        id: `demo-app-${Date.now()}`,
        jobId,
        applicantId: 'demo-user-1',
        // Fixed: Use the complete job object
        job: job,
        status: 'pending',
        coverLetter: applicationData.coverLetter || '',
        proposedSalary: applicationData.proposedSalary,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      demoApplications.push(newApplication);
      
      // Update job applications count
      job.applicationsCount = (job.applicationsCount || 0) + 1;

      return newApplication;
    }

    try {
      const response = await apiService.post<JobApplication>(`/jobs/${jobId}/apply`, applicationData);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to apply for job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to apply for job');
    }
  }

  async getMyJobs(): Promise<Job[]> {
    if (this.isUsingDemo) {
      // Return jobs posted by current demo user
      return demoJobs.filter(job => job.employerId === 'demo-employer-1');
    }

    try {
      const response = await apiService.get<Job[]>('/jobs/my-jobs');
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch your jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch your jobs');
    }
  }

  async boostJob(id: string): Promise<Job> {
    if (this.isUsingDemo) {
      const jobIndex = demoJobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }

      const updatedJob: Job = {
        ...demoJobs[jobIndex],
        isBoosted: true,
        updatedAt: new Date().toISOString(),
      };

      demoJobs[jobIndex] = updatedJob;
      return updatedJob;
    }

    try {
      const response = await apiService.post<Job>(`/jobs/${id}/boost`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to boost job');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to boost job');
    }
  }

  async getJobCategories(): Promise<string[]> {
    if (this.isUsingDemo) {
      // Fixed: Use Array.from to handle Set iteration for older TypeScript targets
      const categoriesSet = new Set(demoJobs.map(job => job.category));
      const categories = Array.from(categoriesSet);
      return categories.sort();
    }

    try {
      const response = await apiService.get<string[]>('/jobs/categories');
      
      if (response.success) {
        return response.data;
      }
      
      return []; // Return empty array if fails
    } catch (error) {
      console.error('Failed to fetch job categories:', error);
      return [];
    }
  }

  async getRecommendedJobs(userId: string): Promise<Job[]> {
    if (this.isUsingDemo) {
      // Simple recommendation: return first 3 jobs
      return demoJobs.slice(0, 3);
    }

    try {
      const response = await apiService.get<Job[]>(`/jobs/recommended/${userId}`);
      
      if (response.success) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch recommended jobs:', error);
      return [];
    }
  }
}

export const jobsService = new JobsService();