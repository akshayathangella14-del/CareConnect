const AppError = require('./AppError');

const elevatedRoles = ['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'];
const adminRoles = ['ADMIN'];
const operationalRoles = ['ADMIN', 'OPERATIONS_MANAGER'];
const supportRoles = ['ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'];

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

const hasRole = (user, roles) => Boolean(user && roles.includes(user.role));

const requireRole = (user, roles) => {
  if (!hasRole(user, roles)) {
    throw AppError.forbidden('You are not allowed to perform this action.');
  }
};

const requireSelfOrRole = (user, ownerId, roles = elevatedRoles) => {
  if (!isSameId(user?._id, ownerId) && !hasRole(user, roles)) {
    throw AppError.forbidden('You are not allowed to access this resource.');
  }
};

module.exports = {
  elevatedRoles,
  adminRoles,
  operationalRoles,
  supportRoles,
  toId,
  isSameId,
  hasRole,
  requireRole,
  requireSelfOrRole,
};
