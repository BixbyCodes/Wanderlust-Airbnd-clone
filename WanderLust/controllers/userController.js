// User controller: basic user listing and profile management
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// GET /users - list all users (simple directory)
async function index(req, res) {
    const users = await User.find({}, { username: 1, email: 1 });
    res.render("users/index.ejs", { users });
}

// GET /users/:userId - show a user's profile with their listings and reviews
async function show(req, res) {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const listings = await Listing.find({ owner: userId });
    const reviews = await Review.find({ author: userId });
    res.render("users/show.ejs", { user, listings, reviews });
}

// GET /users/:userId/edit - edit profile form
async function editForm(req, res) {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    res.render("users/edit.ejs", { user });
}

// PUT /users/:userId - update profile (username/email only)
async function update(req, res) {
    const { userId } = req.params;
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
    if (!user) {
        throw new Error("User not found");
    }
    req.flash("success", "Profile updated");
    res.redirect(`/users/${userId}`);
}

module.exports = { index, show, editForm, update };





