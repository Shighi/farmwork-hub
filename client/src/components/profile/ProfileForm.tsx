import React, { useState, useEffect } from 'react';
import { User } from '../../types/users';
import { useAuth } from '../../hooks/useAuth';
import { usersService } from '../../services/users';
import { validateEmail, validatePhoneNumber } from '../../utils/validators';
import { AFRICAN_COUNTRIES, JOB_CATEGORIES, AGRICULTURAL_SKILLS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProfileFormProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

// Define the update profile payload interface to match what the service expects
interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  bio: string;
  skills: string[];
  experience: string;
  education: string;
  preferredJobTypes: string[];
  expectedSalary: string;
  availability: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    location: user.location || '',
    bio: user.bio || '',
    skills: user.skills || [],
    experience: user.experience || '',
    education: user.education || '',
    preferredJobTypes: user.preferredJobTypes || [],
    expectedSalary: user.expectedSalary || '',
    availability: user.availability || 'immediate'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update form data when user prop changes
  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      location: user.location || '',
      bio: user.bio || '',
      skills: user.skills || [],
      experience: user.experience || '',
      education: user.education || '',
      preferredJobTypes: user.preferredJobTypes || [],
      expectedSalary: user.expectedSalary || '',
      availability: user.availability || 'immediate'
    });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSkillsChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s: string) => s !== skill)
        : [...prev.skills, skill]
    }));
    
    // Clear skills error if user selects a skill
    if (errors.skills) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.skills;
        return newErrors;
      });
    }
  };

  const handleJobTypesChange = (jobType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(jobType)
        ? prev.preferredJobTypes.filter((t: string) => t !== jobType)
        : [...prev.preferredJobTypes, jobType]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email (use current user email since it's not editable)
    if (user.email) {
      const emailValidation = validateEmail(user.email);
      if (!emailValidation.isValid && emailValidation.error) {
        newErrors.email = emailValidation.error;
      }
    }

    // Validate phone number if provided
    if (formData.phoneNumber.trim()) {
      const phoneValidation = validatePhoneNumber(formData.phoneNumber);
      if (!phoneValidation.isValid && phoneValidation.error) {
        newErrors.phoneNumber = phoneValidation.error;
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    
    // Clear previous submit errors
    setErrors(prev => {
      const { submit, ...rest } = prev;
      return rest;
    });

    try {
      const updatedUser = await usersService.updateProfile(formData);
      
      // Call onUpdate with the complete updated user object
      onUpdate(updatedUser);
      setIsSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        {isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            Profile updated successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="Enter your email address"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed after registration</p>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., +254 712 345 678"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your location</option>
            {AFRICAN_COUNTRIES.map((country) => (
              <option key={country.code} value={country.name}>{country.name}</option>
            ))}
          </select>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={500}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell potential employers about yourself, your experience, and what makes you a great worker..."
          />
          <p className="mt-1 text-sm text-gray-500">{formData.bio.length}/500 characters</p>
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills * <span className="text-gray-500">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {AGRICULTURAL_SKILLS.map((skill: string) => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillsChange(skill)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 select-none">{skill}</span>
              </label>
            ))}
          </div>
          {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Work Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe your previous work experience in agriculture or related fields..."
          />
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="List your educational background, certifications, or training..."
          />
        </div>

        {/* Preferred Job Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Job Types
          </label>
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((category: string) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredJobTypes.includes(category)}
                  onChange={() => handleJobTypesChange(category)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 select-none">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Expected Salary & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Salary Range
            </label>
            <input
              type="text"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., $20-30 per day"
            />
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="immediate">Available Immediately</option>
              <option value="1-week">Available in 1 Week</option>
              <option value="2-weeks">Available in 2 Weeks</option>
              <option value="1-month">Available in 1 Month</option>
              <option value="seasonal">Seasonal Availability</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          {errors.submit && (
            <p className="text-sm text-red-600 flex-1">{errors.submit}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;