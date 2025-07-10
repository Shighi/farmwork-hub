import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Settings, 
  Plus, 
  Users, 
  BarChart3,
  FileText,
  Bell,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  MessageSquare,
  TrendingUp,
  Star,
  Shield,
  Database,
  Activity,
  LucideIcon
} from 'lucide-react';

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: 'worker' | 'employer' | 'admin';
  avatar: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  salary: number;
  salaryType: string;
  startDate: string;
  endDate: string;
  workersNeeded: number;
  description: string;
  category: string;
  jobType: string;
  status: string;
  skills: string[];
  createdAt: string;
  isBoosted: boolean;
  applicationsCount: number;
}

interface Application {
  id: number;
  jobId: number;
  status: string;
  appliedAt: string;
  coverLetter: string;
  proposedSalary: number;
  job: Job;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavItems {
  worker: NavItem[];
  employer: NavItem[];
  admin: NavItem[];
}

// Mock data for demonstration
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'worker',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&faceindex=1'
};

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Apple Harvest Worker',
    location: 'Nairobi, Kenya',
    salary: 15000,
    salaryType: 'per day',
    startDate: '2025-08-01',
    endDate: '2025-09-15',
    workersNeeded: 20,
    description: 'Seeking experienced workers for apple harvesting season. Must be able to work in outdoor conditions.',
    category: 'Harvesting',
    jobType: 'Seasonal',
    status: 'active',
    skills: ['Physical fitness', 'Harvesting experience', 'Team work'],
    createdAt: '2025-07-01',
    isBoosted: true,
    applicationsCount: 45
  },
  {
    id: 2,
    title: 'Farm Equipment Operator',
    location: 'Nakuru, Kenya',
    salary: 25000,
    salaryType: 'per day',
    startDate: '2025-07-15',
    endDate: '2025-12-31',
    workersNeeded: 5,
    description: 'Looking for skilled tractor operators for various farm operations.',
    category: 'Equipment Operation',
    jobType: 'Permanent',
    status: 'active',
    skills: ['Tractor operation', 'Equipment maintenance', 'Safety protocols'],
    createdAt: '2025-06-15',
    isBoosted: false,
    applicationsCount: 12
  }
];

const mockApplications: Application[] = [
  {
    id: 1,
    jobId: 1,
    status: 'pending',
    appliedAt: '2025-07-05',
    coverLetter: 'I am very interested in this position and have 3 years of harvesting experience.',
    proposedSalary: 15000,
    job: mockJobs[0]
  }
];

const Dashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleRoleChange = (role: 'worker' | 'employer' | 'admin') => {
    setCurrentUser({ ...currentUser, role });
    setActiveTab('dashboard');
  };

  const renderNavigation = (): NavItem[] => {
    const navItems: NavItems = {
      worker: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'jobs', label: 'Find Jobs', icon: Search },
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ],
      employer: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'post-job', label: 'Post Job', icon: Plus },
        { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
        { id: 'applicants', label: 'Applicants', icon: Users },
        { id: 'profile', label: 'Profile', icon: User }
      ],
      admin: [
        { id: 'dashboard', label: 'Admin Dashboard', icon: Shield },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'jobs', label: 'Job Management', icon: Briefcase },
        { id: 'analytics', label: 'Analytics', icon: Activity },
        { id: 'system', label: 'System Settings', icon: Settings }
      ]
    };

    return navItems[currentUser.role] || navItems.worker;
  };

  const renderWorkerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
        <p className="text-green-100">Ready to find your next opportunity?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
          <p className="text-sm text-gray-600">Active applications</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Profile Views</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">27</div>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Success Rate</h3>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">75%</div>
          <p className="text-sm text-gray-600">Application success</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Job Matches</h3>
        <div className="space-y-4">
          {mockJobs.slice(0, 2).map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.location}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">KES {job.salary.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{job.salaryType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmployerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Employer Dashboard</h2>
        <p className="text-blue-100">Manage your job postings and find the best candidates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Jobs</h3>
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
          <p className="text-sm text-gray-600">Currently hiring</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">87</div>
          <p className="text-sm text-gray-600">Total received</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Hired</h3>
            <CheckCircle className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Success Rate</h3>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">14%</div>
          <p className="text-sm text-gray-600">Hire rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Worker {i}</p>
                    <p className="text-sm text-gray-600">Applied for Apple Harvest</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View details
            </button>
          </div>
          <div className="space-y-3">
            {mockJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.applicationsCount} applications</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{job.workersNeeded} needed</p>
                  <p className="text-sm text-gray-500">5 hired</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-purple-100">Monitor and manage the FarmWork Hub platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Users</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2,341</div>
          <p className="text-sm text-green-600">+12% this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Jobs</h3>
            <Briefcase className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">156</div>
          <p className="text-sm text-green-600">+8% this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,876</div>
          <p className="text-sm text-green-600">+15% this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue</h3>
            <DollarSign className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">KES 89K</div>
          <p className="text-sm text-green-600">+22% this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registered', user: 'Mary Farm', time: '5 minutes ago' },
              { action: 'Job posted', user: 'Green Valley Farm', time: '1 hour ago' },
              { action: 'Application submitted', user: 'John Worker', time: '2 hours ago' },
              { action: 'Job completed', user: 'Sunrise Farm', time: '3 hours ago' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Server Status</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Database</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">API Response</span>
              <span className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Fast (120ms)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Storage</span>
              <span className="flex items-center text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                75% Used
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      switch (currentUser.role) {
        case 'worker':
          return renderWorkerDashboard();
        case 'employer':
          return renderEmployerDashboard();
        case 'admin':
          return renderAdminDashboard();
        default:
          return renderWorkerDashboard();
      }
    }

    // Placeholder for other tabs
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </h2>
        <p className="text-gray-600">This section is under development.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">FarmWork Hub</h1>
            </div>
            
            {/* Role Switcher (for demo purposes) */}
            <div className="flex items-center space-x-4">
              <select 
                value={currentUser.role} 
                onChange={(e) => handleRoleChange(e.target.value as 'worker' | 'employer' | 'admin')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="worker">Worker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-2">
                {renderNavigation().map((item: NavItem) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;