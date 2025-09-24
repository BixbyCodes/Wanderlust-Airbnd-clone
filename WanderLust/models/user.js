// User model: stores application users and password info (via plugin)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// We store email explicitly. The plugin adds username, hash, and salt.
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
});

// Plugin adds fields (username, hash, salt) and helper methods:
// - register(user, password), authenticate(), serializeUser(), deserializeUser()
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);