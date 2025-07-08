const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Get user profile
const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      location: true,
      userType: true,
      isVerified: true,
      profilePicture: true,
      bio: true,
      skills: true,
      rating: true,
      totalRatings: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'location', 'bio', 'skills', 'profilePicture'];
  const filteredData = {};

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      location: true,
      userType: true,
      isVerified: true,
      profilePicture: true,
      bio: true,
      skills: true,
      rating: true,
      totalRatings: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return updatedUser;
};

// Get user ratings
const getUserRatings = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { ratedUserId: userId },
      include: {
        ratingUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            userType: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.rating.count({
      where: { ratedUserId: userId }
    })
  ]);

  return {
    ratings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Rate a user
const rateUser = async (ratedUserId, ratingUserId, rating, comment) => {
  // Check if user already rated this user
  const existingRating = await prisma.rating.findFirst({
    where: {
      ratedUserId,
      ratingUserId
    }
  });

  if (existingRating) {
    throw new AppError('You have already rated this user', 400);
  }

  // Create new rating
  const newRating = await prisma.rating.create({
    data: {
      ratedUserId,
      ratingUserId,
      rating,
      comment
    },
    include: {
      ratingUser: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          userType: true
        }
      }
    }
  });

  // Update user's average rating
  const allRatings = await prisma.rating.findMany({
    where: { ratedUserId },
    select: { rating: true }
  });

  const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / allRatings.length;

  await prisma.user.update({
    where: { id: ratedUserId },
    data: {
      rating: averageRating,
      totalRatings: allRatings.length
    }
  });

  return newRating;
};

// Search users
const searchUsers = async (filters, { page = 1, limit = 12 }) => {
  const skip = (page - 1) * limit;
  const where = {};

  // Build where clause
  if (filters.userType) {
    where.userType = filters.userType;
  }

  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { bio: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }

  if (filters.skills && filters.skills.length > 0) {
    where.skills = {
      hasSome: filters.skills
    };
  }

  if (filters.minRating) {
    where.rating = { gte: filters.minRating };
  }

  if (filters.isVerified !== undefined) {
    where.isVerified = filters.isVerified;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        location: true,
        userType: true,
        isVerified: true,
        profilePicture: true,
        bio: true,
        skills: true,
        rating: true,
        totalRatings: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Verify user
const verifyUser = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isVerified: true,
      userType: true
    }
  });

  return user;
};

// Suspend user
const suspendUser = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      userType: true
    }
  });

  return user;
};

// Activate user
const activateUser = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      userType: true
    }
  });

  return user;
};

// Get user statistics
const getUserStats = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true, rating: true, totalRatings: true }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const baseStats = {
    totalRatings: user.totalRatings || 0,
    averageRating: user.rating || 0
  };

  if (user.userType === 'worker') {
    // Worker-specific stats
    const [applicationCount, completedJobs] = await Promise.all([
      prisma.application.count({
        where: { applicantId: userId }
      }),
      prisma.job.count({
        where: {
          applications: {
            some: {
              applicantId: userId,
              status: 'completed'
            }
          }
        }
      })
    ]);

    return {
      ...baseStats,
      totalApplications: applicationCount,
      completedJobs
    };
  } else if (user.userType === 'employer') {
    // Employer-specific stats
    const [postedJobs, activeJobs, completedJobs] = await Promise.all([
      prisma.job.count({
        where: { employerId: userId }
      }),
      prisma.job.count({
        where: { 
          employerId: userId,
          status: 'active'
        }
      }),
      prisma.job.count({
        where: { 
          employerId: userId,
          status: 'completed'
        }
      })
    ]);

    return {
      ...baseStats,
      totalPostedJobs: postedJobs,
      activeJobs,
      completedJobs
    };
  }

  return baseStats;
};

// Get user applications
const getUserApplications = async (userId, { page = 1, limit = 12, status }) => {
  const skip = (page - 1) * limit;
  const where = { applicantId: userId };

  if (status) {
    where.status = status;
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            salary: true,
            location: true,
            jobType: true,
            status: true,
            createdAt: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                rating: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.application.count({ where })
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get user posted jobs
const getUserPostedJobs = async (userId, { page = 1, limit = 12, status }) => {
  const skip = (page - 1) * limit;
  const where = { employerId: userId };

  if (status) {
    where.status = status;
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.job.count({ where })
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get user work history
const getUserWorkHistory = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [workHistory, total] = await Promise.all([
    prisma.application.findMany({
      where: {
        applicantId: userId,
        status: 'completed'
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            salary: true,
            location: true,
            jobType: true,
            createdAt: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                rating: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.application.count({
      where: {
        applicantId: userId,
        status: 'completed'
      }
    })
  ]);

  return {
    workHistory,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Update password
const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  return { message: 'Password updated successfully' };
};

// Delete user
const deleteUser = async (userId) => {
  // In a real application, you might want to soft delete or handle related data
  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: 'User deleted successfully' };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserRatings,
  rateUser,
  searchUsers,
  verifyUser,
  suspendUser,
  activateUser,
  getUserStats,
  getUserApplications,
  getUserPostedJobs,
  getUserWorkHistory,
  updatePassword,
  deleteUser
};