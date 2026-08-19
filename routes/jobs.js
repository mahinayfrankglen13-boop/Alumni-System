const express = require('express');
const router = express.Router();
const jobs = require('../controllers/jobs');

const { isLoggedIn, isAdmin } = require('../middleware/user');
const validateJob = require('../middleware/job');
const catchAsync = require('../utils/catchAsync');

router.route('/jobs')
  .get(isLoggedIn, catchAsync(jobs.renderJobs))
  .post(isLoggedIn, validateJob, catchAsync(jobs.createJob));

router.route('/jobs/:id/status')
  .put(isLoggedIn, isAdmin, catchAsync(jobs.updateJobStatus));

router.route('/jobs/:id')
  .put(isLoggedIn, validateJob, catchAsync(jobs.updateJob))
  .delete(isLoggedIn, catchAsync(jobs.deleteJob));

module.exports = router;
