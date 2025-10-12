const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const ProviderProfile = require("../models/providerProfile.model");

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

async function updateBookingStatus(bookingId, providerUserId, newStatus) {
  // Find the booking and include its associated service and profile
  const booking = await Booking.findByPk(bookingId, {
    include: {
      model: Service,
      include: { model: ProviderProfile },
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // Security check: Ensure the logged-in user is the provider for this booking
  if (booking.Service.ProviderProfile.userId !== providerUserId) {
    throw new Error("Unauthorized: You do not own this booking.");
  }

  // Update the status and save the change
  booking.status = newStatus;
  await booking.save();

  return booking;
}

module.exports = {
  createBooking,
  updateBookingStatus,
};
