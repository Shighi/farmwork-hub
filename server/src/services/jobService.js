const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class JobService {
  /**
   * Create a new job
   * @param {Object} jobData - Job creation data
   * @param {string} employerId - ID of the employer creating the job
   * @returns {Promise<Object>} Created job
   */
  async createJob(jobData, employerId) {
    const {
      title,
      description,
      category,
      location,
      salary,
      salaryType,
      jobType,
      startDate,
      endDate,
      workersNeeded,
      skills,
      requirements,
      isBoosted = false
    } = jobData;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        location,
        salary: parseFloat(salary),
        salaryType,
        jobType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        workersNeeded: parseInt(workersNeeded),
        skills: skills || [],
        requirements,
        employerId,
        status: 'active',
        isBoosted
      },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            location: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return job;
  }

  /**
   * Get all jobs with filtering and pagination
   * @param {Object} filters - Filter options
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Jobs and metadata
   */
  async getJobs(filters = {}, pagination = {}) {
    const {
      category,
      location,
      salaryMin,
      salaryMax,
      salaryType,
      jobType,
      skills,
      searchTerm,
      status = 'active',
      isBoosted
    } = filters;

    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      status,
      ...(category && { category }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(salaryMin && { salary: { gte: parseFloat(salaryMin) } }),
      ...(salaryMax && { salary: { lte: parseFloat(salaryMax) } }),
      ...(salaryType && { salaryType }),
      ...(jobType && { jobType }),
      ...(isBoosted !== undefined && { isBoosted }),
      ...(skills && skills.length > 0 && {
        skills: {
          hasSome: skills
        }
      }),
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } }
        ]
      })
    };

    // Build order by clause
    const orderBy = {};
    if (sortBy === 'salary') {
      orderBy.salary = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'startDate') {
      orderBy.startDate = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            location: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalJobs = await prisma.job.count({ where });

    return {
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        hasNextPage: page < Math.ceil(totalJobs / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} Job details
   */
  async getJobById(jobId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            location: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        applications: {
          select: {
            id: true,
            status: true,
            appliedAt: true,
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
                rating: true,
                totalRatings: true
              }
            }
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  /**
   * Update job
   * @param {string} jobId - Job ID
   * @param {Object} updateData - Data to update
   * @param {string} employerId - ID of the employer
   * @returns {Promise<Object>} Updated job
   */
  async updateJob(jobId, updateData, employerId) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    if (existingJob.employerId !== employerId) {
      throw new Error('Unauthorized to update this job');
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...updateData,
        ...(updateData.salary && { salary: parseFloat(updateData.salary) }),
        ...(updateData.workersNeeded && { workersNeeded: parseInt(updateData.workersNeeded) }),
        ...(updateData.startDate && { startDate: new Date(updateData.startDate) }),
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
        updatedAt: new Date()
      },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            location: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return job;
  }

  /**
   * Delete job
   * @param {string} jobId - Job ID
   * @param {string} employerId - ID of the employer
   * @returns {Promise<boolean>} Success status
   */
  async deleteJob(jobId, employerId) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    if (existingJob.employerId !== employerId) {
      throw new Error('Unauthorized to delete this job');
    }

    await prisma.job.delete({
      where: { id: jobId }
    });

    return true;
  }

  /**
   * Get jobs posted by a specific employer
   * @param {string} employerId - Employer ID
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Employer's jobs
   */
  async getJobsByEmployer(employerId, pagination = {}) {
    const { page = 1, limit = 12, status } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      employerId,
      ...(status && { status })
    };

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    const totalJobs = await prisma.job.count({ where });

    return {
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        hasNextPage: page < Math.ceil(totalJobs / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get featured/boosted jobs
   * @param {number} limit - Number of jobs to return
   * @returns {Promise<Array>} Featured jobs
   */
  async getFeaturedJobs(limit = 6) {
    const jobs = await prisma.job.findMany({
      where: {
        status: 'active',
        isBoosted: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return jobs;
  }

  /**
   * Search jobs
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Search results
   */
  async searchJobs(query, filters = {}, pagination = {}) {
    const searchFilters = {
      ...filters,
      searchTerm: query
    };

    return this.getJobs(searchFilters, pagination);
  }

  /**
   * Get job statistics
   * @returns {Promise<Object>} Job statistics
   */
  async getJobStats() {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { status: 'active' } });
    const filledJobs = await prisma.job.count({ where: { status: 'filled' } });
    const totalApplications = await prisma.application.count();

    // Jobs by category
    const jobsByCategory = await prisma.job.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        status: 'active'
      }
    });

    // Jobs by location
    const jobsByLocation = await prisma.job.groupBy({
      by: ['location'],
      _count: {
        location: true
      },
      where: {
        status: 'active'
      },
      take: 10
    });

    return {
      totalJobs,
      activeJobs,
      filledJobs,
      totalApplications,
      jobsByCategory,
      jobsByLocation
    };
  }

  /**
   * Update job status
   * @param {string} jobId - Job ID
   * @param {string} status - New status
   * @param {string} employerId - Employer ID
   * @returns {Promise<Object>} Updated job
   */
  async updateJobStatus(jobId, status, employerId) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    if (existingJob.employerId !== employerId) {
      throw new Error('Unauthorized to update this job');
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    return job;
  }

  /**
   * Boost job (make it featured)
   * @param {string} jobId - Job ID
   * @param {string} employerId - Employer ID
   * @returns {Promise<Object>} Updated job
   */
  async boostJob(jobId, employerId) {
    // Check if job exists and belongs to employer
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    if (existingJob.employerId !== employerId) {
      throw new Error('Unauthorized to boost this job');
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        isBoosted: true,
        updatedAt: new Date()
      }
    });

    return job;
  }

  /**
   * Get recommended jobs for a user based on their skills and location
   * @param {string} userId - User ID
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Array>} Recommended jobs
   */
  async getRecommendedJobs(userId, limit = 10) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { skills: true, location: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const jobs = await prisma.job.findMany({
      where: {
        status: 'active',
        OR: [
          // Match user skills
          {
            skills: {
              hasSome: user.skills
            }
          },
          // Match user location
          {
            location: {
              contains: user.location,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: [
        { isBoosted: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return jobs;
  }
}

module.exports = new JobService();