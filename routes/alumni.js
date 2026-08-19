const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const alumni = require('../controllers/alumni');
const { isLoggedIn, validateProfile } = require('../middleware/user');
const catchAsync = require('../utils/catchAsync');

// Dashboard
router.route('/dashboard')
  .get(isLoggedIn, catchAsync(alumni.renderDashboard));

// Profile
router.route('/profile')
  .get(isLoggedIn, catchAsync(alumni.renderProfile))
  .put(isLoggedIn, upload.single('profileImage'), catchAsync(validateProfile), catchAsync(alumni.updateProfile));

router.route('/profile/privacy')
  .put(isLoggedIn, catchAsync(alumni.updatePrivacy));

module.exports = router;