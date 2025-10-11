const ProviderProfile = require("../models/providerProfile.model");

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

module.exports = {
  upsertProfile,
};
