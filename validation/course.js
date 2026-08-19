const Joi = require('../utils/joiSanitize');

const courseSchema = Joi.object({
  courseCode: Joi.string().escapeHTML().trim().required(),
  courseName: Joi.string().escapeHTML().trim().required()
});

module.exports = courseSchema;
