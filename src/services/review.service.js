const Review = require("../models/review.model");
const Booking = require("../models/booking.model");

async function createReview(reviewData, customerId) {
  const { bookingId, rating, comment } = reviewData;

  // 1. Find the booking
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    throw new Error("Booking not found.");
  }

  // 2. Security Check: Ensure the person leaving the review is the customer for this booking
  if (booking.customerId !== customerId) {
    throw new Error("Unauthorized: You cannot review this booking.");
  }

  // 3. Status Check: Ensure the booking is 'completed'
  if (booking.status !== "completed") {
    throw new Error("Cannot review a booking that is not completed.");
  }

  // 4. Uniqueness Check: Ensure a review for this booking doesn't already exist
  const existingReview = await Review.findOne({ where: { bookingId } });
  if (existingReview) {
    throw new Error("A review for this booking already exists.");
  }

  // 5. Create the review
  const newReview = await Review.create({
    bookingId,
    rating,
    comment,
  });

  return newReview;
}

module.exports = { createReview };
