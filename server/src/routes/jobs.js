const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { authenticate, restrictTo } = require('../middleware/auth'); // Changed 'protect' to 'authenticate'
const { 
  validateJobCreation, 
  validateJobUpdate, 
  validateJobApplication,
  validateJobQuery,
  validateUUID,
  validateSearch
} = require('../middleware/validation');

// Public routes
router.get('/', validateJobQuery, jobsController.getAllJobs);
router.get('/search', validateSearch, jobsController.searchJobs);
router.get('/featured', validateJobQuery, jobsController.getFeaturedJobs);
router.get('/:id', validateUUID, jobsController.getJob);

// Protected routes - All users
router.use(authenticate); // Changed 'protect' to 'authenticate'

// Worker routes
router.post('/:id/apply', validateUUID, validateJobApplication, jobsController.applyForJob);

// Employer routes
router.post('/', restrictTo('employer'), validateJobCreation, jobsController.createJob);
router.put('/:id', restrictTo('employer'), validateUUID, validateJobUpdate, jobsController.updateJob);
router.delete('/:id', restrictTo('employer'), validateUUID, jobsController.deleteJob);
router.get('/my-jobs/posted', restrictTo('employer'), validateJobQuery, jobsController.getMyJobs);

// Both worker and employer routes
router.get('/my-jobs/applied', restrictTo('worker'), validateJobQuery, jobsController.getMyApplications);

// Admin routes
router.post('/:id/boost', restrictTo('admin'), validateUUID, jobsController.boostJob);
router.post('/:id/feature', restrictTo('admin'), validateUUID, jobsController.featureJob);

module.exports = router;