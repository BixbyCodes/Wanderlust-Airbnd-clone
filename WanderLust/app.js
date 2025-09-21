const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Import route files
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

// Import middleware
const errorHandler = require("./middleware/errorHandler.js");
const notFound = require("./middleware/notFound.js");

// MongoDB connection URL
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
// Configure Express app settings
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Home route
app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

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
});

// Use route files
app.use("/listings", listingRoutes);
app.use("/", reviewRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

// Start the server
app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
