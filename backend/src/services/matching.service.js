const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const { hasAvailability, assertNoBookingConflict } = require('./availability.service');

const normalize = (value) => String(value || '').trim().toLowerCase();

const serviceAreaMatches = (provider, serviceArea) => {
  const target = normalize(serviceArea);

  if (!target) {
    return false;
  }

  return provider.serviceAreas.some((area) => {
    const values = [area.label, area.city, area.state, area.postalCode].map(normalize);
    return values.some((value) => value && (value === target || value.includes(target) || target.includes(value)));
  });
};

const getProviderMatches = async (serviceRequest) => {
  const requiredSkills = (serviceRequest.confirmedUnderstanding?.requiredSkills?.length
    ? serviceRequest.confirmedUnderstanding.requiredSkills
    : serviceRequest.aiUnderstanding?.requiredSkills) || [];

  const providers = await ProviderProfile.find({
    verificationStatus: 'VERIFIED',
    ...(requiredSkills.length ? { skills: { $all: requiredSkills } } : {}),
  })
    .populate('user', 'name email phone status')
    .populate('skills', 'name slug')
    .lean();

  const startAt = serviceRequest.preferredSchedule?.startAt;
  const endAt = serviceRequest.preferredSchedule?.endAt;
  const matches = [];

  for (const provider of providers) {
    if (provider.user?.status !== 'ACTIVE') {
      continue;
    }

    const areaMatch = serviceAreaMatches(provider, serviceRequest.location?.serviceArea);
    if (!areaMatch) {
      continue;
    }

    const availabilityMatch = startAt && endAt
      ? Boolean(await hasAvailability({ provider: provider._id, startAt, endAt }))
      : false;

    if (!availabilityMatch) {
      continue;
    }

    try {
      await assertNoBookingConflict({ provider: provider._id, startAt, endAt });
    } catch (error) {
      continue;
    }

    const providerSkillIds = provider.skills.map((skill) => skill._id.toString());
    const matchedSkills = requiredSkills
      .map((skill) => skill.toString())
      .filter((skillId) => providerSkillIds.includes(skillId));

    const completedJobs = await Booking.countDocuments({
      provider: provider._id,
      status: 'COMPLETED',
    });

    const score =
      matchedSkills.length * 25
      + Math.min(provider.experienceYears || 0, 20) * 2
      + (provider.ratingSummary?.averageRating || 0) * 10
      + Math.min(completedJobs, 20);

    matches.push({
      provider,
      score,
      explanation: {
        matchedSkills: provider.skills.filter((skill) => matchedSkills.includes(skill._id.toString())),
        serviceAreaMatch: areaMatch,
        availabilityMatch,
        experienceYears: provider.experienceYears || 0,
        ratingSummary: provider.ratingSummary || { averageRating: 0, reviewCount: 0 },
        completedJobs,
      },
    });
  }

  return matches.sort((a, b) => b.score - a.score || a.provider.displayName.localeCompare(b.provider.displayName));
};

module.exports = {
  getProviderMatches,
};
