// middleware/ownership.js
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Generic placeholder; not used directly
module.exports.isOwner = (req, res, next) => {
    next();
};

// Ensure the current user owns the listing before allowing edits/updates/deletes
module.exports.isListingOwner = async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash("error", "You must be signed in.");
            if (req.method === "GET") req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }
        const { id } = req.params;
        const listing = await Listing.findById(id).select("owner");
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        if (String(listing.owner) !== String(req.user._id)) {
            req.flash("error", "You do not have permission to modify this listing.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

// Ensure the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash("error", "You must be signed in.");
            if (req.method === "GET") req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId).select("author");
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect("/listings");
        }
        if (String(review.author) !== String(req.user._id)) {
            req.flash("error", "You do not have permission to modify this review.");
            return res.redirect("back");
        }
        next();
    } catch (err) {
        next(err);
    }
};
