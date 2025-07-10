// src/services/applications.ts
import apiService from './api';
import { JobApplication } from '../types/jobs';
import { API_ENDPOINTS } from '../utils/constants';

export interface ApplicationFilters {
  status?: string;
  jobId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApplicationStatusUpdate {
  status: string;
  notes?: string;
}

export class ApplicationsService {
  /**
   * Get current user's applications (for workers)
   */
  async getMyApplications(filters?: ApplicationFilters): Promise<JobApplication[]> {
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
        ? `${API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS}?${queryParams.toString()}` 
        : API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS;
        
      const response = await apiService.get<JobApplication[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch applications');
    }
  }

  /**
   * Get a specific application by ID
   */
  async getApplicationById(id: string): Promise<JobApplication> {
    try {
      const response = await apiService.get<JobApplication>(API_ENDPOINTS.APPLICATIONS.DETAIL(id));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch application');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch application');
    }
  }

  /**
   * Withdraw an application
   */
  async withdrawApplication(id: string): Promise<void> {
    try {
      const response = await apiService.delete(API_ENDPOINTS.APPLICATIONS.WITHDRAW(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to withdraw application');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to withdraw application');
    }
  }

  /**
   * Get applications for a specific job (for employers)
   */
  async getApplicationsByJob(jobId: string, filters?: ApplicationFilters): Promise<JobApplication[]> {
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
        ? `${API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId)}?${queryParams.toString()}` 
        : API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId);
        
      const response = await apiService.get<JobApplication[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch job applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch job applications');
    }
  }

  /**
   * Update application status (for employers)
   */
  async updateApplicationStatus(id: string, statusUpdate: ApplicationStatusUpdate): Promise<JobApplication> {
    try {
      const response = await apiService.put<JobApplication>(
        API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id),
        statusUpdate
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update application status');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update application status');
    }
  }

  /**
   * Get all applications (admin only)
   */
  async getAllApplications(filters?: ApplicationFilters): Promise<JobApplication[]> {
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
        ? `${API_ENDPOINTS.APPLICATIONS.ALL}?${queryParams.toString()}` 
        : API_ENDPOINTS.APPLICATIONS.ALL;
        
      const response = await apiService.get<JobApplication[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch all applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch all applications');
    }
  }

  /**
   * Bulk update application statuses (admin/employer functionality)
   */
  async bulkUpdateApplications(
    applicationIds: string[], 
    statusUpdate: ApplicationStatusUpdate
  ): Promise<JobApplication[]> {
    try {
      const response = await apiService.put<JobApplication[]>(
        '/bulk-update', // You may need to add this endpoint to your constants
        {
          applicationIds,
          ...statusUpdate
        }
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to bulk update applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to bulk update applications');
    }
  }

  /**
   * Get application statistics (for dashboard)
   */
  async getApplicationStats(filters?: { startDate?: string; endDate?: string; jobId?: string }): Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
    shortlisted: number;
    interviewScheduled: number;
  }> {
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
        ? `/stats?${queryParams.toString()}` 
        : '/stats';
        
      const response = await apiService.get<{
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
        withdrawn: number;
        shortlisted: number;
        interviewScheduled: number;
      }>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch application statistics');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch application statistics');
    }
  }
}

// Create singleton instance
const applicationsService = new ApplicationsService();
export default applicationsService;