const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const ProviderProfile = require("../models/providerProfile.model");
const User = require("../models/user.model");

exports.getDashboardPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page number from URL, default to 1
    const limit = 5; // Number of bookings per page
    const offset = (page - 1) * limit; // Calculate offset

    let bookingsResult = { count: 0, rows: [] };

    if (req.user.role === "customer") {
      // Fetch paginated bookings for a customer
      bookingsResult = await Booking.findAndCountAll({
        where: { customerId: req.user.id },
        limit: limit,
        offset: offset,
        include: [
          {
            model: Service,
            attributes: ["name", "price"],
            include: {
              model: ProviderProfile,
              attributes: ["businessName"],
            },
          },
          { model: Review, required: false },
        ],
        order: [["bookingDate", "DESC"]],
      });
    } else if (req.user.role === "provider") {
      // Fetch paginated bookings for a provider
      const profile = await ProviderProfile.findOne({
        where: { userId: req.user.id },
      });
      if (profile) {
        bookingsResult = await Booking.findAndCountAll({
          limit: limit,
          offset: offset,
          include: [
            {
              model: Service,
              where: { providerProfileId: profile.id },
              attributes: ["name", "price"],
            },
            {
              model: User,
              as: "Customer",
              attributes: ["firstName", "lastName"],
            },
          ],
          order: [["bookingDate", "DESC"]],
        });
      }
    }

    const totalPages = Math.ceil(bookingsResult.count / limit);

    res.render("pages/dashboard", {
      pageTitle: "My Dashboard",
      user: req.user,
      bookings: bookingsResult.rows, // Pass 'rows' as 'bookings'
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    res.redirect("/");
  }
};
