import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import JobCard from '../components/jobs/JobCard';
import ApplicationsList from '../components/profile/ApplicationsList';
import { Job } from '../types/jobs';
import { JobApplication } from '../types/users'; // Import from users.ts instead
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  applications: number;
  completedJobs: number;
  totalViews: number;
  averageRating: number;
}

// Extended Job interface for dashboard with views property
interface DashboardJob extends Job {
  views?: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, loading: jobsLoading, refresh } = useJobs();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    completedJobs: 0,
    totalViews: 0,
    averageRating: 0
  });
  const [myJobs, setMyJobs] = useState<DashboardJob[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications'>('overview');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    // Early return if user is null
    if (!user) return;

    try {
      setLoading(true);
      
      // Simulate API calls with demo data
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user.userType === 'employer') {
        // Demo data for employers
        const employerJobs: DashboardJob[] = [
          {
            id: '1',
            title: 'Farm Hand - Vegetable Production',
            description: 'We are looking for experienced farm hands to help with vegetable production...',
            category: 'Farm Labor',
            location: 'Nakuru, Kenya',
            salary: 18000,
            salaryType: 'monthly',
            jobType: 'permanent',
            startDate: '2024-03-01',
            endDate: '2024-12-31',
            workersNeeded: 3,
            skills: ['Crop Management', 'Irrigation', 'Harvesting'],
            requirements: 'Minimum 2 years experience in vegetable farming',
            employerId: user.id,
            status: 'active',
            isBoosted: false,
            createdAt: '2024-02-15',
            updatedAt: '2024-02-15',
            applicationsCount: 12,
            views: 45
          },
          {
            id: '2',
            title: 'Greenhouse Technician',
            description: 'Manage greenhouse operations including climate control and plant care...',
            category: 'Technical',
            location: 'Kiambu, Kenya',
            salary: 25000,
            salaryType: 'monthly',
            jobType: 'permanent',
            startDate: '2024-03-15',
            endDate: '2024-12-31',
            workersNeeded: 1,
            skills: ['Greenhouse Management', 'Plant Care', 'Climate Control'],
            requirements: 'Certificate in horticulture or related field',
            employerId: user.id,
            status: 'active',
            isBoosted: true,
            createdAt: '2024-02-10',
            updatedAt: '2024-02-10',
            applicationsCount: 8,
            views: 32
          }
        ];

        setMyJobs(employerJobs);
        setStats({
          totalJobs: employerJobs.length,
          activeJobs: employerJobs.filter(job => job.status === 'active').length,
          applications: employerJobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0),
          completedJobs: 5,
          totalViews: employerJobs.reduce((sum, job) => sum + (job.views || 0), 0),
          averageRating: 4.8
        });
      } else {
        // Demo data for workers - Updated to match users.ts JobApplication interface
        const workerApplications: JobApplication[] = [
          {
            id: '1',
            jobId: 'job1',
            applicantId: user.id,
            job: { // Required property, not optional
              id: 'job1',
              title: 'Farm Hand - Vegetable Farm',
              description: 'Farm work position',
              category: 'Farm Labor',
              location: 'Nakuru, Kenya',
              salary: 15000,
              salaryType: 'monthly',
              jobType: 'permanent',
              startDate: '2024-03-01',
              workersNeeded: 3,
              skills: [],
              requirements: '',
              employerId: 'emp1',
              status: 'active',
              isBoosted: false,
              createdAt: '2024-02-15',
              updatedAt: '2024-02-15'
            },
            status: 'pending',
            appliedAt: '2024-02-15',
            updatedAt: '2024-02-15',
            coverLetter: 'I am very interested in this position...'
          },
          {
            id: '2',
            jobId: 'job2',
            applicantId: user.id,
            job: { // Required property, not optional
              id: 'job2',
              title: 'Irrigation Technician',
              description: 'Irrigation system maintenance',
              category: 'Technical',
              location: 'Meru, Kenya',
              salary: 25000,
              salaryType: 'monthly',
              jobType: 'permanent',
              startDate: '2024-03-01',
              workersNeeded: 1,
              skills: [],
              requirements: '',
              employerId: 'emp2',
              status: 'active',
              isBoosted: false,
              createdAt: '2024-02-10',
              updatedAt: '2024-02-10'
            },
            status: 'accepted',
            appliedAt: '2024-02-10',
            updatedAt: '2024-02-10',
            coverLetter: 'With my experience in irrigation systems...'
          },
          {
            id: '3',
            jobId: 'job3',
            applicantId: user.id,
            job: { // Required property, not optional
              id: 'job3',
              title: 'Harvest Coordinator',
              description: 'Coordinate harvest activities',
              category: 'Management',
              location: 'Eldoret, Kenya',
              salary: 20000,
              salaryType: 'monthly',
              jobType: 'seasonal',
              startDate: '2024-02-01',
              workersNeeded: 1,
              skills: [],
              requirements: '',
              employerId: 'emp3',
              status: 'active',
              isBoosted: false,
              createdAt: '2024-02-05',
              updatedAt: '2024-02-05'
            },
            status: 'rejected',
            appliedAt: '2024-02-05',
            updatedAt: '2024-02-05',
            coverLetter: 'I would like to apply for this position...'
          }
        ];

        setMyApplications(workerApplications);
        setStats({
          totalJobs: 0,
          activeJobs: 0,
          applications: workerApplications.length,
          completedJobs: 3,
          totalViews: 0,
          averageRating: 4.5
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this method to handle application updates
  const handleApplicationUpdate = (applicationId: string, newStatus: JobApplication['status']) => {
    setMyApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      )
    );
    
    // Update stats based on the new status
    setStats(prevStats => ({
      ...prevStats,
      // Recalculate stats if needed
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'filled':
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.userType === 'employer' 
              ? 'Manage your job postings and applications'
              : 'Track your job applications and opportunities'
            }
          </p>
        </div>

        {/* Quick Actions */}
        {user.userType === 'employer' && (
          <div className="mb-8">
            <Link
              to="/post-job"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Post New Job
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.userType === 'employer' ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalJobs}</h3>
                    <p className="text-gray-600">Total Jobs Posted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeJobs}</h3>
                    <p className="text-gray-600">Active Jobs</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.applications}</h3>
                    <p className="text-gray-600">Total Applications</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <EyeIcon className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalViews}</h3>
                    <p className="text-gray-600">Total Views</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.applications}</h3>
                    <p className="text-gray-600">Applications Sent</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {myApplications.filter(app => app.status === 'accepted').length}
                    </h3>
                    <p className="text-gray-600">Accepted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {myApplications.filter(app => app.status === 'pending').length}
                    </h3>
                    <p className="text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.averageRating}</h3>
                    <p className="text-gray-600">Your Rating</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                Overview
              </button>
              {user.userType === 'employer' && (
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'jobs'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BriefcaseIcon className="h-5 w-5 inline mr-2" />
                  My Jobs ({myJobs.length})
                </button>
              )}
              {user.userType === 'worker' && (
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'applications'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BriefcaseIcon className="h-5 w-5 inline mr-2" />
                  My Applications ({myApplications.length})
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {user.userType === 'employer' ? (
                      <>
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4" />
                          <div>
                            <p className="font-medium text-gray-900">Job Posted Successfully</p>
                            <p className="text-sm text-gray-600">
                              "Greenhouse Technician" was posted 5 days ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <UserGroupIcon className="h-8 w-8 text-blue-500 mr-4" />
                          <div>
                            <p className="font-medium text-gray-900">New Applications Received</p>
                            <p className="text-sm text-gray-600">
                              3 new applications for "Farm Hand - Vegetable Production"
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4" />
                          <div>
                            <p className="font-medium text-gray-900">Application Accepted</p>
                            <p className="text-sm text-gray-600">
                              Your application for "Irrigation Technician" was accepted
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                          <ClockIcon className="h-8 w-8 text-yellow-500 mr-4" />
                          <div>
                            <p className="font-medium text-gray-900">Application Pending</p>
                            <p className="text-sm text-gray-600">
                              Your application for "Farm Hand - Vegetable Farm" is under review
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.userType === 'employer' ? (
                      <>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">12</div>
                          <div className="text-sm text-gray-600">New Applications</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">77</div>
                          <div className="text-sm text-gray-600">Profile Views</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">2</div>
                          <div className="text-sm text-gray-600">Jobs Posted</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">3</div>
                          <div className="text-sm text-gray-600">Applications Sent</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">15</div>
                          <div className="text-sm text-gray-600">Profile Views</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">1</div>
                          <div className="text-sm text-gray-600">Job Offers</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && user.userType === 'employer' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Job Postings</h3>
                  <Link
                    to="/post-job"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Post New Job
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>KES {job.salary?.toLocaleString()}/{job.salaryType}</span>
                            <span>•</span>
                            <span className="capitalize">{job.jobType}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{job.applicationsCount || 0} applications</span>
                            <span>•</span>
                            <span>{job.views || 0} views</span>
                            <span>•</span>
                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          {job.isBoosted && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Boosted
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {job.workersNeeded} worker{job.workersNeeded !== 1 ? 's' : ''} needed
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {myJobs.length === 0 && (
                    <div className="text-center py-12">
                      <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by posting your first job.</p>
                      <div className="mt-6">
                        <Link
                          to="/post-job"
                          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Post Your First Job
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && user.userType === 'worker' && (
              <div>
                <ApplicationsList 
                  applications={myApplications}
                  onApplicationUpdate={handleApplicationUpdate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};