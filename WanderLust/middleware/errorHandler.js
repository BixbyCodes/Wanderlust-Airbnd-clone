// Custom error handling middleware for Express

const errorHandler = (err, req, res, next) => {
    console.error("Error Details:", {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Check if it's an API request (expects JSON response)
    const isApiRequest = req.originalUrl.startsWith('/api/') || req.headers.accept?.includes('application/json');

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = {};
        for (let field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        
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
                return res.status(400).render("error.ejs", { error: { message: "Validation Error: " + Object.values(errors).join(", ") } });
            }
        }
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        const message = "Invalid ID format";
        if (isApiRequest) {
            return res.status(400).json({ success: false, message });
        } else {
            return res.status(400).render("error.ejs", { error: { message } });
        }
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        if (isApiRequest) {
            return res.status(400).json({ success: false, message });
        } else {
            return res.status(400).render("error.ejs", { error: { message } });
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = "Invalid token";
        if (isApiRequest) {
            return res.status(401).json({ success: false, message });
        } else {
            return res.status(401).render("error.ejs", { error: { message } });
        }
    }

    if (err.name === 'TokenExpiredError') {
        const message = "Token expired";
        if (isApiRequest) {
            return res.status(401).json({ success: false, message });
        } else {
            return res.status(401).render("error.ejs", { error: { message } });
        }
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (isApiRequest) {
        res.status(statusCode).json({
            success: false,
            message: message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    } else {
        res.status(statusCode).render("error.ejs", { 
            error: { 
                message: message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            } 
        });
    }
};

module.exports = errorHandler;
