// src/services/users.ts
import apiService from './api';
import { User } from '../types/auth';
import { JobApplication } from '../types/jobs';
import { API_ENDPOINTS } from '../utils/constants';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  preferredJobTypes?: string[];
  expectedSalary?: string;
  availability?: string;
}

export interface UserRating {
  id: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserStats {
  totalApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalJobsPosted?: number;
  activeJobsPosted?: number;
  totalHires?: number;
}

export interface Notification {
  id: string;
  type: 'application' | 'job_match' | 'rating' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    userId?: string;
    [key: string]: any;
  };
}

export class UsersService {
  async getProfile(userId?: string): Promise<User> {
    try {
      const endpoint = userId ? `/users/${userId}` : API_ENDPOINTS.USERS.PROFILE;
      const response = await apiService.get<User>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch profile');
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await apiService.put<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
      
      if (response.success) {
        // Update stored user data
        localStorage.setItem('farmwork_user_data', JSON.stringify(response.data));
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  }

  async uploadAvatar(file: File): Promise<{ profilePicture: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiService.uploadFile<{ profilePicture: string }>(
        API_ENDPOINTS.USERS.UPLOAD_AVATAR,
        formData
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to upload avatar');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to upload avatar');
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiService.get<UserStats>(API_ENDPOINTS.USERS.STATS);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user stats');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch user stats');
    }
  }

  async getApplications(): Promise<JobApplication[]> {
    try {
      const response = await apiService.get<JobApplication[]>(API_ENDPOINTS.USERS.APPLICATIONS);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch applications');
    }
  }

  async getPostedJobs(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(API_ENDPOINTS.USERS.POSTED_JOBS);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch posted jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch posted jobs');
    }
  }

  async getWorkHistory(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(API_ENDPOINTS.USERS.WORK_HISTORY);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch work history');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch work history');
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.put(API_ENDPOINTS.USERS.UPDATE_PASSWORD, {
        currentPassword,
        newPassword
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update password');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update password');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const response = await apiService.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete account');
    }
  }

  async getUserRating(userId: string): Promise<{ rating: number; totalRatings: number; reviews: UserRating[] }> {
    try {
      const response = await apiService.get<{ rating: number; totalRatings: number; reviews: UserRating[] }>(
        API_ENDPOINTS.USERS.RATING(userId)
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user rating');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch user rating');
    }
  }

  async rateUser(userId: string, rating: number, comment: string): Promise<UserRating> {
    try {
      const response = await apiService.post<UserRating>(
        API_ENDPOINTS.USERS.RATE_USER(userId), 
        { rating, comment }
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to rate user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to rate user');
    }
  }

  async getWorkers(filters?: { 
    search?: string; 
    skills?: string[]; 
    location?: string; 
    experience?: string;
    rating?: number;
  }): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const endpoint = queryParams.toString() 
        ? `${API_ENDPOINTS.USERS.WORKERS}?${queryParams.toString()}` 
        : API_ENDPOINTS.USERS.WORKERS;
        
      const response = await apiService.get<User[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch workers');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch workers');
    }
  }

  async getEmployers(filters?: { 
    search?: string; 
    location?: string; 
    rating?: number;
  }): Promise<User[]> {
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
        ? `${API_ENDPOINTS.USERS.EMPLOYERS}?${queryParams.toString()}` 
        : API_ENDPOINTS.USERS.EMPLOYERS;
        
      const response = await apiService.get<User[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch employers');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch employers');
    }
  }

  async searchUsers(query: string, userType?: 'worker' | 'employer'): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (userType) {
        queryParams.append('type', userType);
      }

      const endpoint = userType === 'worker' 
        ? `${API_ENDPOINTS.USERS.WORKERS}?${queryParams.toString()}`
        : userType === 'employer'
        ? `${API_ENDPOINTS.USERS.EMPLOYERS}?${queryParams.toString()}`
        : `/users/search?${queryParams.toString()}`;

      const response = await apiService.get<User[]>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search users');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search users');
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get<Notification[]>('/users/notifications');
      
      if (response.success) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await apiService.put(`/users/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await apiService.put('/users/notifications/read-all');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  // Admin functions
  async getAllUsers(filters?: { 
    search?: string; 
    userType?: string; 
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
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
        ? `${API_ENDPOINTS.USERS.ALL_USERS}?${queryParams.toString()}` 
        : API_ENDPOINTS.USERS.ALL_USERS;
        
      const response = await apiService.get<{ users: User[]; total: number; page: number; limit: number }>(endpoint);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch users');
    }
  }

  async verifyUser(userId: string): Promise<User> {
    try {
      const response = await apiService.post<User>(API_ENDPOINTS.USERS.VERIFY_USER(userId));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to verify user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to verify user');
    }
  }

  async suspendUser(userId: string, reason?: string): Promise<User> {
    try {
      const response = await apiService.post<User>(
        API_ENDPOINTS.USERS.SUSPEND_USER(userId),
        { reason }
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to suspend user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to suspend user');
    }
  }

  async activateUser(userId: string): Promise<User> {
    try {
      const response = await apiService.post<User>(API_ENDPOINTS.USERS.ACTIVATE_USER(userId));
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to activate user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to activate user');
    }
  }
}

export const usersService = new UsersService();