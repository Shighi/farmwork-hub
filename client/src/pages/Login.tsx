import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Sprout, Users, Briefcase, MapPin } from 'lucide-react';

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFeatures, setShowFeatures] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      title: "Find Agricultural Jobs",
      description: "Access thousands of farming and agribusiness opportunities across Africa"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Connect with Employers",
      description: "Build relationships with verified agricultural employers and farm owners"
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      title: "Location-Based Matching",
      description: "Find jobs near you or explore opportunities in other regions"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="flex min-h-screen">
        {/* Left side - Features showcase */}
        <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-center relative overflow-hidden ${showFeatures ? '' : 'lg:w-0'}`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 right-32 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Sprout className="w-10 h-10 text-white mr-3" />
                <h1 className="text-3xl font-bold text-white">FarmWork Hub</h1>
              </div>
              <p className="text-green-100 text-xl">
                Connecting Agricultural Talent Across Africa
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-green-100">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <p className="text-white text-sm">
                "FarmWork Hub has revolutionized how we find skilled agricultural workers. 
                The platform is easy to use and connects us with qualified candidates quickly."
              </p>
              <div className="mt-3">
                <p className="text-green-200 font-medium">Sarah Mwangi</p>
                <p className="text-green-200 text-sm">Farm Manager, Nairobi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sprout className="w-8 h-8 text-green-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">FarmWork Hub</h1>
              </div>
              <p className="text-gray-600">Welcome back to your agricultural career platform</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <LoginForm />

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Demo credentials info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Worker:</strong> worker@farmwork.com / password123</p>
                <p><strong>Employer:</strong> employer@farmwork.com / password123</p>
                <p><strong>Admin:</strong> admin@farmwork.com / password123</p>
              </div>
            </div>

            {/* Back to home link */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;