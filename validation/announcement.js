const Joi = require('../utils/joiSanitize');

const announcementSchema = Joi.object({
  title: Joi.string().escapeHTML().trim().required(),
  content: Joi.string().escapeHTML().trim().required()
});

module.exports = announcementSchema;
