// src/services/users.ts
import apiService from './api';
import { User } from '../types/auth';
import { JobApplication } from '../types/jobs';
import { demoUsers, demoApplications } from '../data/demoData';

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
  private isUsingDemo = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

  async getProfile(userId?: string): Promise<User> {
    if (this.isUsingDemo) {
      const targetUserId = userId || 'demo-user-1'; // Default to current user
      const user = demoUsers.find(u => u.id === targetUserId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    }

    try {
      const endpoint = userId ? `/users/${userId}` : '/users/profile';
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
    if (this.isUsingDemo) {
      const userIndex = demoUsers.findIndex(u => u.id === 'demo-user-1');
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser: User = {
        ...demoUsers[userIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      demoUsers[userIndex] = updatedUser;
      return updatedUser;
    }

    try {
      const response = await apiService.put<User>('/users/profile', data);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  }

  async uploadAvatar(file: File): Promise<{ profilePicture: string }> {
    if (this.isUsingDemo) {
      // In demo mode, simulate upload by creating a object URL
      const profilePicture = URL.createObjectURL(file);
      
      // Update demo user's profile picture
      const userIndex = demoUsers.findIndex(u => u.id === 'demo-user-1');
      if (userIndex !== -1) {
        demoUsers[userIndex].profilePicture = profilePicture;
      }
      
      return { profilePicture };
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiService.uploadFile<{ profilePicture: string }>(
        '/users/upload-avatar',
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

  async getApplications(): Promise<JobApplication[]> {
    if (this.isUsingDemo) {
      // Return applications for current demo user
      return demoApplications.filter(app => app.applicantId === 'demo-user-1');
    }

    try {
      const response = await apiService.get<JobApplication[]>('/applications');
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch applications');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch applications');
    }
  }

  async getApplication(id: string): Promise<JobApplication> {
    if (this.isUsingDemo) {
      const application = demoApplications.find(app => app.id === id);
      if (!application) {
        throw new Error('Application not found');
      }
      return application;
    }

    try {
      const response = await apiService.get<JobApplication>(`/applications/${id}`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch application');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch application');
    }
  }

  async updateApplicationStatus(id: string, status: JobApplication['status']): Promise<JobApplication> {
    if (this.isUsingDemo) {
      const appIndex = demoApplications.findIndex(app => app.id === id);
      if (appIndex === -1) {
        throw new Error('Application not found');
      }

      const updatedApplication: JobApplication = {
        ...demoApplications[appIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      demoApplications[appIndex] = updatedApplication;
      return updatedApplication;
    }

    try {
      const response = await apiService.put<JobApplication>(`/applications/${id}`, { status });
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update application');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update application');
    }
  }

  async withdrawApplication(id: string): Promise<void> {
    if (this.isUsingDemo) {
      const appIndex = demoApplications.findIndex(app => app.id === id);
      if (appIndex === -1) {
        throw new Error('Application not found');
      }

      demoApplications[appIndex].status = 'withdrawn';
      demoApplications[appIndex].updatedAt = new Date().toISOString();
      return;
    }

    try {
      const response = await apiService.delete(`/applications/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to withdraw application');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to withdraw application');
    }
  }

  async getUserRating(userId: string): Promise<{ rating: number; totalRatings: number; reviews: UserRating[] }> {
    if (this.isUsingDemo) {
      const user = demoUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Mock reviews data
      const reviews: UserRating[] = [
        {
          id: '1',
          raterId: 'demo-employer-1',
          ratedUserId: userId,
          rating: 5,
          comment: 'Excellent worker, very reliable and skilled.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: '2',
          raterId: 'demo-employer-2',
          ratedUserId: userId,
          rating: 4,
          comment: 'Good work ethic and punctual.',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ];

      return {
        rating: user.rating,
        totalRatings: user.totalRatings,
        reviews: reviews,
      };
    }

    try {
      const response = await apiService.get<{ rating: number; totalRatings: number; reviews: UserRating[] }>(
        `/users/${userId}/rating`
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
    if (this.isUsingDemo) {
      const newRating: UserRating = {
        id: `rating-${Date.now()}`,
        raterId: 'demo-user-1', // Current user
        ratedUserId: userId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      // Update user's rating (simplified calculation)
      const userIndex = demoUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        const user = demoUsers[userIndex];
        const newTotalRatings = user.totalRatings + 1;
        const newAverageRating = ((user.rating * user.totalRatings) + rating) / newTotalRatings;
        
        demoUsers[userIndex] = {
          ...user,
          rating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
          totalRatings: newTotalRatings,
          updatedAt: new Date().toISOString(),
        };
      }

      return newRating;
    }

    try {
      const response = await apiService.post<UserRating>(`/users/${userId}/rate`, { rating, comment });
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to rate user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to rate user');
    }
  }

  async searchUsers(query: string, userType?: 'worker' | 'employer'): Promise<User[]> {
    if (this.isUsingDemo) {
      let users = demoUsers.filter(user => {
        const matchesQuery = query === '' || 
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase()) ||
          user.location.toLowerCase().includes(query.toLowerCase()) ||
          user.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()));
        
        const matchesType = !userType || user.userType === userType;
        
        return matchesQuery && matchesType;
      });

      return users;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (userType) {
        queryParams.append('type', userType);
      }

      const response = await apiService.get<User[]>(`/users/search?${queryParams.toString()}`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search users');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search users');
    }
  }

  async getEmployerJobs(employerId: string): Promise<any[]> {
    if (this.isUsingDemo) {
      // This would typically be imported from jobs service, but to avoid circular dependency
      // we'll return a simple response
      return [];
    }

    try {
      const response = await apiService.get<any[]>(`/users/${employerId}/jobs`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch employer jobs');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch employer jobs');
    }
  }

  async verifyUser(userId: string): Promise<User> {
    if (this.isUsingDemo) {
      const userIndex = demoUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }


      const updatedUser: User = {
        ...demoUsers[userIndex],
        isVerified: true,
        updatedAt: new Date().toISOString(),
      };

      demoUsers[userIndex] = updatedUser;
      return updatedUser;
    }

    try {
      const response = await apiService.post<User>(`/users/${userId}/verify`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to verify user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to verify user');
    }
  }

  async getNotifications(): Promise<any[]> {
    if (this.isUsingDemo) {
      // Mock notifications
      return [
        {
          id: '1',
          type: 'application',
          title: 'New job application',
          message: 'Someone applied for your Farm Manager position',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: '2',
          type: 'job_match',
          title: 'New job matches your skills',
          message: 'Check out this Agriculture Technician position in Nairobi',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },
        {
          id: '3',
          type: 'rating',
          title: 'You received a new rating',
          message: 'John Doe rated you 5 stars for your excellent work',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ];
    }

    try {
      const response = await apiService.get<any[]>('/users/notifications');
      
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
    if (this.isUsingDemo) {
      // In demo mode, just log the action
      console.log('Marked notification as read:', notificationId);
      return;
    }

    try {
      await apiService.put(`/users/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
}

export const usersService = new UsersService();