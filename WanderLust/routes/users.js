const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const userController = require("../controllers/userController.js");

// Only a user can edit their own profile
function isProfileOwner(req, res, next) {
    const { userId } = req.params;
    if (!req.user || String(req.user._id) !== String(userId)) {
        req.flash("error", "You do not have permission to edit this profile.");
        return res.redirect(`/users/${userId}`);
    }
    next();
}

router.get("/", wrapAsync(userController.index));
router.get("/:userId", wrapAsync(userController.show));
router.get("/:userId/edit", isLoggedIn, isProfileOwner, wrapAsync(userController.editForm));
router.put("/:userId", isLoggedIn, isProfileOwner, wrapAsync(userController.update));

module.exports = router;





