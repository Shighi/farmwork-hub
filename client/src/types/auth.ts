// Export the UserType as a separate type
export type UserType = 'worker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  userType: UserType;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  experience?: string;
  education?: string;
  preferredJobTypes?: string[];
  expectedSalary?: string;
  availability?: string;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

// Updated to match AuthContext implementation
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Changed from 'loading' to 'isLoading' to match context
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  location: string;
  userType: 'worker' | 'employer';
  bio?: string;
  skills?: string[];
}

// Updated to match service implementation
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string; // Added optional refresh token
  message?: string; // Made optional as it might not always be present
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  profilePicture?: string;
  experience?: string;
  education?: string;
  preferredJobTypes?: string[];
  expectedSalary?: string;
  availability?: string;
}

// Additional types that might be useful based on your implementation
export interface TokenRefreshResponse {
  token: string;
  refreshToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Auth context value interface (exported from context, but useful to have here too)
export interface AuthContextValue extends AuthState {
  loading: boolean; // Alias for isLoading for backward compatibility
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}