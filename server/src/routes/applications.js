const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const { authenticate, restrictTo, checkResourceOwnership } = require('../middleware/auth');
const { 
  validateApplicationStatusUpdate,
  validateUUID,
  validateJobId,
  validateJobQuery
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Worker routes
router.get('/', 
  restrictTo('worker'), 
  validateJobQuery, 
  applicationsController.getMyApplications
);

router.get('/:id', 
  validateUUID, 
  checkResourceOwnership('application'),
  applicationsController.getApplication
);

router.delete('/:id', 
  validateUUID, 
  checkResourceOwnership('application'),
  applicationsController.withdrawApplication
);

// Employer routes
router.get('/job/:jobId', 
  restrictTo('employer'), 
  validateJobId, 
  validateJobQuery, 
  checkResourceOwnership('job', 'jobId'),
  applicationsController.getJobApplications
);

router.put('/:id', 
  restrictTo('employer'), 
  validateUUID, 
  validateApplicationStatusUpdate, 
  applicationsController.updateApplicationStatus
);

// Admin routes
router.get('/all', 
  restrictTo('admin'), 
  validateJobQuery, 
  applicationsController.getAllApplications
);

module.exports = router;