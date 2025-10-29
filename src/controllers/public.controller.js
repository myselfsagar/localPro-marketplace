const { Op } = require("sequelize");
const User = require("../models/user.model");
const ProviderProfile = require("../models/providerProfile.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");

exports.getHomePage = (req, res) => {
  res.render("pages/index", {
    pageTitle: "Welcome to LocalPro",
  });
};

// This function fetches all providers to display on the browse page
exports.getAllProvidersPage = async (req, res) => {
  try {
    // 1. Get search terms from the URL query string
    const { search, location } = req.query;

    // 2. Build the main query conditions for the ProviderProfile
    const profileWhereClause = {};
    if (location) {
      // Find locations that contain the search term (case-insensitive)
      profileWhereClause.location = { [Op.like]: `%${location}%` };
    }

    // 3. Build the search conditions for services or business names
    let includeWhereClause = {};
    if (search) {
      // This will search in EITHER the Service name OR the Provider's business name
      includeWhereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } }, // Search in Service.name
          { "$ProviderProfile.businessName$": { [Op.like]: `%${search}%` } }, // Search in ProviderProfile.businessName
        ],
      };
    }

    // 4. Execute the dynamic query
    const providers = await ProviderProfile.findAll({
      where: profileWhereClause, // Apply location filter here
      include: [
        { model: User, attributes: ["firstName", "lastName"] },
        {
          model: Service,
          where: includeWhereClause, // Apply search term filter here
          required: search ? true : false, // Use INNER JOIN if searching, otherwise LEFT JOIN
        },
      ],
    });

    // 5. Render the page, passing the search terms back to the view
    res.render("pages/public/providers", {
      pageTitle: "Browse Professionals",
      providers: providers,
      searchTerm: search || "", // Pass search term or empty string
      locationTerm: location || "", // Pass location or empty string
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
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
