const mongoose = require('mongoose');

const { Schema } = mongoose;

const PROVIDER_VERIFICATION_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'SUSPENDED',
];

const serviceAreaSchema = new Schema(
  {
    label: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    postalCode: { type: String, trim: true, maxlength: 20 },
  },
  { _id: false }
);

const providerDocumentSchema = new Schema(
  {
    type: { type: String, trim: true, maxlength: 80 },
    name: { type: String, trim: true, maxlength: 160 },
    reference: { type: String, trim: true, maxlength: 500 },
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: null },
  },
  { _id: false }
);

const providerProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    experienceYears: {
      type: Number,
      min: 0,
      max: 80,
      default: 0,
    },
    serviceAreas: {
      type: [serviceAreaSchema],
      default: [],
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    verificationStatus: {
      type: String,
      enum: PROVIDER_VERIFICATION_STATUSES,
      default: 'PENDING',
      index: true,
    },
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    pricing: {
      currency: { type: String, default: 'INR', trim: true, uppercase: true, minlength: 3, maxlength: 3 },
      baseHourlyRate: { type: Number, min: 0, default: 0 },
      minimumVisitCharge: { type: Number, min: 0, default: 0 },
    },
    ratingSummary: {
      averageRating: { type: Number, min: 0, max: 5, default: 0 },
      reviewCount: { type: Number, min: 0, default: 0 },
    },
    documents: {
      type: [providerDocumentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

providerProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
module.exports.PROVIDER_VERIFICATION_STATUSES = PROVIDER_VERIFICATION_STATUSES;
