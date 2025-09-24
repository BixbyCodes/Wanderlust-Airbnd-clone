const express = require("express");
const router = express.Router();

// Import required models, utilities, and validation schemas
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateListing } = require("../schemas/listing.js");
const { validateObjectId } = require("../schemas/params.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const { isListingOwner } = require("../middleware/ownership.js");
const listingController = require("../controllers/listingController.js");
const upload = require("../middleware/upload.js");

/**
 * GET /listings
 * Route to display all listings in a grid format
 * 
 * What it does:
 * - Fetches all listings from the database
 * - Renders the listings index page with all listings data
 * - Also passes query parameters for potential filtering/searching
 * 
 * Response:
 * - Renders listings/index.ejs with allListings data
 */
// router.get("/", wrapAsync(listingController.index));

// /**
//  * GET /listings/new
//  * Route to display the form for creating a new listing
//  * 
//  * What it does:
//  * - Renders the new listing form page
//  * - No database operations, just displays the form
//  * 
//  * Response:
//  * - Renders listings/new.ejs
//  */
// // Only logged-in users can see the "new listing" form
// router.get("/new", isLoggedIn, listingController.newForm);

// /**
//  * POST /listings
//  * Route to create a new listing
//  * 
//  * What it does:
//  * - Validates the listing data using Joi schema
//  * - Creates a new Listing document in the database
//  * - Redirects to the listings index page with success message
//  * 
//  * Body:
//  * - listing[title]: Title of the listing
//  * - listing[description]: Description of the listing
//  * - listing[image]: Image URL of the listing
//  * - listing[price]: Price of the listing
//  * - listing[location]: Location of the listing
//  * - listing[country]: Country of the listing
//  * 
//  * Response:
//  * - Redirects to /listings with success message
//  */
// // Only logged-in users can create listings (also validate input with Joi)
// // router.post("/", isLoggedIn, upload.single("imageFile"), validateListing, wrapAsync(listingController.create));

// /**
//  * GET /listings/:id
//  * Route to display a specific listing with its details and reviews
//  * 
//  * What it does:
//  * - Validates the listing ID format
//  * - Finds the listing by ID and populates its reviews
//  * - Renders the listing show page with full details
//  * 
//  * Parameters:
//  * - id: MongoDB ObjectId of the listing
//  * 
//  * Response:
//  * - Renders listings/show.ejs with listing data (including populated reviews)
//  */
// // router.get("/:id", (req, res, next) => next(), listingController.show);

// /**
//  * GET /listings/:id/edit
//  * Route to display the edit form for a specific listing
//  * 
//  * What it does:
//  * - Validates the listing ID format
//  * - Finds the listing by ID
//  * - Renders the edit form pre-populated with current listing data
//  * 
//  * Parameters:
//  * - id: MongoDB ObjectId of the listing
//  * 
//  * Response:
//  * - Renders listings/edit.ejs with current listing data
//  */
// // Only logged-in users can open the edit form for a listing
// // router.get("/:id/edit", validateObjectId, isLoggedIn, isListingOwner, wrapAsync(listingController.editForm));

// /**
//  * PUT /listings/:id
//  * Route to update a specific listing
//  * 
//  * What it does:
//  * - Validates both the listing ID format and the updated data
//  * - Finds and updates the listing with new data
//  * - Redirects to the listings index page
//  * 
//  * Parameters:
//  * - id: MongoDB ObjectId of the listing
//  * 
//  * Body:
//  * - listing[title]: Updated title
//  * - listing[description]: Updated description
//  * - listing[image]: Updated image URL
//  * - listing[price]: Updated price
//  * - listing[location]: Updated location
//  * - listing[country]: Updated country
//  * 
//  * Response:
//  * - Redirects to /listings
//  */
// // Only logged-in users can update a listing (also validate input)
// router.put("/:id", validateObjectId, isLoggedIn, isListingOwner, validateListing, wrapAsync(listingController.update));

// /**
//  * DELETE /listings/:id
//  * Route to delete a specific listing
//  * 
//  * What it does:
//  * - Validates the listing ID format
//  * - Finds and deletes the listing from the database
//  * - Logs the deleted listing for debugging
//  * - Redirects to the listings index page
//  * 
//  * Parameters:
//  * 
//  * Response:
//  * - Redirects to /listings
//  */
// // Only logged-in users can delete a listing
// router.delete("/:id", validateObjectId, isLoggedIn, isListingOwner, wrapAsync(listingController.destroy));

// Index - show all listings
router.get("/", wrapAsync(listingController.index));

// New - form to create listing (login required)
router.get("/new", isLoggedIn, listingController.newForm);

// Create - add listing (login required + optional file upload + validation)
router.post(
  "/",
  isLoggedIn,
  upload.single("imageFile"),
  validateListing,
  wrapAsync(listingController.create)
);

// Show - show one listing
router.get(
  "/:id",
  validateObjectId,
  wrapAsync(listingController.show)
);

// Edit - edit form (must be owner)
router.get(
  "/:id/edit",
  validateObjectId,
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.editForm)
);

// Update - update listing (must be owner)
router.put(
  "/:id",
  validateObjectId,
  isLoggedIn,
  isListingOwner,
  validateListing,
  wrapAsync(listingController.update)
);

// Destroy - delete listing (must be owner)
router.delete(
  "/:id",
  validateObjectId,
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.destroy)
);

module.exports = router;