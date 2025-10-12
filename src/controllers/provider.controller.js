const ProviderProfile = require("../models/providerProfile.model");
const providerService = require("../services/provider.service");
const Service = require("../models/service.model");
const bookingService = require("../services/booking.service");

// This function will render the provider's profile management page
exports.getProfilePage = async (req, res) => {
  try {
    // Find the provider's profile using the logged-in user's ID
    const profile = await ProviderProfile.findOne({
      where: { userId: req.user.id },
      include: Service,
    });

    res.render("pages/provider/profile", {
      pageTitle: "Manage Your Profile",
      profile: profile,
      services: profile ? profile.Services : [],
    });
  } catch (error) {
    console.error(error);
    res.redirect("/dashboard");
  }
};

// This function handles the form submission
exports.postProfilePage = async (req, res) => {
  try {
    await providerService.upsertProfile(req.body, req.user.id);

    // Redirect back to the profile page with a success message (optional)
    res.redirect("/provider/profile");
  } catch (error) {
    console.error(error);
    res.redirect("/provider/profile");
  }
};

// Renders the page with the "add new service" form
exports.getAddServicePage = (req, res) => {
  res.render("pages/provider/add-service", {
    pageTitle: "Add a New Service",
  });
};

// Handles the creation of the new service
exports.postAddService = async (req, res) => {
  try {
    // Delegate the logic to the service layer
    await providerService.createService(req.body, req.user.id);
    res.redirect("/provider/profile");
  } catch (error) {
    console.error(error);
    // Optional: Redirect back to the form with an error message
    res.redirect("/provider/services/new");
  }
};

// This function handles updating the status of a booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // 'confirmed' or 'cancelled' from the form
    const providerUserId = req.user.id;

    await bookingService.updateBookingStatus(bookingId, providerUserId, status);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Failed to update booking status:", error);
    res.redirect("/dashboard");
  }
};
