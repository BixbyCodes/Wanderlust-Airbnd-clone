const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const errorHandler = require("./middleware/errorHandler.js");
const notFound = require("./middleware/notFound.js");
const { validateListing } = require("./schemas/listing.js");
const { validateObjectId } = require("./schemas/params.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.error("Connection error:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
    res.send("Server is up and running!");
});
app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings, query: req.query})
}))

app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
})

// Test route to demonstrate Joi validation (can be removed in production)
app.get("/test-validation", (req, res) => {
    res.send(`
        <h2>Joi Validation Test</h2>
        <p>Try these test cases:</p>
        <ul>
            <li><a href="/listings/invalid-id">Invalid ID format</a></li>
            <li><a href="/listings/507f1f77bcf86cd799439011">Valid ID format (might not exist)</a></li>
        </ul>
        <p>Or try submitting the form with invalid data to see Joi validation in action!</p>
    `);
})

app.get("/listings/:id", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
})) 

app.post("/listings", validateListing, wrapAsync(async(req,res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings?success=Listing added successfully!");
}))

app.get("/listings/:id/edit", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.render("listings/edit.ejs" ,{listing});
}))

app.put("/listings/:id", validateObjectId, validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!listing) {
        throw new Error("Listing not found");
    }
    res.redirect("/listings");
}))

//delete route
app.delete("/listings/:id", validateObjectId, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    if (!deleteListing) {
        throw new Error("Listing not found");
    }
    console.log(deleteListing);
    res.redirect("/listings");
}))


// 404 handler - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
