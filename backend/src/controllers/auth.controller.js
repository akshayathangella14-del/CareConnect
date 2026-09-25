const cloudinary = require('../config/cloudinary');
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sanitizeUser = require('../utils/sanitizeUser');
const User = require('../models/User');
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

const updateMe = asyncHandler(async (req, res) => {
  const updates = {};

  ['name', 'phone', 'profileImage'].forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw AppError.badRequest('No profile fields were provided to update.');
  }

  if (updates.name !== undefined && String(updates.name).trim().length < 2) {
    throw AppError.badRequest('Name must be at least 2 characters long.');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  Object.assign(user, updates);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      user: sanitizeUser(user),
    },
  });
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  const nextImage = typeof req.body?.profileImage === 'string' ? req.body.profileImage.trim() : '';
  const uploadedFile = req.file;

  let resolvedImageUrl = nextImage;

  if (uploadedFile) {
    const hasCloudinaryCredentials = Boolean(
      cloudinary?.config &&
      cloudinary.config().cloud_name &&
      cloudinary.config().api_key &&
      cloudinary.config().api_secret
    );

    if (hasCloudinaryCredentials) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'careconnect/users', resource_type: 'image' },
          (error, uploaded) => {
            if (error) reject(error);
            else resolve(uploaded);
          }
        );

        stream.end(uploadedFile.buffer);
      });

      resolvedImageUrl = result.secure_url;
    } else {
      resolvedImageUrl = `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString('base64')}`;
    }
  }

  if (!resolvedImageUrl) {
    throw AppError.badRequest('A profile image file or URL is required.');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  user.profileImage = resolvedImageUrl;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile image updated successfully.',
    data: {
      user: sanitizeUser(user),
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
  updateMe,
  uploadProfileImage,
  logout,
};
