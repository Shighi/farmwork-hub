const fs = require('fs');
const path = require('path');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Log error to file
const logError = (error, req) => {
  const logsDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req?.method,
    url: req?.url,
    ip: req?.ip,
    userAgent: req?.get('User-Agent'),
    error: {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500
    }
  };

  const logPath = path.join(logsDir, 'error.log');
  fs.appendFileSync(logPath, JSON.stringify(errorLog) + '\n');
};

// Handle cast errors (invalid MongoDB ObjectId, etc.)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle duplicate field errors
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Handle Prisma errors
const handlePrismaError = (err) => {
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`${field} already exists`, 409);
  }
  
  if (err.code === 'P2025') {
    // Record not found
    return new AppError('Record not found', 404);
  }
  
  if (err.code === 'P2003') {
    // Foreign key constraint violation
    return new AppError('Invalid reference to related record', 400);
  }
  
  if (err.code === 'P2014') {
    // Required relation violation
    return new AppError('Required relation missing', 400);
  }

  // Generic Prisma error
  return new AppError('Database operation failed', 500);
};

// Send error response in development
const sendErrorDev = (err, req, res) => {
  logError(err, req);
  
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Send error response in production
const sendErrorProd = (err, req, res) => {
  logError(err, req);
  
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
};

// Main error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'PrismaClientKnownRequestError') error = handlePrismaError(error);

    sendErrorProd(error, req, res);
  }
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async error handler wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
  }
  next();
};

module.exports = {
  AppError,
  globalErrorHandler,
  notFound,
  catchAsync,
  validationHandler
};