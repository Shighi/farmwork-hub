const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, restrictTo } = require('../middleware/auth'); // Changed 'protect' to 'authenticate'
const { 
  validateProfileUpdate, 
  validateUserRating,
  validateUUID,
  validateUserId,
  validateFileUpload,
  validatePasswordUpdate
} = require('../middleware/validation');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authenticate); // Changed from 'protect' to 'authenticate'

// Profile routes
router.get('/profile', usersController.getProfile);
router.put('/profile', validateProfileUpdate, usersController.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), validateFileUpload, usersController.uploadAvatar);

// User statistics and data
router.get('/stats', usersController.getUserStats);
router.get('/applications', usersController.getUserApplications);
router.get('/posted-jobs', restrictTo('employer', 'admin'), usersController.getUserPostedJobs);
router.get('/work-history', usersController.getUserWorkHistory);

// Password management
router.put('/password', validatePasswordUpdate, usersController.updatePassword);

// Account management
router.delete('/account', usersController.deleteAccount);

// User rating routes
router.get('/:id/rating', validateUserId, usersController.getUserRating);
router.post('/:id/rate', validateUserId, validateUserRating, usersController.rateUser);

// User discovery routes
router.get('/workers', restrictTo('employer', 'admin'), usersController.getWorkers);
router.get('/employers', restrictTo('worker', 'admin'), usersController.getEmployers);

// Admin routes
router.get('/all', restrictTo('admin'), usersController.getAllUsers);
router.put('/:id/verify', restrictTo('admin'), validateUserId, usersController.verifyUser);
router.put('/:id/suspend', restrictTo('admin'), validateUserId, usersController.suspendUser);
router.put('/:id/activate', restrictTo('admin'), validateUserId, usersController.activateUser);

module.exports = router;