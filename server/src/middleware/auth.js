const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError, catchAsync } = require('./errorHandler');

const prisma = new PrismaClient();

// Verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Authentication middleware
const authenticate = catchAsync(async (req, res, next) => {
  // 1) Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = await verifyToken(token);

  // 3) Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userType: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user is verified (optional - depends on your requirements)
  // if (!currentUser.isVerified) {
  //   return next(new AppError('Please verify your email before accessing this resource.', 401));
  // }

  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});

// Authorization middleware - restrict to certain user types
const restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = await verifyToken(token);
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (currentUser) {
        req.user = currentUser;
      }
    } catch (err) {
      // Token is invalid, but we don't fail - just continue without user
    }
  }

  next();
});

// Check if user owns the resource
const checkResourceOwnership = (resourceModel, resourceParam = 'id') => {
  return catchAsync(async (req, res, next) => {
    const resourceId = req.params[resourceParam];
    
    let resource;
    if (resourceModel === 'job') {
      resource = await prisma.job.findUnique({
        where: { id: resourceId },
        select: { employerId: true }
      });
      
      if (!resource || resource.employerId !== req.user.id) {
        return next(new AppError('You do not have permission to access this resource', 403));
      }
    } else if (resourceModel === 'application') {
      resource = await prisma.application.findUnique({
        where: { id: resourceId },
        select: { applicantId: true }
      });
      
      if (!resource || resource.applicantId !== req.user.id) {
        return next(new AppError('You do not have permission to access this resource', 403));
      }
    }
    
    next();
  });
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.user) return next();
    
    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId);
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    requests.set(userId, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return next(new AppError('Too many requests, please try again later', 429));
    }
    
    validRequests.push(now);
    requests.set(userId, validRequests);
    
    next();
  };
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  next();
};

// Employer only middleware
const employerOnly = (req, res, next) => {
  if (req.user.userType !== 'employer' && req.user.userType !== 'admin') {
    return next(new AppError('Access denied. Employer privileges required.', 403));
  }
  next();
};

// Worker only middleware
const workerOnly = (req, res, next) => {
  if (req.user.userType !== 'worker' && req.user.userType !== 'admin') {
    return next(new AppError('Access denied. Worker privileges required.', 403));
  }
  next();
};

module.exports = {
  authenticate,
  restrictTo,
  optionalAuth,
  checkResourceOwnership,
  userRateLimit,
  adminOnly,
  employerOnly,
  workerOnly
};