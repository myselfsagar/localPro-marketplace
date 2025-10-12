const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const reviewService = require("../services/review.service");

// Renders the page for creating a new review
exports.getNewReviewPage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId, {
      include: { model: Service, attributes: ["name"] },
    });

    // Security check: Make sure the logged-in user owns this booking
    if (!booking || booking.customerId !== req.user.id) {
      return res.redirect("/dashboard");
    }

    res.render("pages/reviews/new", {
      pageTitle: "Leave a Review",
      booking: booking,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/dashboard");
  }
};

// Handles the submission of the new review form
exports.postNewReview = async (req, res) => {
  try {
    await reviewService.createReview(req.body, req.user.id);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Failed to create review:", error);
    // Optional: Redirect back with an error message
    res.redirect("/dashboard");
  }
};
