const ExpressError = require('../utils/ExpressError');
const courseSchema = require('../validation/course');

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    return next(new ExpressError(msg, 400));
  }

  next();
};

module.exports = validateCourse;
