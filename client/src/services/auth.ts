// src/services/auth.ts
import apiService from './api';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export class AuthService {
  private isUsingDemo = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL;

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.LOGIN, 
        credentials
      );
      
      if (response.success && response.data.token) {
        // Store both tokens
        apiService.setToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.REGISTER, 
        userData
      );
      
      if (response.success && response.data.token) {
        // Store both tokens
        apiService.setToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(API_ENDPOINTS.AUTH.ME);
      
      if (response.success) {
        // Update stored user data
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user');
    } catch (error) {
      // If token is invalid, clear storage
      this.clearAuthData();
      throw error instanceof Error ? error : new Error('Failed to get user');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Password reset failed');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
        token, 
        password 
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Password reset failed');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );
      
      if (response.success && response.data.token) {
        apiService.setToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        return response.data.token;
      }
      
      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      this.clearAuthData();
      throw error instanceof Error ? error : new Error('Token refresh failed');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private clearAuthData(): void {
    apiService.removeToken();
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
}

export const authService = new AuthService();