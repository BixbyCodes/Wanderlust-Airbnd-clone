// Middleware to protect routes: only allow if user is logged in
module.exports = function isLoggedIn(req, res, next) {
    // Passport adds req.isAuthenticated() when sessions are used
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next(); // ok, continue to the route handler
    }
    // Save the page they were trying to reach, so we can send them back after login
    if (req.method === "GET") {
        req.session.returnTo = req.originalUrl;
    }
    // Tell the user to login and send them to the login page
    req.flash("error", "You must be signed in.");
    res.redirect("/login");
};


