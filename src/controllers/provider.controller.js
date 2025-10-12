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
    const profileData = req.body;

    // If a file was uploaded, add its Cloudinary URL to the profileData
    if (req.file) {
      profileData.profileImageUrl = req.file.path; // req.file.path is the Cloudinary URL
    }

    await providerService.upsertProfile(profileData, req.user.id);
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
    const serviceData = req.body;

    // If a file was uploaded, add its Cloudinary URL to the serviceData
    if (req.file) {
      serviceData.imageUrl = req.file.path; // req.file.path is the Cloudinary URL
    }

    await providerService.createService(serviceData, req.user.id);
    res.redirect("/provider/profile");
  } catch (error) {
    console.error("Service creation failed:", error);
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
