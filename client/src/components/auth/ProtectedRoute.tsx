import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import type { UserType } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType | UserType[];
  requireVerification?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
  requireVerification = false,
  fallbackPath = '/login'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check user type requirements
  if (requiredUserType) {
    const allowedTypes = Array.isArray(requiredUserType) 
      ? requiredUserType 
      : [requiredUserType];
    
    if (!allowedTypes.includes(user.userType)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-4">
                This page is only available for {
                  Array.isArray(requiredUserType) 
                    ? requiredUserType.join(' and ') 
                    : requiredUserType
                } accounts.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Check verification requirements
  if (requireVerification && !user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Required</h2>
            <p className="text-gray-600 mb-4">
              Please verify your account to access this feature. Check your email for verification instructions.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // TODO: Implement resend verification email
                  console.log('Resending verification email...');
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Resend Verification Email
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

// Type definition for the withAuth function
type WithAuthOptions = Omit<ProtectedRouteProps, 'children'>;

// Higher-order component for easier usage
export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
  
  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  AuthenticatedComponent.displayName = `withAuth(${componentName})`;
  
  return AuthenticatedComponent;
}

// Specialized protected routes for different user types
export const WorkerOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredUserType="worker">
    {children}
  </ProtectedRoute>
);

export const EmployerOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredUserType="employer">
    {children}
  </ProtectedRoute>
);

export const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredUserType="admin">
    {children}
  </ProtectedRoute>
);

export const VerifiedOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requireVerification>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;