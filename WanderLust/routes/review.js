const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { validateObjectId, validateReviewId } = require("../schemas/params.js");
const { validateReview } = require("../schemas/review.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const { isReviewAuthor } = require("../middleware/ownership.js");
const reviewController = require("../controllers/reviewController.js");

router.post('/reviews', reviewController.createReview);
router.delete('/reviews/:id', reviewController.deleteReview);

router.post(
    "/listings/:id/review",
    validateObjectId,
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.create)
);

router.delete(
    "/listings/:id/reviews/:reviewId",
    validateObjectId,
    validateReviewId,
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroy)
);

module.exports = router;