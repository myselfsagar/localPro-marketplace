const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Create a storage engine for Multer to upload to Cloudinary for services
const serviceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "localpro_services",
    format: async (req, file) => "png",
    public_id: (req, file) =>
      `service-${req.params.serviceId || "new"}-${Date.now()}`,
  },
});

const uploadServiceImage = multer({
  storage: serviceStorage,
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

module.exports = uploadServiceImage;
