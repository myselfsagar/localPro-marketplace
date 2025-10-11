const ProviderProfile = require("../models/providerProfile.model");
const Service = require("../models/service.model");

async function upsertProfile(profileData, userId) {
  // Find the profile for the current user
  const existingProfile = await ProviderProfile.findOne({ where: { userId } });

  if (existingProfile) {
    // If it exists, update it
    await existingProfile.update(profileData);
    return existingProfile;
  } else {
    // If it doesn't exist, create it
    const newProfile = await ProviderProfile.create({
      ...profileData,
      userId: userId,
    });
    return newProfile;
  }
}

async function createService(serviceData, userId) {
  // First, find the provider's profile to get its ID
  const profile = await ProviderProfile.findOne({ where: { userId } });
  if (!profile) {
    throw new Error("Provider profile not found.");
  }

  // Create the new service and associate it with the profile
  const newService = await Service.create({
    ...serviceData,
    providerProfileId: profile.id,
  });

  return newService;
}

module.exports = {
  upsertProfile,
  createService,
};
