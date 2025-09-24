const Joi = require('joi');

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number between 1 and 5',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating must be at most 5',
    'any.required': 'Rating is required'
  }),
  comment: Joi.string().min(5).required().messages({
    'string.empty': 'Comment is required',
    'string.min': 'Comment must be at least 5 characters',
    'any.required': 'Comment is required'
  })
});

function validateReview(req, res, next) {
  const payload = req.body && req.body.review ? req.body.review : {};
  const { error } = reviewSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    // Aggregate messages and redirect to the listing show page
    const messages = error.details.map(d => d.message).join(', ');
    req.flash('error', `Review validation failed: ${messages}`);
    const { id } = req.params || {};
    return res.redirect(id ? `/listings/${id}` : '/listings');
  }
  // Replace with sanitized data
  req.body.review = payload;
  next();
}

module.exports = { reviewSchema, validateReview };
