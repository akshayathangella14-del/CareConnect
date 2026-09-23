const AppError = require('./AppError');

const toId = (value) => {
  if (!value) {
    return '';
  }

  if (value._id) {
    return value._id.toString();
  }

  return value.toString();
};

const isSameId = (left, right) => toId(left) === toId(right);

const assertOwnership = (ownerId, authenticatedUserId, message = 'You do not own this resource.') => {
  if (!isSameId(ownerId, authenticatedUserId)) {
    throw AppError.forbidden(message);
  }
};

const canAccessProviderProfile = (providerProfile, authenticatedUser) => {
  if (!providerProfile || !authenticatedUser) {
    return false;
  }

  if (['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'].includes(authenticatedUser.role)) {
    return true;
  }

  return authenticatedUser.role === 'SERVICE_PROVIDER' && isSameId(providerProfile.user, authenticatedUser._id);
};

const assertProviderProfileAccess = (providerProfile, authenticatedUser) => {
  if (!canAccessProviderProfile(providerProfile, authenticatedUser)) {
    throw AppError.forbidden('You are not allowed to access this provider profile.');
  }
};

module.exports = {
  toId,
  isSameId,
  assertOwnership,
  canAccessProviderProfile,
  assertProviderProfileAccess,
};
