const Booking = require("../models/booking.model");

// This function creates a new booking record in the database
async function createBooking(bookingData) {
  const { serviceId, bookingDate, customerId } = bookingData;

  if (!serviceId || !bookingDate || !customerId) {
    throw new Error("Missing required booking information.");
  }

  const newBooking = await Booking.create({
    serviceId: serviceId,
    bookingDate: bookingDate,
    customerId: customerId,
    // The 'status' will default to 'pending' as defined in the model
  });

  return newBooking;
}

module.exports = {
  createBooking,
};
