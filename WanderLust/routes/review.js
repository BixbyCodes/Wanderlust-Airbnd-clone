const express = require("express");
const router = express.Router();

// Import required models and utilities
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateObjectId, validateReviewId } = require("../schemas/params.js");

/**
 * POST /listings/:id/review
 * Route to create a new review for a specific listing
 * 
 * What it does:
 * - Takes review data (comment and rating) from the form
 * - Creates a new Review document in the database
 * - Associates the review with the listing by adding it to the listing's reviews array
 * - Redirects back to the listing show page
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * 
 * Body:
 * - review[comment]: The review text
 * - review[rating]: Rating from 1-5
 */
router.post("/listings/:id/review", validateObjectId, wrapAsync(async(req,res) =>{
    console.log("=== REVIEW SUBMISSION DEBUG ===");
    console.log("Full req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.body.review:", JSON.stringify(req.body.review, null, 2));
    console.log("req.body.review.comment:", req.body.review?.comment);
    console.log("req.body.review.rating:", req.body.review?.rating);
    console.log("================================");
    
    // Find the listing by ID
    let listing = await Listing.findById(req.params.id);
    
    // Create a new review instance from the form data
    let newReview = new Review(req.body.review);

    // Add the review to the listing's reviews array
    listing.reviews.push(newReview);

    // Save both the new review and the updated listing
    await newReview.save();
    await listing.save();

    // Redirect back to the listing show page
    res.redirect(`/listings/${listing._id}`);
}));

/**
 * DELETE /listings/:id/reviews/:reviewId
 * Route to delete a specific review from a listing
 * 
 * What it does:
 * - Validates both listing ID and review ID formats
 * - Checks if both the listing and review exist in the database
 * - Removes the review reference from the listing's reviews array
 * - Deletes the actual review document from the database
 * - Redirects back to the listing show page
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * - reviewId: MongoDB ObjectId of the review to delete
 */
router.delete("/listings/:id/reviews/:reviewId", validateObjectId, validateReviewId, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // Check if the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }

    // Check if the review exists
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    // Remove the review reference from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review document from the database
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to the listing show page
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
