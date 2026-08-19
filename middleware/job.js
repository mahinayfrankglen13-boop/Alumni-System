const ExpressError = require('../utils/ExpressError');
const jobSchema = require('../validation/job');

const validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    return next(new ExpressError(msg, 400));
  }

  next();
};

module.exports = validateJob;