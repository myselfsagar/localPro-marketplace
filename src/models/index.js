const User = require("./user.model");
const ProviderProfile = require("./providerProfile.model");
const Service = require("./service.model");
const Booking = require("./booking.model");
const Review = require("./review.model");

// --- Define Associations --- //

// User <-> ProviderProfile (One-to-One)
ProviderProfile.belongsTo(User, { foreignKey: "userId" });
User.hasOne(ProviderProfile, { foreignKey: "userId" });

// ProviderProfile <-> Service (One-to-Many)
Service.belongsTo(ProviderProfile, { foreignKey: "providerProfileId" });
ProviderProfile.hasMany(Service, { foreignKey: "providerProfileId" });

// A Booking is made by one User (the customer)
Booking.belongsTo(User, { as: "Customer", foreignKey: "customerId" });
User.hasMany(Booking, { as: "CustomerBookings", foreignKey: "customerId" });

// A Booking is for one specific Service
Booking.belongsTo(Service, { foreignKey: "serviceId", onDelete: "SET NULL" });
Service.hasMany(Booking, { foreignKey: "serviceId" });

// A Review belongs to one Booking
Review.belongsTo(Booking, { foreignKey: "bookingId" });
// A Booking has one Review
Booking.hasOne(Review, { foreignKey: "bookingId" });
