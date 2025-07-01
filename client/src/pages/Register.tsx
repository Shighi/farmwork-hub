import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Sprout, CheckCircle, Shield, Globe, Zap } from 'lucide-react';

const Register: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<'worker' | 'employer'>('worker');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const benefits = {
    worker: [
      {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        text: "Access to verified agricultural job opportunities"
      },
      {
        icon: <Shield className="w-5 h-5 text-green-600" />,
        text: "Secure payment processing and job protection"
      },
      {
        icon: <Globe className="w-5 h-5 text-green-600" />,
        text: "Connect with employers across Africa"
      },
      {
        icon: <Zap className="w-5 h-5 text-green-600" />,
        text: "Smart job matching based on your skills"
      }
    ],
    employer: [
      {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        text: "Find skilled agricultural workers quickly"
      },
      {
        icon: <Shield className="w-5 h-5 text-green-600" />,
        text: "Verified worker profiles and ratings"
      },
      {
        icon: <Globe className="w-5 h-5 text-green-600" />,
        text: "Reach talent across multiple countries"
      },
      {
        icon: <Zap className="w-5 h-5 text-green-600" />,
        text: "Advanced filtering and job management tools"
      }
    ]
  };

  const stats = [
    { number: "10,000+", label: "Active Job Seekers" },
    { number: "2,500+", label: "Registered Employers" },
    { number: "15", label: "African Countries" },
    { number: "95%", label: "Job Match Success" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="flex min-h-screen">
        {/* Left side - Benefits and stats */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-16 left-16 w-40 h-40 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/3 right-16 w-20 h-20 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Sprout className="w-10 h-10 text-white mr-3" />
                <h1 className="text-3xl font-bold text-white">FarmWork Hub</h1>
              </div>
              <p className="text-green-100 text-xl">
                Join Africa's Leading Agricultural Job Platform
              </p>
            </div>

            {/* Tab selector for benefits */}
            <div className="mb-8">
              <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
                <button
                  onClick={() => setSelectedTab('worker')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === 'worker'
                      ? 'bg-white text-green-700'
                      : 'text-white hover:text-green-200'
                  }`}
                >
                  For Job Seekers
                </button>
                <button
                  onClick={() => setSelectedTab('employer')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === 'employer'
                      ? 'bg-white text-green-700'
                      : 'text-white hover:text-green-200'
                  }`}
                >
                  For Employers
                </button>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              {benefits[selectedTab].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    {benefit.icon}
                  </div>
                  <p className="text-white">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-green-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Success story */}
            <div className="mt-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <p className="text-white text-sm">
                "I found my dream job in sustainable farming through FarmWork Hub. 
                The platform made it easy to showcase my skills and connect with the right employer."
              </p>
              <div className="mt-3">
                <p className="text-green-200 font-medium">James Ochieng</p>
                <p className="text-green-200 text-sm">Agricultural Technician, Kisumu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sprout className="w-8 h-8 text-green-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">FarmWork Hub</h1>
              </div>
              <p className="text-gray-600">Start your agricultural career journey</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join thousands of agricultural professionals</p>
              </div>

              <RegisterForm />

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-green-600 hover:text-green-700">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Countries we serve */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Countries We Serve</h4>
              <div className="text-sm text-green-800">
                <p>Kenya • Nigeria • Ghana • Uganda • Tanzania • Rwanda • Zambia • South Africa • Ethiopia • Malawi • Zimbabwe • Botswana • Cameroon • Senegal • Morocco</p>
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

export default Register;