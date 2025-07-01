import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  ArrowLeft, 
  Bookmark,
  Share2,
  Flag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import { Job } from '../types/jobs';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, loading, error, applyForJob } = useJobs();
  
  const [job, setJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedSalary, setProposedSalary] = useState('');
  const [applying, setApplying] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (id && jobs.length > 0) {
      const foundJob = jobs.find(j => j.id === id);
      if (foundJob) {
        setJob(foundJob);
      }
    }
  }, [id, jobs]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (!job || !applyForJob) return;

    setApplying(true);
    try {
      const result = await applyForJob(job.id, {
        coverLetter,
        proposedSalary: proposedSalary ? Number(proposedSalary) : undefined,
      });
      
      if (result.success) {
        setShowApplicationModal(false);
        setCoverLetter('');
        setProposedSalary('');
        alert(result.message || 'Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, you'd update this in the backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/jobs"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = job.endDate ? new Date(job.endDate) < new Date() : false;
  const canApply = user && user.userType === 'worker' && !isExpired;
  const isOwnJob = user && user.id === job.employerId;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                {job.isBoosted && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{job.jobType}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarSign className="h-5 w-5" />
                  <span>{formatCurrency(job.salary)} / {job.salaryType}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{job.workersNeeded} position{job.workersNeeded > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {canApply && (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Apply Now
                </button>
              )}
              
              {isOwnJob && (
                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Edit Job
                </Link>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBookmark}
                  className={`flex-1 border-2 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    bookmarked
                      ? 'border-green-600 text-green-600 bg-green-50'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              <button className="text-gray-500 hover:text-red-600 text-sm flex items-center justify-center gap-1 transition-colors">
                <Flag className="h-4 w-4" />
                Report Job
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          {isExpired && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">This job posting has expired</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Work Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="font-medium">{formatDate(job.startDate)}</div>
                </div>
                {job.endDate && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">End Date</div>
                    <div className="font-medium">{formatDate(job.endDate)}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Job Type</div>
                  <div className="font-medium capitalize">{job.jobType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Workers Needed</div>
                  <div className="font-medium">{job.workersNeeded}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employer</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {job.employer?.firstName?.[0] || 'E'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {job.employer?.firstName} {job.employer?.lastName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{job.employer?.rating?.toFixed(1) || 'New'}</span>
                    {job.employer?.totalRatings && (
                      <span>({job.employer.totalRatings} reviews)</span>
                    )}
                  </div>
                </div>
              </div>
              {job.employer?.isVerified && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified Employer</span>
                </div>
              )}
            </div>

            {/* Job Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{job.applicationsCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{formatDate(job.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium capitalize ${
                    job.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {jobs
                  .filter(j => j.id !== job.id && j.category === job.category)
                  .slice(0, 3)
                  .map(similarJob => (
                    <Link
                      key={similarJob.id}
                      to={`/jobs/${similarJob.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">{similarJob.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{similarJob.location}</div>
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(similarJob.salary)} / {similarJob.salaryType}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Apply for Job"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell the employer why you're perfect for this job..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Daily Rate (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={proposedSalary}
                onChange={(e) => setProposedSalary(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your rate per day"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to accept the posted rate of {formatCurrency(job.salary)} / {job.salaryType}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={applying}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Applying...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetails;