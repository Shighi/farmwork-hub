import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/auth';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

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

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            dispatch({ type: 'UPDATE_USER', payload: currentUser });
          } catch (error) {
            // Token is invalid, logout
            dispatch({ type: 'LOGOUT' });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const { user, token } = await authService.login(credentials);
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
      const { user, token } = await authService.register(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    try {
      // This would be handled by a user service
      // For now, we'll just update the local state
      const updatedUser = {
        ...state.user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await authService.resetPassword(token, password);
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
      const user = await authService.getCurrentUser();
      dispatch({ type: 'UPDATE_USER', payload: user });
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
    loading: state.isLoading,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}