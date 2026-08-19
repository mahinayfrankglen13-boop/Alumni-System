const express = require('express');
const router = express.Router();
const directory = require('../controllers/directory');

const { isLoggedIn, isAdmin } = require('../middleware/user');
const catchAsync = require('../utils/catchAsync');

router.route('/directory')
    .get(isLoggedIn, catchAsync(directory.renderDirectory));

router.route('/users/:id/status')
    .put(isLoggedIn, isAdmin, catchAsync(directory.updateUserStatus));

router.route('/users/:id')
    .delete(isLoggedIn, isAdmin, catchAsync(directory.deleteUser));

module.exports = router;