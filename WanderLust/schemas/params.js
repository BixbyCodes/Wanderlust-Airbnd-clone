const Joi = require('joi');

// Validation schema for MongoDB ObjectId parameters
const objectIdSchema = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
    });

// Validation middleware for ID parameters
const validateObjectId = (req, res, next) => {
    const { error } = objectIdSchema.validate(req.params.id);
    
    if (error) {
        const isApiRequest = req.originalUrl.startsWith('/api/') || req.headers.accept?.includes('application/json');
        
        if (isApiRequest) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        } else {
            return res.status(400).render("error.ejs", { 
                error: { message: error.details[0].message } 
            });
        }
    }
    
    next();
};

module.exports = { objectIdSchema, validateObjectId };
