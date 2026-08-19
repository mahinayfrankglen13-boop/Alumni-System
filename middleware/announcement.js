const ExpressError = require('../utils/ExpressError');
const announcementSchema = require('../validation/announcement');
const Announcement = require('../models/announcement');
const catchAsync = require('../utils/catchAsync');

const validateAnnouncement = (req, res, next) => {
  const { error } = announcementSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(msg, 400);
  }

  next();
};

const isAnnouncementAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ExpressError('Announcement not found', 404);
  }

  if (!announcement.createdBy || !announcement.createdBy.equals(req.user._id)) {
    throw new ExpressError('Forbidden: You do not have permission to modify this announcement', 403);
  }

  next();
});

module.exports = {
  validateAnnouncement,
  isAnnouncementAuthor
};
