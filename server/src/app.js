const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const usersRoutes = require('./routes/users');
const applicationsRoutes = require('./routes/applications');
const consentRoutes = require('./routes/consent.route');

// Import middleware - FIXED: Import the correct function
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware - UPDATED CSP to be less restrictive
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:", "http:"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - IMPROVED
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://farmwork-hub.vercel.app',
      // Add your production frontend URL here
    ];
    
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('Request with no origin allowed');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware - MOVED BEFORE RATE LIMITING
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - APPLIED AFTER BODY PARSING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/';
  }
});

app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 10 to 20 for better UX
  message: {
    status: 'error',
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// Rate limiting for consent endpoint
const consentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    status: 'error',
    error: 'Too many consent requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/consent', consentLimiter);

// Compression middleware
app.use(compression());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logging middleware - ENHANCED
if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
  
  // Additional logging for development
  app.use((req, res, next) => {
    if (req.method === 'PUT' || req.method === 'POST') {
      console.log(`${req.method} ${req.path}`, {
        body: req.body,
        headers: {
          'content-type': req.headers['content-type'],
          'authorization': req.headers.authorization ? 'Bearer ***' : 'None'
        }
      });
    }
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes - FIXED: Removed redundant middleware and cleaned up
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/consent', consentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'FarmWork Hub API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// API documentation endpoint - ENHANCED
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'FarmWork Hub API',
    version: '1.0.0',
    description: 'Agricultural job matching platform API for Africa',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/me': 'Get current user profile',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password'
      },
      jobs: {
        'GET /api/jobs': 'Get all jobs with filters',
        'POST /api/jobs': 'Create new job (auth required)',
        'GET /api/jobs/:id': 'Get job details',
        'PUT /api/jobs/:id': 'Update job (auth required)',
        'DELETE /api/jobs/:id': 'Delete job (auth required)',
        'POST /api/jobs/:id/apply': 'Apply for job (auth required)',
        'GET /api/jobs/my-jobs': 'Get user posted jobs'
      },
      applications: {
        'GET /api/applications': 'Get user applications',
        'POST /api/applications': 'Create new application',
        'GET /api/applications/:id': 'Get application details',
        'PUT /api/applications/:id': 'Update application status',
        'DELETE /api/applications/:id': 'Delete/withdraw application',
        'GET /api/applications/stats': 'Get application statistics',
        'GET /api/applications/recent': 'Get recent applications'
      },
      users: {
        'GET /api/users/profile': 'Get user profile (auth required)',
        'PUT /api/users/profile': 'Update user profile (auth required)',
        'POST /api/users/upload-avatar': 'Upload profile picture (auth required)',
        'GET /api/users/:id/rating': 'Get user ratings',
        'POST /api/users/:id/rate': 'Rate user (auth required)',
        'GET /api/users/workers': 'Get workers list',
        'GET /api/users/employers': 'Get employers list'
      },
      consent: {
        'POST /api/consent': 'Log user consent for data processing'
      }
    }
  });
});

// Debug endpoint to test routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    message: 'Available routes',
    routes: routes
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last) - FIXED: Use the correct function
app.use(globalErrorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 FarmWork Hub server running on port ${PORT}`);
    console.log(`📚 API documentation available at http://localhost:${PORT}/api/docs`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
    console.log(`🐛 Debug routes available at http://localhost:${PORT}/api/debug/routes`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}