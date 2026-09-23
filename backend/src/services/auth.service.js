const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const AppError = require('../utils/AppError');
const sanitizeUser = require('../utils/sanitizeUser');

const PASSWORD_SALT_ROUNDS = 12;
const PUBLIC_REGISTRATION_ROLES = ['CUSTOMER', 'SERVICE_PROVIDER'];
const ACTIVE_USER_STATUS = 'ACTIVE';
const TOKEN_ISSUER = 'careconnect-api';

const ensureJwtConfigured = () => {
  if (!env.jwt.secret) {
    throw new Error('JWT_SECRET is not configured.');
  }
};

const hashPassword = (password) => bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

const comparePassword = (password, passwordHash) => bcrypt.compare(password, passwordHash);

const createToken = (user) => {
  ensureJwtConfigured();

  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
      issuer: TOKEN_ISSUER,
    }
  );
};

const verifyToken = (token) => {
  ensureJwtConfigured();

  try {
    const payload = jwt.verify(token, env.jwt.secret, { issuer: TOKEN_ISSUER });

    if (!payload.sub) {
      throw AppError.unauthorized('Invalid authentication token.');
    }

    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Authentication token has expired.');
    }

    if (error.isOperational) {
      throw error;
    }

    throw AppError.unauthorized('Invalid authentication token.');
  }
};

const assertActiveUser = (user) => {
  if (!user || user.status !== ACTIVE_USER_STATUS) {
    throw AppError.forbidden('Account is not active.');
  }
};

const register = async ({ name, email, password, phone, role }) => {
  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
    throw AppError.badRequest('Public registration supports only CUSTOMER and SERVICE_PROVIDER roles.');
  }

  const existingUser = await User.findOne({ email }).select('_id').lean();

  if (existingUser) {
    throw AppError.conflict('An account with this email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    phone,
    role,
    status: ACTIVE_USER_STATUS,
  });

  let providerProfile = null;

  try {
    if (role === 'SERVICE_PROVIDER') {
      providerProfile = await ProviderProfile.create({
        user: user._id,
        displayName: name,
        verificationStatus: 'PENDING',
      });
    }
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  const token = createToken(user);

  return {
    token,
    user: sanitizeUser(user),
    providerProfile: providerProfile
      ? {
          id: providerProfile._id.toString(),
          verificationStatus: providerProfile.verificationStatus,
        }
      : null,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  assertActiveUser(user);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    token: createToken(user),
    user: sanitizeUser(user),
  };
};

const getAuthenticatedUserByToken = async (token) => {
  const payload = verifyToken(token);
  const user = await User.findById(payload.sub);

  if (!user) {
    throw AppError.unauthorized('Invalid authentication token.');
  }

  assertActiveUser(user);

  return user;
};

module.exports = {
  register,
  login,
  createToken,
  verifyToken,
  getAuthenticatedUserByToken,
  hashPassword,
  comparePassword,
};
