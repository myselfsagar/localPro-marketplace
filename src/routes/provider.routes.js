const express = require("express");
const providerController = require("../controllers/provider.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const uploadServiceImage = require("../middleware/uploadServiceImage.middleware");

const router = express.Router();

// A simple middleware to check if the user is a provider
const isProvider = (req, res, next) => {
  if (req.user && req.user.role === "provider") {
    return next();
  }
  // If not a provider, redirect them away
  res.redirect("/dashboard");
};

// GET /provider/profile - Shows the profile management page
router.get(
  "/profile",
  isAuthenticated,
  isProvider,
  providerController.getProfilePage
);

// POST /provider/profile - Handles the form submission
router.post(
  "/profile",
  isAuthenticated,
  isProvider,
  upload.single("profileImage"),
  providerController.postProfilePage
);

// GET route to show the "add new service" form
router.get(
  "/services/new",
  isAuthenticated,
  isProvider,
  providerController.getAddServicePage
);

// POST route to handle the form submission
router.post(
  "/services",
  isAuthenticated,
  isProvider,
  uploadServiceImage.single("serviceImage"),
  providerController.postAddService
);

// POST /provider/bookings/:bookingId/status - Updates a booking's status
router.post(
  "/bookings/:bookingId/status",
  isAuthenticated,
  isProvider,
  providerController.updateBookingStatus
);

module.exports = router;
