const AvailabilitySlot = require('../models/AvailabilitySlot');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');

const activeBookingStatuses = [
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'PROVIDER_EN_ROUTE',
  'ARRIVED',
  'IN_PROGRESS',
  'AWAITING_CUSTOMER_CONFIRMATION',
];

const assertValidWindow = (startAt, endAt) => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    throw AppError.badRequest('A valid startAt before endAt is required.');
  }

  return { start, end };
};

const assertNoAvailabilityOverlap = async ({ provider, startAt, endAt, excludeId }) => {
  const { start, end } = assertValidWindow(startAt, endAt);
  const query = {
    provider,
    status: { $in: ['AVAILABLE', 'RESERVED'] },
    startAt: { $lt: end },
    endAt: { $gt: start },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const overlapping = await AvailabilitySlot.exists(query);

  if (overlapping) {
    throw AppError.conflict('Availability slot overlaps an existing slot.');
  }

  return { start, end };
};

const hasAvailability = async ({ provider, startAt, endAt }) => {
  const { start, end } = assertValidWindow(startAt, endAt);

  return AvailabilitySlot.exists({
    provider,
    status: 'AVAILABLE',
    startAt: { $lte: start },
    endAt: { $gte: end },
  });
};

const assertNoBookingConflict = async ({ provider, startAt, endAt, excludeId }) => {
  const { start, end } = assertValidWindow(startAt, endAt);
  const query = {
    provider,
    status: { $in: activeBookingStatuses },
    scheduledStartAt: { $lt: end },
    scheduledEndAt: { $gt: start },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflict = await Booking.exists(query);

  if (conflict) {
    throw AppError.conflict('Provider already has an overlapping active booking.');
  }

  return { start, end };
};

module.exports = {
  activeBookingStatuses,
  assertValidWindow,
  assertNoAvailabilityOverlap,
  hasAvailability,
  assertNoBookingConflict,
};
