const passport = require("passport");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports = {
    // Legacy/simple endpoints (not used by views) kept for compatibility
    createReview: async (req, res, next) => {
        try {
            const { listingId, rating, comment } = req.body;
            const listing = await Listing.findById(listingId);
            if (!listing) {
                req.flash("error", "Listing not found");
                return res.redirect("/listings");
            }
            const review = new Review({ rating, comment, author: req.user._id });
            await review.save();
            // Use atomic update to avoid validating legacy listings without owner
            await Listing.findByIdAndUpdate(listing._id, { $push: { reviews: review._id } });
            req.flash("success", "Review added");
            res.redirect(`/listings/${listing._id}`);
        } catch (err) {
            next(err);
        }
    },
    deleteReview: async (req, res, next) => {
        try {
            const { id } = req.params; // treat as review id for this legacy route
            const review = await Review.findById(id);
            if (!review) {
                req.flash("error", "Review not found");
                return res.redirect("/listings");
            }
            // Also remove from any listing that references it
            await Listing.updateMany({ reviews: id }, { $pull: { reviews: id } });
            await Review.findByIdAndDelete(id);
            req.flash("success", "Review deleted");
            res.redirect("/listings");
        } catch (err) {
            next(err);
        }
    },

    // View-used endpoints
    create: async (req, res, next) => {
        try {
            const { id } = req.params; // listing id
            const listing = await Listing.findById(id);
            if (!listing) {
                req.flash("error", "Listing not found");
                return res.redirect("/listings");
            }
            const { rating, comment } = req.body.review || {};
            const review = new Review({ rating, comment, author: req.user._id });
            await review.save();
            // Use atomic update to avoid validating legacy listings without owner
            await Listing.findByIdAndUpdate(id, { $push: { reviews: review._id } });
            req.flash("success", "Review added");
            res.redirect(`/listings/${id}`);
        } catch (err) {
            next(err);
        }
    },
    destroy: async (req, res, next) => {
        try {
            const { id, reviewId } = req.params; // listing id, review id
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            req.flash("success", "Review deleted");
            res.redirect(`/listings/${id}`);
        } catch (err) {
            next(err);
        }
    }
};