// Routes that handle user registration, login, and logout
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// Show the registration form
router.get("/register", authController.showRegister);



// Example login route
router.get('/login', (req, res) => {
    res.render('includes/login');
});

// ...other auth routes...


// Create a new user and log them in
router.post("/register", authController.register);

// Show the login form
router.get("/login", authController.showLogin);

// Log an existing user in
router.post("/login", authController.login);

// Log the current user out
router.post("/logout", authController.logout);

module.exports = router;


