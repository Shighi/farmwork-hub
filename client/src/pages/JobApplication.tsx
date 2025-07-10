import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob } from '../hooks/useJobs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { User, FileText, DollarSign, ArrowLeft, Send } from 'lucide-react';

interface ApplicationFormData {
  coverLetter: string;
  proposedSalary: string;
  resume?: File;
  additionalDocuments?: File[];
}

const JobApplication: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, loading: jobLoading, error: jobError } = useJob(jobId!);
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    coverLetter: '',
    proposedSalary: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (job) {
      // Pre-fill proposed salary with job salary
      setFormData(prev => ({
        ...prev,
        proposedSalary: job.salary.toString()
      }));
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'resume') {
        setFormData(prev => ({
          ...prev,
          resume: files[0]
        }));
      } else if (name === 'additionalDocuments') {
        setFormData(prev => ({
          ...prev,
          additionalDocuments: Array.from(files)
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coverLetter.trim()) {
      setSubmitError('Please provide a cover letter');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      console.log('Submitting application:', {
        jobId,
        coverLetter: formData.coverLetter,
        proposedSalary: formData.proposedSalary ? parseFloat(formData.proposedSalary) : undefined,
        resume: formData.resume,
        additionalDocuments: formData.additionalDocuments
      });

      setSubmitSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/jobs', { 
          state: { 
            message: 'Application submitted successfully!',
            type: 'success' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
      console.error('Application submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{jobError || 'Job not found'}</p>
            <button
              onClick={() => navigate('/jobs')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 mb-4">
              <Send className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-green-700 mb-4">
              Your application for "{job.title}" has been sent to the employer.
            </p>
            <p className="text-green-600 text-sm">
              Redirecting you back to jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for Job
          </h1>
          <p className="text-gray-600">
            Submit your application for this position
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company || 'Company Name'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-medium">
                    ${job.salary.toLocaleString()} {job.salaryType}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Job Type</p>
                  <p className="font-medium capitalize">{job.jobType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{job.category}</p>
                </div>
                
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Application Form</h3>
              
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={8}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell the employer why you're the perfect fit for this role..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Explain your relevant experience and why you're interested in this position.
                  </p>
                </div>

                {/* Proposed Salary */}
                <div>
                  <label htmlFor="proposedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Salary ({job.salaryType})
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="proposedSalary"
                      name="proposedSalary"
                      value={formData.proposedSalary}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your expected salary"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Specify your salary expectation if different from the posted amount.
                  </p>
                </div>

                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.resume ? formData.resume.name : 'Click to upload resume'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PDF, DOC, or DOCX (max 5MB)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Documents */}
                <div>
                  <label htmlFor="additionalDocuments" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="additionalDocuments"
                      name="additionalDocuments"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                    />
                    <label
                      htmlFor="additionalDocuments"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.additionalDocuments && formData.additionalDocuments.length > 0
                          ? `${formData.additionalDocuments.length} file(s) selected`
                          : 'Click to upload additional documents'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Certificates, portfolios, etc. (optional)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;