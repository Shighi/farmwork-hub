import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { validateEmail, validatePassword } from '../utils/validators';

// Demo user data for fallback before backend setup
const DEMO_USERS = [
  {
    id: '1',
    email: 'worker@farmwork.com',
    firstName: 'John',
    lastName: 'Ochieng',
    phoneNumber: '+254712345678',
    location: 'Nairobi, Kenya',
    userType: 'worker' as const,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Experienced farm worker with 5 years in crop cultivation and livestock management.',
    skills: ['Crop Cultivation', 'Livestock Management', 'Irrigation Systems'],
    experience: '5 years of experience in agricultural operations',
    education: 'Certificate in Agricultural Science',
    preferredJobTypes: ['Crop Cultivation', 'Livestock Management'],
    expectedSalary: 'KES 25,000 - 35,000',
    availability: 'Full-time',
    isVerified: true,
    rating: 4.8,
    totalRatings: 24,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-06-20T00:00:00.000Z',
  },
  {
    id: '2',
    email: 'employer@farmwork.com',
    firstName: 'Sarah',
    lastName: 'Mwangi',
    phoneNumber: '+254723456789',
    location: 'Nakuru, Kenya',
    userType: 'employer' as const,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Owner of Green Valley Farm. Looking for dedicated workers to join our agricultural operations.',
    skills: [],
    experience: '10 years of farm management experience',
    education: 'Bachelor of Science in Agriculture',
    preferredJobTypes: [],
    expectedSalary: '',
    availability: '',
    isVerified: true,
    rating: 4.9,
    totalRatings: 18,
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-06-25T00:00:00.000Z',
  },
  {
    id: '3',
    email: 'admin@farmwork.com',
    firstName: 'David',
    lastName: 'Kipkoech',
    phoneNumber: '+254734567890',
    location: 'Eldoret, Kenya',
    userType: 'admin' as const,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'FarmWork Hub Administrator',
    skills: [],
    experience: 'System Administrator',
    education: 'Bachelor of Science in Computer Science',
    preferredJobTypes: [],
    expectedSalary: '',
    availability: '',
    isVerified: true,
    rating: 5.0,
    totalRatings: 5,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-30T00:00:00.000Z',
  },
];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export interface AuthContextValue extends AuthState {
  // Add the missing loading property by aliasing isLoading
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          // In production, you would validate the token with the backend
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate input
      if (!validateEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!credentials.password) {
        throw new Error('Password is required');
      }

      // Demo authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      const user = DEMO_USERS.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Demo password check (in production, this would be handled by backend)
      if (credentials.password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      // Store auth data
      const token = `demo_token_${user.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate input
      if (!validateEmail(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(data.password)) {
        throw new Error(`Password must be at least 8 characters long`);
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!data.firstName?.trim() || !data.lastName?.trim()) {
        throw new Error('First name and last name are required');
      }

      if (!data.phoneNumber?.trim()) {
        throw new Error('Phone number is required');
      }

      if (!data.userType) {
        throw new Error('Please select a user type');
      }

      // Demo registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // Check if email already exists
      const existingUser = DEMO_USERS.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Email address is already registered');
      }

      // Create new user
      const newUser: User = {
        id: `demo_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        location: data.location || '',
        userType: data.userType,
        profilePicture: '',
        bio: data.bio || '',
        skills: data.skills || [],
        experience: '',
        education: '',
        preferredJobTypes: [],
        expectedSalary: '',
        availability: '',
        isVerified: false,
        rating: 0,
        totalRatings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store auth data
      const token = `demo_token_${newUser.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

      dispatch({ type: 'AUTH_SUCCESS', payload: { user: newUser, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Clear other user-specific data
    localStorage.removeItem(STORAGE_KEYS.SEARCH_FILTERS);

    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    try {
      // Demo profile update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUser = {
        ...state.user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

      dispatch({ type: 'UPDATE_USER', payload: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Demo forgot password - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In demo mode, we'll just simulate success
      // In production, this would send an email with reset link
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Demo password reset - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would validate the token and update the password
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      throw new Error(errorMessage);
    }
  };

  const refreshUser = async () => {
    if (!state.token) {
      throw new Error('No authentication token found');
    }

    try {
      // Demo refresh user - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // In production, this would fetch updated user data from the backend
      // For demo purposes, we'll just update the updatedAt timestamp
      if (state.user) {
        const updatedUser = {
          ...state.user,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: { updatedAt: updatedUser.updatedAt } });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh user data';
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextValue = {
    ...state,
    loading: state.isLoading, // Map isLoading to loading for backward compatibility
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo credentials for testing:
// Email: worker@farmwork.com or employer@farmwork.com or admin@farmwork.com
// Password: password123