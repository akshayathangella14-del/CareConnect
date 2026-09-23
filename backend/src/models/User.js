const mongoose = require('mongoose');

const { Schema } = mongoose;

const USER_ROLES = [
  'ADMIN',
  'OPERATIONS_MANAGER',
  'SERVICE_PROVIDER',
  'CUSTOMER',
  'SUPPORT_AGENT',
];

const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email must be valid.'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'ACTIVE',
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
module.exports.USER_ROLES = USER_ROLES;
module.exports.USER_STATUSES = USER_STATUSES;
