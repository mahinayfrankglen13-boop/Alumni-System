const express = require('express');
const router = express.Router();
const courses = require('../controllers/courses');

const { isLoggedIn, isAdmin } = require('../middleware/user');
const validateCourse = require('../middleware/course');
const catchAsync = require('../utils/catchAsync');

router.route('/courses')
    .get(isLoggedIn, isAdmin, catchAsync(courses.renderCourses))
    .post(isLoggedIn, isAdmin, validateCourse, catchAsync(courses.createCourse));

router.route('/courses/:id')
    .put(isLoggedIn, isAdmin, validateCourse, catchAsync(courses.updateCourse))
    .delete(isLoggedIn, isAdmin, catchAsync(courses.deleteCourse));

module.exports = router;