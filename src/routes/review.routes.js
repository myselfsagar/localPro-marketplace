const express = require("express");
const reviewController = require("../controllers/review.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

// GET /reviews/new/:bookingId - Shows the form to leave a review
router.get(
  "/new/:bookingId",
  isAuthenticated,
  reviewController.getNewReviewPage
);

// POST /reviews - Submits the new review
router.post("/", isAuthenticated, reviewController.postNewReview);

module.exports = router;
