// Listing controller: handles all Listing-related request logic
const Listing = require("../models/listing.js");

// GET /listings
async function index(req, res) {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, query: req.query });
}

// GET /listings/new
function newForm(req, res) {
    res.render("listings/new.ejs");
}

// POST /listings
async function create(req, res, next) {
    try {
        if (!req.user) {
            req.flash("error", "You must be signed in to create a listing.");
            if (req.method === "GET") req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        // if an image file was uploaded, store its public URL path
        if (req.file) {
            newListing.image = "/uploads/" + req.file.filename;
        }
        await newListing.save();
        req.flash("success", "Listing added successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}

// GET /listings/:id
async function show(req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
}

// GET /listings/:id/edit
async function editForm(req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}

// PUT /listings/:id
async function update(req, res) {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.redirect("/listings");
}

// DELETE /listings/:id
async function destroy(req, res) {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    if (!deleteListing) {
        throw new Error("Listing not found");
    }
    console.log(deleteListing);
    res.redirect("/listings");
}

module.exports = { index, newForm, create, show, editForm, update, destroy };


