import React, { useState } from 'react';
import { Job, JobApplication } from '../../types/jobs';
import { User } from '../../types/users';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Briefcase,
  Star,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';

interface JobDetailsProps {
  job: Job;
  employer?: User;
  onApply: (jobId: string) => void;
  onContact: (employerId: string) => void;
  onShare: (job: Job) => void;
  onSave: (jobId: string) => void;
  onReport: (jobId: string) => void;
  isApplied?: boolean;
  isSaved?: boolean;
  userApplication?: JobApplication;
  isOwner?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  className?: string;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  employer,
  onApply,
  onContact,
  onShare,
  onSave,
  onReport,
  isApplied = false,
  isSaved = false,
  userApplication,
  isOwner = false,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Helper function to convert string dates to Date objects
  const parseDate = (dateValue: string | Date): Date => {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    return new Date(dateValue);
  };

  const getSalaryText = () => {
    if (job.salary) {
      return `${formatCurrency(job.salary)} ${job.salaryType}`;
    }
    return 'Salary negotiable';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'filled':
        return 'text-gray-600 bg-gray-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'permanent':
        return 'text-green-700 bg-green-100';
      case 'seasonal':
        return 'text-orange-700 bg-orange-100';
      case 'temporary':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'accepted':
        return 'text-green-700 bg-green-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      case 'withdrawn':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const canApply = job.status === 'active' && !isApplied && !isOwner;

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {job.title}
              </h1>
              {job.isBoosted && (
                <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Boosted
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Posted {formatRelativeTime(parseDate(job.createdAt))}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                {job.status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                {job.status === 'filled' && <Users className="w-4 h-4 mr-1" />}
                {job.status === 'expired' && <XCircle className="w-4 h-4 mr-1" />}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {isOwner ? (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(job)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Edit Job
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(job.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete Job
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onShare(job)}
                  className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  title="Share job"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSave(job.id)}
                  className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSaved
                      ? 'border-green-300 text-green-700 bg-green-50 focus:ring-green-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                  }`}
                  title={isSaved ? 'Saved' : 'Save job'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onReport(job.id)}
                  className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  title="Report job"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Application Status */}
        {userApplication && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900 mr-2">Your Application:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(userApplication.status)}`}>
                  {userApplication.status.charAt(0).toUpperCase() + userApplication.status.slice(1)}
                </span>
              </div>
              <span className="text-xs text-blue-600">
                Applied {formatRelativeTime(parseDate(userApplication.appliedAt))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="p-6 space-y-6">
        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <DollarSign className="w-4 h-4 mr-1" />
              Salary
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {getSalaryText()}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              Start Date
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(job.startDate)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Users className="w-4 h-4 mr-1" />
              Workers Needed
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {job.workersNeeded}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              Duration
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {job.endDate ? `Until ${formatDate(job.endDate)}` : 'Open-ended'}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {showFullDescription || job.description.length <= 300
                ? job.description
                : `${job.description.substring(0, 300)}...`}
            </p>
            {job.description.length > 300 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
            <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
          </div>
        )}

        {/* Employer Information */}
        {employer && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Employer</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {employer.profilePicture ? (
                  <img
                    src={employer.profilePicture}
                    alt={`${employer.firstName} ${employer.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {employer.firstName} {employer.lastName}
                  </h4>
                  {employer.isVerified && (
                    <span title="Verified employer">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </span>
                  )}
                  {employer.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {employer.rating.toFixed(1)} ({employer.totalRatings} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{employer.location}</p>
                {employer.bio && (
                  <p className="text-gray-700 text-sm">{employer.bio}</p>
                )}
                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => onContact(employer.id)}
                    className="flex items-center text-sm text-green-600 hover:text-green-700"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                  {employer.phoneNumber && (
                    <a
                      href={`tel:${employer.phoneNumber}`}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apply Section */}
        {!isOwner && (
          <div className="border-t border-gray-200 pt-6">
            {canApply ? (
              <button
                onClick={() => onApply(job.id)}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Apply for This Job
              </button>
            ) : (
              <div className="text-center sm:text-left">
                {isApplied ? (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Application Submitted
                  </div>
                ) : job.status !== 'active' ? (
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md">
                    <XCircle className="w-4 h-4 mr-2" />
                    Job No Longer Available
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;