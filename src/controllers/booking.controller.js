const bookingService = require("../services/booking.service");
const Service = require("../models/service.model");
const ProviderProfile = require("../models/providerProfile.model");
const User = require("../models/user.model");

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
  const emitNotification = req.app.get("emitNotification"); // Get emit function
  try {
    const { serviceId, bookingDate } = req.body;
    const customerId = req.user.id;

    // Create the booking
    const newBooking = await bookingService.createBooking(
      {
        serviceId,
        bookingDate,
        customerId,
      },
      req.user
    );

    // --- EMIT DETAILED NOTIFICATION ---
    // Fetch service details again for notification data
    const service = await Service.findByPk(serviceId, {
      include: { model: ProviderProfile, attributes: ["userId"] },
      attributes: ["name", "price"],
    });

    if (service && service.ProviderProfile) {
      const providerUserId = service.ProviderProfile.userId;

      // Emit all data needed for the frontend card
      emitNotification(providerUserId, "new_booking", {
        bookingId: newBooking.id,
        serviceName: service.name,
        customerName: `${req.user.firstName} ${req.user.lastName || ""}`,
        bookingDate: newBooking.bookingDate,
        price: service.price,
        status: "pending",
      });
    }
    // --------------------------

    req.flash("success_msg", "Your booking request has been sent!");
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Booking creation failed:", error);
    req.flash("error_msg", "Booking failed. Please try again.");
    res.redirect(`/providers`);
  }
};
