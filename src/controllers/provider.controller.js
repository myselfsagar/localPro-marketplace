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
    req.flash("success_msg", "Your profile has been updated successfully!");
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

// Renders the page with the "edit service" form
exports.getEditServicePage = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findByPk(serviceId);

    // Security check (quick check, full check is in the service)
    const profile = await ProviderProfile.findOne({
      where: { userId: req.user.id },
    });
    if (!service || service.providerProfileId !== profile.id) {
      req.flash(
        "error_msg",
        "Service not found or you do not have permission to edit it."
      );
      return res.redirect("/provider/profile");
    }

    res.render("pages/provider/edit-service", {
      pageTitle: `Edit ${service.name}`,
      service: service,
    });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading the page.");
    res.redirect("/provider/profile");
  }
};

// Handles the update of the service
exports.postEditService = async (req, res) => {
  const serviceId = req.params.id;
  try {
    const serviceData = req.body;

    // If a new file was uploaded, add its path to the update data
    if (req.file) {
      serviceData.imageUrl = req.file.path;
    }

    await providerService.updateService(serviceId, req.user.id, serviceData);

    req.flash("success_msg", "Service updated successfully!");
    res.redirect("/provider/profile");
  } catch (error) {
    console.error("Service update failed:", error);
    req.flash("error_msg", `Error updating service: ${error.message}`);
    res.redirect(`/provider/services/${serviceId}/edit`);
  }
};

// Handles deleting a service
exports.postDeleteService = async (req, res) => {
  const serviceId = req.params.id;
  try {
    await providerService.deleteService(serviceId, req.user.id);

    req.flash("success_msg", "Service has been deleted.");
    res.redirect("/provider/profile");
  } catch (error) {
    console.error("Service deletion failed:", error);
    req.flash("error_msg", `Error deleting service: ${error.message}`);
    res.redirect("/provider/profile");
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
