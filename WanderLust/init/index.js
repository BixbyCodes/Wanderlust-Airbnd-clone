const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

let MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderLust";
if (!process.env.ATLASDB_URL) {
    console.warn(
        "[seed] ATLASDB_URL not set; falling back to local MongoDB at mongodb://127.0.0.1:27017/wanderLust"
    );
}

try {
    if (MONGO_URL.startsWith("mongodb")) {
        const parsed = new URL(MONGO_URL);
        if (!parsed.pathname || parsed.pathname === "/") {
            parsed.pathname = "/wanderLust";
            MONGO_URL = parsed.toString();
        }
        const masked = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
        console.log(`[seed] MongoDB target => ${masked}`);
    }
} catch (e) {
    // ignore parsing issues for legacy URIs
}

main()
.then(() => {
    console.log("Connected to DB");
    
})
.catch((err) => {
    console.error("err" );  
    
});
// .then(() => {
//     console.log("Database initialized");
//     process.exit();
// })
// .catch((err) => {
//     console.error("Connection error:", err);
//     process.exit(1);
// });

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
        await Listing.deleteMany({});
        await Listing.insertMany(initdata.data);
        console.log("Data was initialized");
    };

    initDB() ;