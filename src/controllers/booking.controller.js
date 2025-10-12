const Service = require("../models/service.model");
const ProviderProfile = require("../models/providerProfile.model");
const bookingService = require("../services/booking.service");

// Renders the new booking confirmation page
exports.getNewBookingPage = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const service = await Service.findByPk(serviceId, {
      include: { model: ProviderProfile, attributes: ["businessName"] },
    });

    if (!service) {
      return res.redirect("/providers");
    }

    res.render("pages/booking/new", {
      pageTitle: "Confirm Your Booking",
      service: service,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/providers");
  }
};

// This function handles the booking form submission
exports.postNewBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate } = req.body;
    const customerId = req.user.id; // Get the logged-in user's ID

    await bookingService.createBooking({
      serviceId,
      bookingDate,
      customerId,
    });

    // Redirect to the dashboard after a successful booking
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Booking creation failed:", error);
    // Redirect back to the providers list on failure
    res.redirect("/providers");
  }
};
