const User = require("./user.model");
const ProviderProfile = require("./providerProfile.model");
const Service = require("./service.model");
const Booking = require("./booking.model");

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
Booking.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(Booking, { foreignKey: "serviceId" });
