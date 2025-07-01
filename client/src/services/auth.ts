// src/services/auth.ts
import apiService from './api';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import { demoUsers } from '../data/demoData';

export class AuthService {
  private isUsingDemo = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    if (this.isUsingDemo) {
      // Demo mode - simulate login
      const user = demoUsers.find(u => u.email === credentials.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In demo mode, accept any password for simplicity
      const token = `demo-token-${user.id}`;
      apiService.setToken(token);
      
      return { user, token };
    }

    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
      
      if (response.success && response.data.token) {
        apiService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    if (this.isUsingDemo) {
      // Demo mode - simulate registration
      const existingUser = demoUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const newUser: User = {
        id: `demo-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || '',
        location: userData.location || '',
        userType: userData.userType,
        profilePicture: '',
        bio: '',
        skills: [],
        isVerified: false,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = `demo-token-${newUser.id}`;
      apiService.setToken(token);
      
      // In a real app, you'd add this to your backend
      demoUsers.push(newUser);
      
      return { user: newUser, token };
    }

    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/register', userData);
      
      if (response.success && response.data.token) {
        apiService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    if (this.isUsingDemo) {
      // Demo mode - get user from token
      const token = localStorage.getItem('token');
      if (!token || !token.startsWith('demo-token-')) {
        throw new Error('No valid session');
      }
      
      const userId = token.replace('demo-token-', '');
      const user = demoUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    }

    try {
      const response = await apiService.get<User>('/auth/me');
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get user');
    }
  }

  async logout(): Promise<void> {
    if (this.isUsingDemo) {
      // Demo mode - just clear token
      apiService.removeToken();
      return;
    }

    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.removeToken();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    if (this.isUsingDemo) {
      // Demo mode - simulate success
      console.log('Demo: Password reset email sent to', email);
      return;
    }

    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Password reset failed');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    if (this.isUsingDemo) {
      // Demo mode - simulate success
      console.log('Demo: Password reset successful');
      return;
    }

    try {
      const response = await apiService.post('/auth/reset-password', { token, password });
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Password reset failed');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}

export const authService = new AuthService();