const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, proposedSalary } = req.body;
    const applicantId = req.user.id;

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
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
        message: 'Job is not active'
      });
    }

    // Check if user is trying to apply for their own job
    if (job.employerId === applicantId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply for your own job'
      });
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        applicantId: applicantId
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        applicantId: applicantId,
        coverLetter: coverLetter || null,
        proposedSalary: proposedSalary ? parseFloat(proposedSalary) : null,
        status: 'pending'
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            skills: true,
            rating: true,
            totalRatings: true,
            isVerified: true
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

// Get user's applications
const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const applicantId = req.user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      applicantId: applicantId
    };

    if (status && ['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      skip,
      take,
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            startDate: true,
            endDate: true,
            status: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    const totalCount = await prisma.application.count({ where });
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
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get applications for a job (for employers)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const employerId = req.user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Verify job belongs to employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true }
    });

    if (!job || job.employerId !== employerId) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    const where = {
      jobId: jobId
    };

    if (status && ['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      skip,
      take,
      orderBy: { appliedAt: 'desc' },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            skills: true,
            location: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        }
      }
    });

    const totalCount = await prisma.application.count({ where });
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
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications',
      error: error.message
    });
  }
};

// Get single application details
const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            startDate: true,
            endDate: true,
            description: true,
            requirements: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            skills: true,
            location: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has permission to view this application
    if (application.applicantId !== userId && application.job.employer.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Update application status (for employers)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;

    // Validate status
    if (!['pending', 'accepted', 'rejected', 'shortlisted', 'interview_scheduled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get application with job details
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            employerId: true,
            workersNeeded: true
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the employer
    if (application.job.employerId !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            skills: true,
            location: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        }
      }
    });

    // If status is accepted, check if job should be marked as filled
    if (status === 'accepted') {
      const acceptedCount = await prisma.application.count({
        where: {
          jobId: application.job.id,
          status: 'accepted'
        }
      });

      if (acceptedCount >= application.job.workersNeeded) {
        await prisma.job.update({
          where: { id: application.job.id },
          data: { status: 'filled' }
        });
      }
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// Withdraw application (for job seekers)
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const applicantId = req.user.id;

    // Get application
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicantId !== applicantId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if application can be withdrawn
    if (application.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw accepted application'
      });
    }

    // Update application status to withdrawn
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: 'withdrawn' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application',
      error: error.message
    });
  }
};

// Get application statistics (for employers)
const getApplicationStats = async (req, res) => {
  try {
    const employerId = req.user.id;

    // Get all jobs by employer
    const jobs = await prisma.job.findMany({
      where: { employerId },
      select: { id: true }
    });

    const jobIds = jobs.map(job => job.id);

    // Get application statistics
    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        jobId: {
          in: jobIds
        }
      },
      _count: {
        status: true
      }
    });

    const totalApplications = await prisma.application.count({
      where: {
        jobId: {
          in: jobIds
        }
      }
    });

    const formattedStats = {
      total: totalApplications,
      pending: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
      shortlisted: 0,
      interview_scheduled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.status] = stat._count.status;
    });

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application statistics',
      error: error.message
    });
  }
};

// Get recent applications (for dashboard)
const getRecentApplications = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user.id;
    const userType = req.user.userType;

    let applications;

    if (userType === 'employer') {
      // Get recent applications for employer's jobs
      const jobs = await prisma.job.findMany({
        where: { employerId: userId },
        select: { id: true }
      });

      const jobIds = jobs.map(job => job.id);

      applications = await prisma.application.findMany({
        where: {
          jobId: {
            in: jobIds
          }
        },
        take: parseInt(limit),
        orderBy: { appliedAt: 'desc' },
        include: {
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              isVerified: true
            }
          },
          job: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        }
      });
    } else {
      // Get recent applications by user
      applications = await prisma.application.findMany({
        where: { applicantId: userId },
        take: parseInt(limit),
        orderBy: { appliedAt: 'desc' },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              category: true,
              location: true,
              employer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                  isVerified: true
                }
              }
            }
          }
        }
      });
    }

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get recent applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent applications',
      error: error.message
    });
  }
};

// Get all applications (for admin)
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId, applicantId } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (status && ['pending', 'accepted', 'rejected', 'withdrawn', 'shortlisted', 'interview_scheduled'].includes(status)) {
      where.status = status;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    if (applicantId) {
      where.applicantId = applicantId;
    }

    const applications = await prisma.application.findMany({
      where,
      skip,
      take,
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            salary: true,
            salaryType: true,
            employer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            skills: true,
            location: true,
            rating: true,
            totalRatings: true,
            isVerified: true
          }
        }
      }
    });

    const totalCount = await prisma.application.count({ where });
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
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
  getRecentApplications,
  getAllApplications
};