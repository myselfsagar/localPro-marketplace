const express = require("express");
const bookingController = require("../controllers/booking.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

// Middleware to ensure only customers can book
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    return next();
  }
  res.redirect("/providers"); // Providers can't book services
};

// GET /book/new/:serviceId - Renders the booking confirmation page
router.get(
  "/new/:serviceId",
  isAuthenticated,
  isCustomer,
  bookingController.getNewBookingPage
);

// POST / - Handles the booking form submission
router.post("/", isAuthenticated, isCustomer, bookingController.postNewBooking);

module.exports = router;
