const ProviderProfile = require("../models/providerProfile.model");
const providerService = require("../services/provider.service");

// This function will render the provider's profile management page
exports.getProfilePage = async (req, res) => {
  try {
    // Find the provider's profile using the logged-in user's ID
    const profile = await ProviderProfile.findOne({
      where: { userId: req.user.id },
    });

    res.render("pages/provider/profile", {
      pageTitle: "Manage Your Profile",
      profile: profile, // This will be null if they haven't created one yet
    });
  } catch (error) {
    console.error(error);
    // Redirect to dashboard or show an error page
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
    // Handle errors, maybe render the page again with an error message
    res.redirect("/provider/profile");
  }
};
