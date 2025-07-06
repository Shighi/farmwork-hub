import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layout Components - Fixed imports to use named exports
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import CookieBanner from './components/common/CookieBanner';

// Page Components
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import { Profile } from './pages/Profile'; // Assuming this is also a named export
import { Dashboard } from './pages/Dashboard'; // Assuming this is also a named export
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/About';
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import CookiePolicy from './pages/Cookie';
import ContactForm from './pages/Contact';



// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

// Main App Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// App Content Component (inside AuthProvider)
const AppContent: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          } 
        />
        <Route 
          path="/jobs" 
          element={
            <AppLayout>
              <Jobs />
            </AppLayout>
          } 
        />

        <Route 
          path="/jobs/:id" 
          element={
            <AppLayout>
              <JobDetails />
            </AppLayout>
          } 
        />

         <Route 
          path="/about" 
          element={
            <AppLayout>
              <AboutUs />
            </AppLayout>
          } 
        />

        <Route 
          path="/privacy" 
          element={
            <AppLayout>
              <PrivacyPolicy />
            </AppLayout>
          } 
        />

        <Route 
          path="/terms" 
          element={
            <AppLayout>
              <TermsOfService />
            </AppLayout>
          } 
        />

        <Route 
          path="/cookies" 
          element={
            <AppLayout>
              <CookiePolicy />
            </AppLayout>
          } 
        />

        <Route
          path="/contact"
          element={
            <AppLayout>
              <ContactForm />
            </AppLayout>
          }
        />

        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <PostJob />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* GDPR Cookie Notice */}
          <CookieBanner />
    </Router>

    
  );
};

// Auth Redirect Component - redirects authenticated users away from auth pages
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;