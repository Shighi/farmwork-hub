import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ProfilePicture from '../components/profile/ProfilePicture';
import ApplicationsList from '../components/profile/ApplicationsList';
import LoadingSpinner, { PageSpinner } from '../components/common/LoadingSpinner';
import { User, UserProfile, JobApplication } from '../types/users';
import { usersService } from '../services/users';
import { 
  UserIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  CheckBadgeIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    fetchUserProfile();
    if (user?.userType === 'worker') {
      fetchApplications();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profile = await usersService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      // This would normally fetch from the API
      // For now, using demo data
      const demoApplications: JobApplication[] = [
        {
          id: '1',
          applicantId: user?.id || '',
          jobId: 'job1',
          job: {
            id: 'job1',
            title: 'Farm Hand - Vegetable Farm',
            description: 'Looking for experienced farm hand for vegetable farming operations.',
            category: 'Crop Production',
            location: 'Nakuru, Kenya',
            salary: 15000,
            salaryType: 'monthly' as const,
            jobType: 'seasonal' as const,
            startDate: '2024-03-01',
            workersNeeded: 2,
            skills: ['Crop farming', 'Manual labor'],
            requirements: 'Previous farming experience preferred',
            employerId: 'emp1',
            status: 'active' as const,
            isBoosted: false,
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-02-01T00:00:00Z'
          },
          status: 'pending' as const,
          appliedAt: '2024-02-15T00:00:00Z',
          updatedAt: '2024-02-15T00:00:00Z',
          coverLetter: 'I am very interested in this position...'
        },
        {
          id: '2',
          applicantId: user?.id || '',
          jobId: 'job2', 
          job: {
            id: 'job2',
            title: 'Irrigation Technician',
            description: 'Seeking skilled irrigation technician for modern farming operations.',
            category: 'Irrigation',
            location: 'Meru, Kenya',
            salary: 25000,
            salaryType: 'monthly' as const,
            jobType: 'permanent' as const,
            startDate: '2024-03-15',
            workersNeeded: 1,
            skills: ['Irrigation systems', 'Technical skills'],
            requirements: 'Technical certification in irrigation systems',
            employerId: 'emp2',
            status: 'active' as const,
            isBoosted: false,
            createdAt: '2024-02-05T00:00:00Z',
            updatedAt: '2024-02-05T00:00:00Z'
          },
          status: 'accepted' as const,
          appliedAt: '2024-02-10T00:00:00Z',
          updatedAt: '2024-02-12T00:00:00Z',
          coverLetter: 'With my experience in irrigation systems...'
        }
      ];
      setApplications(demoApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleProfileUpdate = async (updatedUser: User) => {
    try {
      setLoading(true);
      // Update the local state with the updated user
      setUserProfile(updatedUser);
      await fetchUserProfile(); // Refresh from server
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = (updatedUser: User) => {
    // Update the user profile with the new profile picture
    if (userProfile) {
      setUserProfile({ ...userProfile, profilePicture: updatedUser.profilePicture });
    }
  };

  const renderStars = (rating: number, totalRatings: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-5 w-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarSolidIcon className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-gray-300" />
        );
      }
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} ({totalRatings} reviews)
        </span>
      </div>
    );
  };

  if (loading && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageSpinner text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const profile = userProfile || user;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
                <ProfilePicture
                  user={profile as User}
                  onUpdate={handleProfilePictureUpdate}
                  size="lg"
                  editable={true}
                />
                <div className="mt-4 text-center lg:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                    {profile.isVerified && (
                      <CheckBadgeIcon className="inline h-6 w-6 text-green-500 ml-2" />
                    )}
                  </h1>
                  <p className="text-lg text-gray-600 capitalize">{profile.userType}</p>
                  {profile.rating && profile.totalRatings && profile.totalRatings > 0 && (
                    <div className="mt-2">
                      {renderStars(profile.rating, profile.totalRatings)}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserIcon className="h-5 w-5 inline mr-2" />
                Profile Details
              </button>
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
                  My Applications ({applications.length})
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                {isEditing ? (
                  <ProfileForm
                    user={profile as User}
                    onUpdate={handleProfileUpdate}
                  />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <p className="text-gray-900">{profile.firstName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <p className="text-gray-900">{profile.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{profile.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <p className="text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <p className="text-gray-900">{profile.location || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                          </label>
                          <p className="text-gray-900 capitalize">{profile.userType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && user.userType === 'worker' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  My Job Applications
                </h3>
                <ApplicationsList applications={applications} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};