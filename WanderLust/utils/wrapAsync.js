// Utility function to wrap async route handlers and catch errors
// This eliminates the need for try-catch blocks in every async route

const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

module.exports = wrapAsync;
