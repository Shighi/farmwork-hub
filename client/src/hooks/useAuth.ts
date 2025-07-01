import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * This is a re-export from the AuthContext for consistency
 * and to provide a single source of truth for auth operations
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook to check if user has specific permissions
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    switch (permission) {
      case 'post_job':
        return user.userType === 'employer' || user.userType === 'admin';
      case 'apply_job':
        return user.userType === 'worker';
      case 'admin_access':
        return user.userType === 'admin';
      case 'view_applications':
        return user.userType === 'employer' || user.userType === 'admin';
      case 'manage_users':
        return user.userType === 'admin';
      case 'boost_jobs':
        return user.userType === 'employer' || user.userType === 'admin';
      default:
        return false;
    }
  };
  
  const canPostJob = hasPermission('post_job');
  const canApplyForJob = hasPermission('apply_job');
  const canAccessAdmin = hasPermission('admin_access');
  const canViewApplications = hasPermission('view_applications');
  const canManageUsers = hasPermission('manage_users');
  const canBoostJobs = hasPermission('boost_jobs');
  
  return {
    hasPermission,
    canPostJob,
    canApplyForJob,
    canAccessAdmin,
    canViewApplications,
    canManageUsers,
    canBoostJobs,
  };
}

/**
 * Hook to get user role-based navigation items
 */
export function useUserNavigation() {
  const { user, isAuthenticated } = useAuth();
  const { canPostJob, canAccessAdmin } = usePermissions();
  
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', href: '/', icon: 'home' },
      { name: 'Jobs', href: '/jobs', icon: 'briefcase' },
    ];
    
    if (!isAuthenticated) {
      return [
        ...baseItems,
        { name: 'Login', href: '/login', icon: 'log-in' },
        { name: 'Register', href: '/register', icon: 'user-plus' },
      ];
    }
    
    const authenticatedItems = [
      ...baseItems,
      { name: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
      { name: 'Profile', href: '/profile', icon: 'user' },
    ];
    
    if (canPostJob) {
      authenticatedItems.splice(2, 0, { name: 'Post Job', href: '/post-job', icon: 'plus-circle' });
    }
    
    if (user?.userType === 'worker') {
      authenticatedItems.push({ name: 'Applications', href: '/applications', icon: 'file-text' });
    }
    
    if (canAccessAdmin) {
      authenticatedItems.push({ name: 'Admin', href: '/admin', icon: 'shield' });
    }
    
    return authenticatedItems;
  };
  
  return {
    navigationItems: getNavigationItems(),
    userType: user?.userType,
    isAuthenticated,
  };
}