const AppError = require('../utils/AppError');

const PUBLIC_REGISTRATION_ROLES = ['CUSTOMER', 'SERVICE_PROVIDER'];

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return 'Password must be between 8 and 128 characters.';
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }

  return null;
};

const validateRegistrationInput = (body) => {
  const errors = {};
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = body.password;
  const phone = body.phone === undefined ? undefined : String(body.phone).trim();
  const role = body.role || 'CUSTOMER';

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Name must be between 2 and 120 characters.';
  }

  if (!isValidEmail(email)) {
    errors.email = 'Email must be valid.';
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (phone !== undefined && phone.length > 30) {
    errors.phone = 'Phone must be 30 characters or fewer.';
  }

  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
    errors.role = 'Public registration supports only CUSTOMER and SERVICE_PROVIDER roles.';
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.badRequest('Invalid registration input.', errors);
  }

  return {
    name,
    email,
    password,
    phone,
    role,
  };
};

const validateLoginInput = (body) => {
  const errors = {};
  const email = normalizeEmail(body.email);
  const password = body.password;

  if (!isValidEmail(email)) {
    errors.email = 'Email must be valid.';
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    throw AppError.badRequest('Invalid login input.', errors);
  }

  return {
    email,
    password,
  };
};

module.exports = {
  validateRegistrationInput,
  validateLoginInput,
  PUBLIC_REGISTRATION_ROLES,
};
