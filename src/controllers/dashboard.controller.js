const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const ProviderProfile = require("../models/providerProfile.model");
const User = require("../models/user.model");

exports.getDashboardPage = async (req, res) => {
  try {
    let bookings = [];
    if (req.user.role === "customer") {
      // --- Fetch bookings for a customer ---
      bookings = await Booking.findAll({
        where: { customerId: req.user.id },
        include: {
          model: Service,
          attributes: ["name", "price"],
          include: {
            model: ProviderProfile,
            attributes: ["businessName"],
          },
        },
        order: [["bookingDate", "DESC"]],
      });
    } else if (req.user.role === "provider") {
      // --- Fetch bookings for a provider ---
      // We find the provider's profile first.
      const profile = await ProviderProfile.findOne({
        where: { userId: req.user.id },
      });
      if (profile) {
        bookings = await Booking.findAll({
          // Find bookings where the serviceId belongs to one of the provider's services
          include: [
            {
              model: Service,
              where: { providerProfileId: profile.id },
              attributes: ["name", "price"],
            },
            {
              model: User,
              as: "Customer", // Use the alias we defined
              attributes: ["firstName", "lastName"],
            },
          ],
          order: [["bookingDate", "DESC"]],
        });
      }
    }

    res.render("pages/dashboard", {
      pageTitle: "My Dashboard",
      user: req.user,
      bookings: bookings, // Pass the fetched bookings to the view
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    res.redirect("/");
  }
};
