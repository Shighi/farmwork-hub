import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, DollarSign, Calendar, MapPin, Users, FileText, Tag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useJobs } from '../hooks/useJobs';
import { CreateJobData } from '../types/jobs';
import { JOB_CATEGORIES, JOB_TYPES, SALARY_TYPES, AGRICULTURAL_SKILLS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostJob: React.FC = () => {
  const { user } = useAuth();
  const { createJob } = useJobs();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: 0,
    salaryType: 'daily',
    jobType: 'temporary',
    startDate: '',
    endDate: '',
    workersNeeded: 1,
    skills: [],
    requirements: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is authenticated and is an employer
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.userType !== 'employer') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Job title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Job description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Job category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.workersNeeded < 1) {
      newErrors.workersNeeded = 'At least 1 worker is required';
    } else if (formData.workersNeeded > 1000) {
      newErrors.workersNeeded = 'Maximum 1000 workers allowed';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[data-field="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const job = await createJob(formData);
      // Show success message
      navigate(`/jobs/${job.id}`, { 
        state: { message: 'Job posted successfully!' }
      });
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ submit: 'Failed to create job. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateJobData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      handleInputChange('skills', [...formData.skills, trimmedSkill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const addCommonSkill = (skill: string) => {
    addSkill(skill);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/dashboard');
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!user || user.userType !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">
              Connect with skilled agricultural workers across Africa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div data-field="title">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Seasonal Farm Worker, Livestock Caretaker, Crop Harvester"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-field="category">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {JOB_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div data-field="location">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="City, Country (e.g., Lagos, Nigeria)"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Job Description */}
            <div data-field="description">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe the job responsibilities, work environment, and what you're looking for in a candidate. Include specific tasks, working hours, and any special conditions..."
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.description.length} characters (minimum 50)
                </span>
              </div>
            </div>

            {/* Salary and Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div data-field="salary">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary * (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.salary || ''}
                    onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.salary ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay Period
                </label>
                <select
                  value={formData.salaryType}
                  onChange={(e) => handleInputChange('salaryType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {SALARY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates and Workers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div data-field="startDate">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={getTomorrowDate()}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div data-field="endDate">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate || getTomorrowDate()}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>

              <div data-field="workersNeeded">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workers Needed
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.workersNeeded}
                    onChange={(e) => handleInputChange('workersNeeded', Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.workersNeeded ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    min="1"
                    max="1000"
                  />
                </div>
                {errors.workersNeeded && <p className="text-red-500 text-sm mt-1">{errors.workersNeeded}</p>}
              </div>
            </div>

            {/* Skills */}
            <div data-field="skills">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills *
              </label>
              
              {/* Skill Input */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillInputKeyPress}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a skill (e.g., Crop harvesting, Animal care)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Common Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Common skills (click to add):</p>
                <div className="flex flex-wrap gap-2">
                  {AGRICULTURAL_SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addCommonSkill(skill)}
                      disabled={formData.skills.includes(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.skills.includes(skill)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 border border-transparent hover:border-green-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Skills */}
              <div className="mb-2">
                {formData.skills.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-green-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any specific requirements, qualifications, or experience needed. Include physical requirements, certifications, or equipment familiarity..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Mention any certifications, previous experience, or special conditions
              </p>
            </div>

            {/* Submit Button */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Post Job
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;