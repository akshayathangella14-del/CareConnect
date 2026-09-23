const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');
const sanitizeUser = require('../utils/sanitizeUser');

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    throw AppError.unauthorized('Authentication token is required.');
  }

  const [scheme, token, extra] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token || extra) {
    throw AppError.unauthorized('Authorization header must use Bearer token format.');
  }

  return token;
};

const authenticate = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.get('authorization'));
    const user = await authService.getAuthenticatedUserByToken(token);

    req.user = user;
    req.auth = {
      user: sanitizeUser(user),
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  extractBearerToken,
};
