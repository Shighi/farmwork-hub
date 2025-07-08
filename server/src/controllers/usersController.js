const userService = require('../services/userService');
const { AppError, catchAsync } = require('../middleware/errorHandler');

// Get user profile
const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user profile - FIXED VERSION
const updateProfile = catchAsync(async (req, res) => {
  // Add validation for required fields
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated'
    });
  }

  // Validate request body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No update data provided'
    });
  }

  console.log('Update request received:', {
    userId: req.user.id,
    updateData: req.body
  });

  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID format'
      });
    }
    
    // Re-throw for global error handler
    throw error;
  }
});

// Upload user avatar
const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }

  // Generate unique filename
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${req.file.originalname.split('.').pop()}`;
  
  // Here you would typically upload to cloud storage (AWS S3, Cloudinary, etc.)
  // For now, we'll just return a mock URL
  const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${fileName}`;
  
  const updatedUser = await userService.updateUserProfile(req.user.id, {
    profilePicture: avatarUrl
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
      avatarUrl
    }
  });
});

// Get user ratings
const getUserRating = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.params.id;
  
  const result = await userService.getUserRatings(userId, { page: parseInt(page), limit: parseInt(limit) });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Rate a user
const rateUser = catchAsync(async (req, res) => {
  const { rating, comment } = req.body;
  const ratedUserId = req.params.id;
  const ratingUserId = req.user.id;
  
  if (ratedUserId === ratingUserId) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot rate yourself'
    });
  }
  
  const result = await userService.rateUser(ratedUserId, ratingUserId, rating, comment);
  
  res.status(201).json({
    status: 'success',
    data: result
  });
});

// Get workers (for employers)
const getWorkers = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, search, location, skills, minRating, isVerified } = req.query;
  
  const filters = {
    userType: 'worker',
    ...(search && { search }),
    ...(location && { location }),
    ...(skills && { skills: skills.split(',') }),
    ...(minRating && { minRating: parseFloat(minRating) }),
    ...(isVerified !== undefined && { isVerified: isVerified === 'true' })
  };
  
  const result = await userService.searchUsers(filters, { page: parseInt(page), limit: parseInt(limit) });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get employers (for workers)
const getEmployers = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, search, location, minRating, isVerified } = req.query;
  
  const filters = {
    userType: 'employer',
    ...(search && { search }),
    ...(location && { location }),
    ...(minRating && { minRating: parseFloat(minRating) }),
    ...(isVerified !== undefined && { isVerified: isVerified === 'true' })
  };
  
  const result = await userService.searchUsers(filters, { page: parseInt(page), limit: parseInt(limit) });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get all users (admin only)
const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, search, userType, location, isVerified } = req.query;
  
  const filters = {
    ...(search && { search }),
    ...(userType && { userType }),
    ...(location && { location }),
    ...(isVerified !== undefined && { isVerified: isVerified === 'true' })
  };
  
  const result = await userService.searchUsers(filters, { page: parseInt(page), limit: parseInt(limit) });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Verify user (admin only)
const verifyUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  
  if (!userId) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID is required'
    });
  }
  
  const result = await userService.verifyUser(userId);
  
  res.status(200).json({
    status: 'success',
    message: 'User verified successfully',
    data: {
      user: result
    }
  });
});

// Suspend user (admin only)
const suspendUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  
  if (!userId) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID is required'
    });
  }
  
  const result = await userService.suspendUser(userId);
  
  res.status(200).json({
    status: 'success',
    message: 'User suspended successfully',
    data: {
      user: result
    }
  });
});

// Activate user (admin only)
const activateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  
  if (!userId) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID is required'
    });
  }
  
  const result = await userService.activateUser(userId);
  
  res.status(200).json({
    status: 'success',
    message: 'User activated successfully',
    data: {
      user: result
    }
  });
});

// Get user statistics
const getUserStats = catchAsync(async (req, res) => {
  const stats = await userService.getUserStats(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// Get user applications
const getUserApplications = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, status } = req.query;
  
  const result = await userService.getUserApplications(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit),
    status
  });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get user posted jobs
const getUserPostedJobs = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, status } = req.query;
  
  const result = await userService.getUserPostedJobs(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit),
    status
  });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get user work history
const getUserWorkHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const result = await userService.getUserWorkHistory(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit)
  });
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Update password
const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password and new password are required'
    });
  }
  
  const result = await userService.updatePassword(req.user.id, currentPassword, newPassword);
  
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    data: result
  });
});

// Delete user account
const deleteAccount = catchAsync(async (req, res) => {
  await userService.deleteUser(req.user.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully'
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUserRating,
  rateUser,
  getWorkers,
  getEmployers,
  getAllUsers,
  verifyUser,
  suspendUser,
  activateUser,
  getUserStats,
  getUserApplications,
  getUserPostedJobs,
  getUserWorkHistory,
  updatePassword,
  deleteAccount
};