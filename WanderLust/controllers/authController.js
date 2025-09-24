// Auth controller: handles register, login, logout
const passport = require("passport");
const User = require("../models/user.js");

function showRegister(req, res) {
    res.render("includes/register.ejs");
}

async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

function showLogin(req, res) {
    res.render("includes/login.ejs");
}

const login = [
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = req.session.returnTo || "/listings";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },
];

function logout(req, res, next) {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash("success", "Logged out successfully.");
        res.redirect("/listings");
    });
}

module.exports = { showRegister, register, showLogin, login, logout };





