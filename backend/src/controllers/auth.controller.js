const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const sanitizeUser = require('../utils/sanitizeUser');
const {
  validateRegistrationInput,
  validateLoginInput,
} = require('../validators/auth.validator');

const register = asyncHandler(async (req, res) => {
  const input = validateRegistrationInput(req.body);
  const data = await authService.register(input);

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data,
  });
});

const login = asyncHandler(async (req, res) => {
  const input = validateLoginInput(req.body);
  const data = await authService.login(input);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data,
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated user fetched successfully.',
    data: {
      user: sanitizeUser(req.user),
    },
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Remove the bearer token from the client.',
    data: null,
  });
});

module.exports = {
  register,
  login,
  me,
  logout,
};
