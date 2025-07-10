import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layout Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import CookieBanner from './components/common/CookieBanner';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import JobApplication from './pages/JobApplication';
import PostJob from './pages/PostJob';
import { Profile } from './pages/Profile';
import Dashboard  from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import CookiePolicy from './pages/Cookie';
import CareerTips from './pages/CareerTips';
import SafetyGuidelines from './pages/Safety';
import SuccessStories from './pages/SuccessStories';
import ContactForm from './pages/ContactUs';
import BestPractices from './pages/Bestpractices';
import FAQAccordion from './pages/Faq';
import Resumeform from './pages/ResumeBuilder';
import RecruitmentTips from './pages/RecruitmentTips';

// Auth Protection
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout wrapper with Header, Footer & CookieBanner
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <CookieBanner />
      <Footer />
    </div>
  );
};

// Auth redirect wrapper for login/register
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// App Router
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
        
        {/* Job Application Route - Protected */}
        <Route 
          path="/jobs/:id/apply" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <JobApplication />
              </AppLayout>
            </ProtectedRoute>
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

        {/* Contact Routes - Using ContactUs component for /contact-us and ContactForm for /contact */}
        <Route 
          path="/contact-us" 
          element={
            <AppLayout>
              <ContactUs />
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
          path="/resources/career-tips"
          element={
            <AppLayout>
              <CareerTips />
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
          path="/safety"
          element={
            <AppLayout>
              <SafetyGuidelines />
            </AppLayout>
          }
        />
        <Route
          path="/success-stories"
          element={
            <AppLayout>
              <SuccessStories />
            </AppLayout>
          }
        />
        <Route
          path="/resources/practices"
          element={
            <AppLayout>
              <BestPractices />
            </AppLayout>
          }
        />

        <Route
          path="/faq"
          element={
            <AppLayout>
              <FAQAccordion />
            </AppLayout>
          }
        />

        <Route
          path="/tools/resume-builder"
          element={
            <AppLayout>
              <Resumeform />
            </AppLayout>
          }
        />

        <Route
          path="/resources/recruitment"
          element={
            <AppLayout>
              <RecruitmentTips />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Main App
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