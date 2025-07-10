import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { JobApplication } from '../../types/users';
import { useAuth } from '../../hooks/useAuth';
import applicationsService from '../../services/applications'; // Changed from usersService
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';

interface ApplicationsListProps {
  applications?: JobApplication[];
  onApplicationUpdate?: (applicationId: string, newStatus: JobApplication['status']) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ 
  applications = [],
  onApplicationUpdate 
}) => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<JobApplication | null>(null);
  const [error, setError] = useState<string>('');

  const handleWithdrawClick = (application: JobApplication) => {
    setApplicationToWithdraw(application);
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = async () => {
    if (!applicationToWithdraw) return;

    try {
      setWithdrawingId(applicationToWithdraw.id);
      await applicationsService.withdrawApplication(applicationToWithdraw.id); // Changed from usersService
      
      // Notify parent component about the status change
      if (onApplicationUpdate) {
        onApplicationUpdate(applicationToWithdraw.id, 'withdrawn');
      }
      
      setShowWithdrawModal(false);
      setApplicationToWithdraw(null);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      setError('Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusIcon = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'withdrawn':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      withdrawn: applications.filter(app => app.status === 'withdrawn').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'accepted', label: 'Accepted', count: statusCounts.accepted },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
            { key: 'withdrawn', label: 'Withdrawn', count: statusCounts.withdrawn },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'all' ? 'No applications yet' : `No ${filterStatus} applications`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'all' 
              ? "Start applying for jobs to see your applications here"
              : `You don't have any ${filterStatus} applications at the moment`
            }
          </p>
          {filterStatus === 'all' && (
            <a
              href="/jobs"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Browse Jobs
            </a>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onWithdraw={() => handleWithdrawClick(application)}
              isWithdrawing={withdrawingId === application.id}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Application"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to withdraw your application for{' '}
            <span className="font-semibold">{applicationToWithdraw?.job?.title}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. You'll need to reapply if you change your mind.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdrawConfirm}
              disabled={withdrawingId !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {withdrawingId ? <LoadingSpinner size="sm" /> : 'Withdraw Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Individual Application Card Component
interface ApplicationCardProps {
  application: JobApplication;
  onWithdraw: () => void;
  isWithdrawing: boolean;
  getStatusIcon: (status: JobApplication['status']) => React.ReactNode;
  getStatusColor: (status: JobApplication['status']) => string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onWithdraw,
  isWithdrawing,
  getStatusIcon,
  getStatusColor
}) => {
  const { job } = application;
  const canWithdraw = application.status === 'pending';

  // Safety check for job existence
  if (!job) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Job information unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600">
                <a href={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </a>
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="ml-1 capitalize">{application.status}</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(job.salary)} {job.salaryType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Start: {formatDate(job.startDate)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">Your Cover Letter:</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {application.coverLetter || 'No cover letter provided'}
              </p>
            </div>

            {application.proposedSalary && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Proposed Salary:</span> {formatCurrency(application.proposedSalary)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Applied {formatRelativeTime(new Date(application.appliedAt))}
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`/jobs/${job.id}`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Job
            </a>
            
            {canWithdraw && (
              <button
                onClick={onWithdraw}
                disabled={isWithdrawing}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Withdraw
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Status-specific messages */}
        {application.status === 'accepted' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              🎉 Congratulations! Your application has been accepted. The employer should contact you soon with next steps.
            </p>
          </div>
        )}
        
        {application.status === 'rejected' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Unfortunately, your application was not selected for this position. Keep applying to other opportunities!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;