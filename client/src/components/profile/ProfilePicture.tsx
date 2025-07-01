import React, { useState, useRef } from 'react';
import { Camera, User, Upload, X } from 'lucide-react';
import { User as UserType } from '../../types/users';
import { useAuth } from '../../hooks/useAuth';
import { usersService } from '../../services/users';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProfilePictureProps {
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  user, 
  onUpdate, 
  size = 'md', 
  editable = true 
}) => {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40
  };

  const cameraIconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      const result = await usersService.uploadAvatar(file);
      // Update the user object with the new profile picture
      const updatedUser = { ...user, profilePicture: result.profilePicture };
      onUpdate(updatedUser);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraClick = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const getDisplayImage = () => {
    if (previewUrl) return previewUrl;
    if (user.profilePicture) return user.profilePicture;
    return null;
  };

  const displayImage = getDisplayImage();
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={fullName || 'Profile picture'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <User size={iconSizes[size]} className="text-primary-600" />
          </div>
        )}

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner size="sm" color="white" />
          </div>
        )}

        {/* Upload button */}
        {editable && (
          <button
            onClick={handleCameraClick}
            disabled={isUploading}
            className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1.5 hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change profile picture"
          >
            <Camera size={cameraIconSizes[size]} />
          </button>
        )}
      </div>

      {/* Verification badge */}
      {user.isVerified && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm whitespace-nowrap z-10">
          {error}
          <button
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// Alternative upload component for larger forms
export const ProfilePictureUpload: React.FC<{
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
}> = ({ user, onUpdate }) => {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const result = await usersService.uploadAvatar(file);
      // Update the user object with the new profile picture
      const updatedUser = { ...user, profilePicture: result.profilePicture };
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <ProfilePicture user={user} onUpdate={onUpdate} size="lg" editable={false} />
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500">
            Upload a professional photo to help employers recognize you
          </p>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4">
            <LoadingSpinner size="md" />
            <p className="mt-2 text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Click to upload
              </button>
              <p className="text-gray-500"> or drag and drop</p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;