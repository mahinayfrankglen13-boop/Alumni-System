const Joi = require('../utils/joiSanitize');

const jobSchema = Joi.object({
  title: Joi.string().escapeHTML().trim().required(),
  company: Joi.string().escapeHTML().trim().required(),
  description: Joi.string().escapeHTML().trim().required(),
  location: Joi.string().escapeHTML().trim().allow(''),
  applicationUrl: Joi.string().uri().required()
});

module.exports = jobSchema;