const User = require("../models/user.model");
const ProviderProfile = require("../models/providerProfile.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");

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
    const providerId = req.params.id;
    const provider = await ProviderProfile.findByPk(providerId, {
      include: [
        { model: User, attributes: ["firstName", "lastName"] },
        {
          model: Service,
          include: {
            model: Booking,
            // Only include bookings that have a review
            required: false, // Use left join to still get services with no bookings
            where: { status: "completed" }, // Only consider completed bookings for reviews
            include: [
              { model: Review, required: true }, // INNER JOIN to only get bookings WITH reviews
              { model: User, as: "Customer", attributes: ["firstName"] }, // Get customer's name
            ],
          },
        },
      ],
    });

    if (!provider) {
      return res.redirect("/providers");
    }

    // --- Process the data to create a simple reviews array ---
    const reviews = [];
    let totalRating = 0;
    provider.Services.forEach((service) => {
      service.Bookings.forEach((booking) => {
        reviews.push({
          rating: booking.Review.rating,
          comment: booking.Review.comment,
          customerName: booking.Customer.firstName,
          createdAt: booking.Review.createdAt,
        });
        totalRating += booking.Review.rating;
      });
    });

    const averageRating =
      reviews.length > 0
        ? (totalRating / reviews.length).toFixed(1)
        : "No ratings yet";

    res.render("pages/public/provider-detail", {
      pageTitle: provider.businessName,
      provider: provider,
      reviews: reviews, // Pass the clean array to the view
      averageRating: averageRating,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/providers");
  }
};
