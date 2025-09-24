const multer = require("multer");
const path = require("path");

// Store uploads under public/uploads so they can be served statically
const uploadsDir = path.join(__dirname, "../public/uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, unique + ext);
    },
});

// Only allow basic image mime types
function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]; 
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;





