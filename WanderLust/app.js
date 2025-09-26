const express = require("express");
const app = express(); // create our Express app instance
const mongoose = require("mongoose"); // MongoDB ODM
const path = require("path"); // utilities for file paths
const methodOverride = require("method-override"); // supports PUT/DELETE via ?_method
const ejsMate = require("ejs-mate"); // EJS layouts/partials
const session = require("express-session"); // session middleware
const flash = require("connect-flash"); // flash message middleware
const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local"); // local username/password strategy

require("dotenv").config();
const User = require("./models/user.js");
// Import route files
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
// ...existing code...
// Import middleware
const errorHandler = require("./middleware/errorHandler.js"); // generic error handler
const notFound = require("./middleware/notFound.js"); // 404 handler
// Import controllers
const listingController = require("./controllers/listingController.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust"; // database connection string
let dbUrl = process.env.ATLASDB_URL || MONGO_URL;
if (!process.env.ATLASDB_URL) {
    console.warn(
        "ATLASDB_URL not set; falling back to local MongoDB at mongodb://127.0.0.1:27017/wanderLust"
    );
}
// Ensure a database name is present in the URI; if missing, default to '/wanderLust'
try {
    if (dbUrl.startsWith("mongodb")) {
        const parsed = new URL(dbUrl);
        // If pathname is empty or just '/', set default DB name
        if (!parsed.pathname || parsed.pathname === "/") {
            parsed.pathname = "/wanderLust";
            dbUrl = parsed.toString();
        }
        // For Atlas clusters, ensure authSource is set to admin if missing
        if (parsed.hostname.includes("mongodb.net")) {
            if (!parsed.searchParams.has("authSource")) {
                parsed.searchParams.set("authSource", "admin");
                dbUrl = parsed.toString();
            }
        }
        // Mask credentials for logging
        const masked = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
        console.log(`MongoDB target => ${masked}`);
    }
} catch (e) {
    // If URL parsing fails (very old formats), proceed without normalization
}

main()
    .then(() => {
        console.log("Connected to DB");
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// Configure Express app settings
app.set("view engine", "ejs"); // use EJS for templates
app.set("views", path.join(__dirname, "views")); // set views directory
app.use(express.urlencoded({ extended: true })); // parse form data from POST
app.use(methodOverride("_method")); // allow PUT/DELETE via ?_method
app.engine("ejs", ejsMate); // enable layouts/partials in EJS
app.use(express.static(path.join(__dirname, "/public"))); // serve static assets
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
};

// Session middleware must come before passport and routes
app.use(session(sessionOptions));
// Flash middleware hooks into session to store one-time messages
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Expose flash messages to all views via locals
app.use((req, res, next) => {
    // success messages set with req.flash('success', '...')
    res.locals.success = req.flash("success");
    // error messages set with req.flash('error', '...')
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Root route -> render listings index directly
app.get("/", listingController.index);

// Test route to demonstrate Joi validation (can be removed in production)
app.get("/test-validation", (req, res) => {
    res.send(`
        <h2>Joi Validation Test</h2>
{{ ... }}
            <li><a href="/listings/invalid-id">Invalid ID format</a></li>
            <li><a href="/listings/507f1f77bcf86cd799439011">Valid ID format (might not exist)</a></li>
        </ul>
        <p>Or try submitting the form with invalid data to see Joi validation in action!</p>
    `);
});

// Use route files (moved after middleware setup)
app.use("/listings", listingRoutes);
app.use("/", reviewRoutes);
app.use("/", authRoutes);
app.use("/users", userRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

// Start the server
// Server start moved to run after successful DB connection above
