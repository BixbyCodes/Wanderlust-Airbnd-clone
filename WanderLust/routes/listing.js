const express = require("express");
const router = express.Router();

// Import required models, utilities, and validation schemas
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../schemas/listing.js");
const { validateObjectId } = require("../schemas/params.js");

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
router.get("/", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings, query: req.query})
}));

/**
 * GET /listings/new
 * Route to display the form for creating a new listing
 * 
 * What it does:
 * - Renders the new listing form page
 * - No database operations, just displays the form
 * 
 * Response:
 * - Renders listings/new.ejs
 */
router.get("/new",(req,res) =>{
    res.render("listings/new.ejs");
});

/**
 * POST /listings
 * Route to create a new listing
 * 
 * What it does:
 * - Validates the listing data using Joi schema
 * - Creates a new Listing document in the database
 * - Redirects to the listings index page with success message
 * 
 * Body:
 * - listing[title]: Title of the listing
 * - listing[description]: Description of the listing
 * - listing[image]: Image URL of the listing
 * - listing[price]: Price of the listing
 * - listing[location]: Location of the listing
 * - listing[country]: Country of the listing
 * 
 * Response:
 * - Redirects to /listings with success message
 */
router.post("/", validateListing, wrapAsync(async(req,res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings?success=Listing added successfully!");
}));

/**
 * GET /listings/:id
 * Route to display a specific listing with its details and reviews
 * 
 * What it does:
 * - Validates the listing ID format
 * - Finds the listing by ID and populates its reviews
 * - Renders the listing show page with full details
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * 
 * Response:
 * - Renders listings/show.ejs with listing data (including populated reviews)
 */
router.get("/:id", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
}));

/**
 * GET /listings/:id/edit
 * Route to display the edit form for a specific listing
 * 
 * What it does:
 * - Validates the listing ID format
 * - Finds the listing by ID
 * - Renders the edit form pre-populated with current listing data
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * 
 * Response:
 * - Renders listings/edit.ejs with current listing data
 */
router.get("/:id/edit", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/edit.ejs" ,{listing});
}));

/**
 * PUT /listings/:id
 * Route to update a specific listing
 * 
 * What it does:
 * - Validates both the listing ID format and the updated data
 * - Finds and updates the listing with new data
 * - Redirects to the listings index page
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * 
 * Body:
 * - listing[title]: Updated title
 * - listing[description]: Updated description
 * - listing[image]: Updated image URL
 * - listing[price]: Updated price
 * - listing[location]: Updated location
 * - listing[country]: Updated country
 * 
 * Response:
 * - Redirects to /listings
 */
router.put("/:id", validateObjectId, validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.redirect("/listings");
}));

/**
 * DELETE /listings/:id
 * Route to delete a specific listing
 * 
 * What it does:
 * - Validates the listing ID format
 * - Finds and deletes the listing from the database
 * - Logs the deleted listing for debugging
 * - Redirects to the listings index page
 * 
 * Parameters:
 * - id: MongoDB ObjectId of the listing
 * 
 * Response:
 * - Redirects to /listings
 */
router.delete("/:id", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    if (!deleteListing) {
        throw new Error("Listing not found");
    }
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports = router;