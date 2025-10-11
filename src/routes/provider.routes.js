const express = require("express");
const providerController = require("../controllers/provider.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

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
  providerController.postProfilePage
);

module.exports = router;
