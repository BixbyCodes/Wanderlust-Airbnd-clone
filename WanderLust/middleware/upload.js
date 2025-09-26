const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Store uploads under public/uploads so they can be served statically
const uploadsDir = path.join(__dirname, "../public/uploads");

// Ensure the uploads directory exists at runtime (important on platforms like Render)
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`[upload] Created uploads directory at ${uploadsDir}`);
    } catch (e) {
        console.error(`[upload] Failed to create uploads directory at ${uploadsDir}:`, e);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Double-check existence to be safe in concurrent environments
        try {
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
        } catch (e) {
            return cb(e);
        }
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





