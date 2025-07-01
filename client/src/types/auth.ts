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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
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

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
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