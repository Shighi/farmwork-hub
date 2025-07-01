import React from 'react';
import { Job } from '../../types/jobs';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import { MapPin, Calendar, Users, TrendingUp, Clock } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply?: (jobId: string) => void;
  showApplyButton?: boolean;
  isApplied?: boolean;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  showApplyButton = true,
  isApplied = false,
  className = ''
}) => {
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job.id);
    }
  };

  const getSalaryText = () => {
    if (job.salary) {
      return `${formatCurrency(job.salary)} ${job.salaryType}`;
    }
    return 'Salary negotiable';
  };

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'permanent':
        return 'bg-green-100 text-green-800';
      case 'seasonal':
        return 'bg-orange-100 text-orange-800';
      case 'temporary':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer ${className}`}
      onClick={() => onViewDetails(job)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
          {job.isBoosted && (
            <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              Boosted
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
            {job.jobType}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {job.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Key Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Start: {formatDate(job.startDate)}</span>
          </div>
          {job.endDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>End: {formatDate(job.endDate)}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>{job.workersNeeded} workers needed</span>
          </div>
          <div className="flex items-center text-sm font-semibold text-green-600">
            <span>{getSalaryText()}</span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Posted {formatRelativeTime(new Date(job.createdAt))}
        </div>
        
        {showApplyButton && job.status === 'active' && (
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isApplied
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
          >
            {isApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;