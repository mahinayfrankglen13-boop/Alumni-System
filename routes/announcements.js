const express = require('express');
const router = express.Router();
const announcements = require('../controllers/announcements');

const { isLoggedIn, isAdmin } = require('../middleware/user');
const { validateAnnouncement, isAnnouncementAuthor } = require('../middleware/announcement');
const catchAsync = require('../utils/catchAsync');

router.route('/announcement')
    .get(isLoggedIn, catchAsync(announcements.renderAnnouncements))
    .post(isLoggedIn, isAdmin, validateAnnouncement, catchAsync(announcements.createAnnouncement));

router.route('/announcement/:id')
    .put(isLoggedIn, isAdmin, isAnnouncementAuthor, validateAnnouncement, catchAsync(announcements.updateAnnouncement))
    .delete(isLoggedIn, isAdmin, isAnnouncementAuthor, catchAsync(announcements.deleteAnnouncement));

module.exports = router;