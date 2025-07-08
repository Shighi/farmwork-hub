const { PrismaClient } = require('@prisma/client');
const jobService = require('../services/jobService');
const prisma = new PrismaClient();

// Get all jobs with filtering and pagination
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      location,
      jobType,
      minSalary,
      maxSalary,
      salaryType,
      skills,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      category,
      location,
      jobType,
      salaryMin: minSalary,
      salaryMax: maxSalary,
      salaryType,
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : undefined,
      searchTerm: search,
      status: 'active'
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const result = await jobService.getJobs(filters, pagination);

    res.json({
      success: true,
      data: {
        jobs: result.jobs,
        pagination: result.pagination
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get single job by ID
const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);

    // Check if current user has applied (if authenticated)
    let hasApplied = false;
    if (req.user && req.user.userType === 'worker') {
      const application = await prisma.application.findFirst({
        where: {
          jobId: id,
          applicantId: req.user.id
        }
      });
      hasApplied = !!application;
    }

    res.json({
      success: true,
      data: {
        ...job,
        hasApplied
      }
    });
  } catch (error) {
    console.error('Get job error:', error);
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Create new job
const createJob = async (req, res) => {
  try {
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
    } = req.body;

    const jobData = {
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
      isBoosted
    };

    const job = await jobService.createJob(jobData, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const job = await jobService.updateJob(id, updateData, req.user.id);

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    if (error.message === 'Unauthorized to update this job') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await jobService.deleteJob(id, req.user.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    if (error.message === 'Unauthorized to delete this job') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Get user's posted jobs
const getMyJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    };

    const result = await jobService.getJobsByEmployer(req.user.id, pagination);

    res.json({
      success: true,
      data: {
        jobs: result.jobs,
        pagination: result.pagination
      }
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your jobs',
      error: error.message
    });
  }
};

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter, proposedSalary } = req.body;

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        employerId: true,
        title: true
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Job is not accepting applications'
      });
    }

    // Check if user is not the employer
    if (job.employerId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply for your own job'
      });
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: id,
        applicantId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = await prisma.application.create({
      data: {
        jobId: id,
        applicantId: req.user.id,
        coverLetter,
        proposedSalary: proposedSalary ? parseFloat(proposedSalary) : null,
        status: 'pending'
      },
      include: {
        job: {
          select: {
            title: true,
            employer: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        applicant: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// Get featured jobs
const getFeaturedJobs = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const jobs = await jobService.getFeaturedJobs(parseInt(limit));

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get featured jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured jobs',
      error: error.message
    });
  }
};

// Search jobs
const searchJobs = async (req, res) => {
  try {
    const { q, limit = 10, page = 1 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await jobService.searchJobs(q, {}, pagination);

    res.json({
      success: true,
      data: {
        jobs: result.jobs,
        pagination: result.pagination
      }
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message
    });
  }
};

// Get user's applications
const getMyApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = {
      applicantId: req.user.id
    };

    if (status) {
      whereClause.status = status;
    }

    const orderBy = {};
    if (sortBy === 'appliedAt') {
      orderBy.appliedAt = sortOrder;
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder;
    } else {
      orderBy.appliedAt = 'desc';
    }

    const [applications, totalCount] = await Promise.all([
      prisma.application.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              location: true,
              salary: true,
              salaryType: true,
              jobType: true,
              status: true,
              employer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                  isVerified: true,
                  rating: true
                }
              }
            }
          }
        }
      }),
      prisma.application.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: take,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your applications',
      error: error.message
    });
  }
};

// Boost job (admin only)
const boostJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await prisma.job.update({
      where: { id },
      data: {
        isBoosted: true,
        updatedAt: new Date()
      },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            isVerified: true,
            rating: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Job boosted successfully',
      data: job
    });
  } catch (error) {
    console.error('Boost job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error boosting job',
      error: error.message
    });
  }
};

// Feature job (admin only)
const featureJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await prisma.job.update({
      where: { id },
      data: {
        isFeatured: true,
        updatedAt: new Date()
      },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            isVerified: true,
            rating: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Job featured successfully',
      data: job
    });
  } catch (error) {
    console.error('Feature job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error featuring job',
      error: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  applyForJob,
  getFeaturedJobs,
  searchJobs,
  getMyApplications,
  boostJob,
  featureJob
};