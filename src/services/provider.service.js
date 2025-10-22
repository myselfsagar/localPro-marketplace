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

async function updateService(serviceId, providerUserId, serviceData) {
  // 1. Find the service and its provider profile
  const service = await Service.findByPk(serviceId, {
    include: { model: ProviderProfile },
  });

  if (!service) {
    throw new Error("Service not found.");
  }

  // 2. Security Check: Ensure the logged-in user owns this service
  if (service.ProviderProfile.userId !== providerUserId) {
    throw new Error("Unauthorized: You do not own this service.");
  }

  // 3. Update the service with new data
  // serviceData already includes the new imageUrl if one was uploaded
  await service.update(serviceData);
  return service;
}

async function deleteService(serviceId, providerUserId) {
  // 1. Find the service and its provider profile
  const service = await Service.findByPk(serviceId, {
    include: { model: ProviderProfile },
  });

  if (!service) {
    throw new Error("Service not found.");
  }

  // 2. Security Check: Ensure the logged-in user owns this service
  if (service.ProviderProfile.userId !== providerUserId) {
    throw new Error("Unauthorized: You do not own this service.");
  }

  // 3. Delete the service
  await service.destroy();
}

module.exports = {
  upsertProfile,
  createService,
  updateService,
  deleteService,
};
