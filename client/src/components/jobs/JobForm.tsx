import React, { useState, useEffect } from 'react';
import { Job, JobFormData } from '../../types/jobs';
import { AFRICAN_COUNTRIES } from '../../utils/constants';
import { JOB_CATEGORIES, SALARY_TYPES, JOB_TYPES } from '../../types/jobs'; // Updated import
import { validateJobForm } from '../../utils/validators';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText, 
  Tag,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (jobData: JobFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  className?: string;
}

const JobForm: React.FC<JobFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: 0,
    salaryType: 'monthly',
    jobType: 'temporary',
    startDate: '',
    endDate: '',
    workersNeeded: 1,
    skills: [],
    requirements: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        startDate: initialData.startDate 
          ? new Date(initialData.startDate).toISOString().split('T')[0] 
          : '',
        endDate: initialData.endDate 
          ? new Date(initialData.endDate).toISOString().split('T')[0] 
          : ''
      }));
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((skill: string) => skill !== skillToRemove) || []
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = validateJobForm(formData);
    
    let validationErrors: Record<string, string> = {};
    
    if (!validationResult.isValid && validationResult.errors) {
      validationResult.errors.forEach(err => {
        if (err.includes('title') || err.includes('Title')) validationErrors.title = err;
        else if (err.includes('description') || err.includes('Description')) validationErrors.description = err;
        else if (err.includes('category') || err.includes('Category')) validationErrors.category = err;
        else if (err.includes('location') || err.includes('Location')) validationErrors.location = err;
        else if (err.includes('salary') || err.includes('Salary')) validationErrors.salary = err;
        else if (err.includes('start date') || err.includes('Start date')) validationErrors.startDate = err;
        else if (err.includes('workers') || err.includes('Workers')) validationErrors.workersNeeded = err;
        else validationErrors.general = err;
      });
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'Failed to submit form. Please try again.' });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-green-600" />
          {isEditing ? 'Edit Job Listing' : 'Post New Job'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing 
            ? 'Update your job listing details' 
            : 'Fill in the details to post your agricultural job listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* General Error Display */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div className="text-sm text-red-700">{errors.general}</div>
            </div>
          </div>
        )}

        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Farm Worker for Maize Harvesting"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {JOB_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select country</option>
              {AFRICAN_COUNTRIES.map(country => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the job responsibilities, working conditions, and what you're looking for in candidates..."
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Salary and Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Salary (USD) *
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              min="0"
              step="0.01"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.salary && (
              <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
            )}
          </div>

          <div>
            <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700 mb-2">
              Pay Period *
            </label>
            <select
              id="salaryType"
              name="salaryType"
              value={formData.salaryType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {SALARY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
              Job Type *
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {JOB_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates and Workers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              min={today}
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              min={formData.startDate || today}
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="workersNeeded" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Workers Needed *
            </label>
            <input
              type="number"
              id="workersNeeded"
              name="workersNeeded"
              min="1"
              max="1000"
              value={formData.workersNeeded}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.workersNeeded ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.workersNeeded && (
              <p className="mt-1 text-sm text-red-600">{errors.workersNeeded}</p>
            )}
          </div>
        </div>

        {/* Skills Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                placeholder="Enter a skill and press Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.skills && formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={3}
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Any specific requirements, qualifications, or conditions for this job..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Posting...'}
              </span>
            ) : (
              isEditing ? 'Update Job' : 'Post Job'
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Tips for a great job listing:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Be specific about the work location and accommodation if provided</li>
                <li>Include details about tools, equipment, or transportation</li>
                <li>Mention any training or experience requirements clearly</li>
                <li>Consider seasonal factors and weather conditions</li>
                <li>Specify payment terms and frequency</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobForm;