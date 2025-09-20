const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

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