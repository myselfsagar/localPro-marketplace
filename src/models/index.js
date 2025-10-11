const User = require("./user.model");
const ProviderProfile = require("./providerProfile.model");
const Service = require("./service.model");

// --- Define Associations --- //

// A ProviderProfile belongs to one User
ProviderProfile.belongsTo(User, { foreignKey: "userId" });
// A User has one ProviderProfile
User.hasOne(ProviderProfile, { foreignKey: "userId" });

// A Service belongs to one ProviderProfile
Service.belongsTo(ProviderProfile, { foreignKey: "providerProfileId" });
// A ProviderProfile can have many Services
ProviderProfile.hasMany(Service, { foreignKey: "providerProfileId" });
