const AppError = require('../utils/AppError');

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(AppError.unauthorized('Authentication is required.'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(AppError.forbidden('You are not allowed to perform this action.'));
  }

  return next();
};

module.exports = {
  authorizeRoles,
};
