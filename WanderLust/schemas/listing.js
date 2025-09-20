const Joi = require('joi');

// Joi validation schema for listing
const listingSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Add valid title',
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must be less than 100 characters',
            'any.required': 'Add valid title'
        }),
    
    description: Joi.string()
        .min(50) // This will count characters, not words
        .required()
        .custom((value, helpers) => {
            // Custom validation for word count
            const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
            if (wordCount < 50) {
                return helpers.error('custom.wordCount', { wordCount });
            }
            return value;
        })
        .messages({
            'string.empty': 'Add minimum 50 words description',
            'string.min': 'Description must be at least 50 characters long',
            'any.required': 'Add minimum 50 words description',
            'custom.wordCount': 'Description must contain at least 50 words (currently has {{#wordCount}} words)'
        }),
    
    image: Joi.string()
        .uri()
        .allow('')
        .optional()
        .messages({
            'string.uri': 'Add valid URL for image'
        }),
    
    price: Joi.number()
        .integer()
        .min(1)
        .max(1000000)
        .required()
        .messages({
            'number.base': 'Add valid price',
            'number.integer': 'Price must be a whole number',
            'number.min': 'Price must be at least ₹1',
            'number.max': 'Price cannot exceed ₹10,00,000',
            'any.required': 'Add valid price'
        }),
    
    location: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Location is required',
            'string.min': 'Location must be at least 2 characters long',
            'any.required': 'Location is required'
        }),
    
    country: Joi.string()
        .min(2)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.empty': 'Add valid country',
            'string.min': 'Country must be at least 2 characters long',
            'string.pattern.base': 'Country must contain only letters',
            'any.required': 'Add valid country'
        })
});

// Validation middleware function
const validateListing = (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body.listing, { 
        abortEarly: false, // Show all validation errors
        stripUnknown: true // Remove unknown fields
    });
    
    if (error) {
        const errors = {};
        error.details.forEach(detail => {
            const field = detail.path[0]; // Get the field name
            errors[field] = detail.message;
        });
        
        // Check if it's an API request
        const isApiRequest = req.originalUrl.startsWith('/api/') || req.headers.accept?.includes('application/json');
        
        if (isApiRequest) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errors
            });
        } else {
            // For web requests, render the form again with errors
            if (req.originalUrl.includes('/new')) {
                return res.render("listings/new.ejs", { errors, listing: req.body.listing });
            } else if (req.originalUrl.includes('/edit')) {
                return res.render("listings/edit.ejs", { errors, listing: req.body.listing });
            } else {
                return res.status(400).render("error.ejs", { 
                    error: { message: "Validation Error: " + Object.values(errors).join(", ") } 
                });
            }
        }
    }
    
    // Replace req.body.listing with validated and sanitized data
    req.body.listing = value;
    next();
};

module.exports = { listingSchema, validateListing };
