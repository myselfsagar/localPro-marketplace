const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Create a storage engine for Multer to upload to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "localpro_profiles", // Folder name in Cloudinary
    format: async (req, file) => "png", // supports 'png', 'jpeg', 'jpg', 'gif', 'webp'
    public_id: (req, file) => `profile-${req.user.id}-${Date.now()}`, // Unique public ID
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type, only JPEG, PNG and GIF are allowed!"),
        false
      );
    }
  },
});

module.exports = upload;
