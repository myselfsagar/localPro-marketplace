const User = require("../models/user.model");
const ProviderProfile = require("../models/providerProfile.model");
const Service = require("../models/service.model");

// This function fetches all providers to display on the browse page
exports.getAllProvidersPage = async (req, res) => {
  try {
    const providers = await ProviderProfile.findAll({
      include: [
        { model: User, attributes: ["firstName", "lastName"] }, // Get provider's name
        { model: Service, attributes: ["name"] }, // Get names of services offered
      ],
    });

    res.render("pages/public/providers", {
      pageTitle: "Browse Professionals",
      providers: providers,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/"); // Redirect home on error
  }
};

// This function fetches a single provider by their profile ID
exports.getProviderById = async (req, res) => {
  try {
    const providerId = req.params.id; // Get the ID from the URL

    const provider = await ProviderProfile.findByPk(providerId, {
      // Fetch all associated data
      include: [
        { model: User, attributes: ["firstName", "lastName"] },
        { model: Service }, // Get all services for this provider
      ],
    });

    if (!provider) {
      // If no provider is found with that ID, redirect to the browse page
      return res.redirect("/providers");
    }

    res.render("pages/public/provider-detail", {
      pageTitle: provider.businessName,
      provider: provider,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/providers");
  }
};
