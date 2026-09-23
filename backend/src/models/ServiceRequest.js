const mongoose = require('mongoose');

const { Schema } = mongoose;

const SERVICE_REQUEST_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'AI_REVIEW',
  'MANUAL_REVIEW',
  'MATCHING',
  'QUOTING',
  'PROVIDER_SELECTED',
  'SCHEDULED',
  'CLOSED',
  'CANCELLED',
];

const SERVICE_REQUEST_URGENCIES = ['LOW', 'NORMAL', 'HIGH', 'EMERGENCY'];

const locationSchema = new Schema(
  {
    addressLine1: { type: String, trim: true, maxlength: 200 },
    addressLine2: { type: String, trim: true, maxlength: 200 },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    postalCode: { type: String, trim: true, maxlength: 20 },
    serviceArea: { type: String, required: true, trim: true, maxlength: 160 },
  },
  { _id: false }
);

const schedulePreferenceSchema = new Schema(
  {
    startAt: Date,
    endAt: Date,
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, default: 'IMAGE' },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const aiUnderstandingSchema = new Schema(
  {
    source: { type: String, enum: ['FALLBACK_RULES', 'EXTERNAL_AI', 'GEMINI', 'CUSTOMER_CONFIRMED'], default: 'FALLBACK_RULES' },
    category: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', default: null },
    subcategory: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', default: null },
    requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    problemType: { type: String, trim: true, maxlength: 120 },
    urgency: { type: String, enum: SERVICE_REQUEST_URGENCIES },
    diagnosticNotes: { type: String, trim: true, maxlength: 2000 },
    suggestedTasks: [{ type: String, trim: true }],
    missingInformation: [{ type: String, trim: true, maxlength: 200 }],
    confidence: { type: Number, min: 0, max: 1 },
    manualReviewRecommended: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const serviceRequestSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
      index: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      default: null,
      index: true,
    },
    attachments: [attachmentSchema],
    location: {
      type: locationSchema,
      required: true,
    },
    preferredSchedule: {
      type: schedulePreferenceSchema,
      default: undefined,
    },
    urgency: {
      type: String,
      enum: SERVICE_REQUEST_URGENCIES,
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: SERVICE_REQUEST_STATUSES,
      default: 'DRAFT',
      index: true,
    },
    aiUnderstanding: {
      type: aiUnderstandingSchema,
      default: undefined,
    },
    confirmedUnderstanding: {
      type: aiUnderstandingSchema,
      default: undefined,
    },
    customerCorrections: [
      {
        notes: { type: String, trim: true, maxlength: 1000 },
        understanding: { type: aiUnderstandingSchema, default: undefined },
        correctedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

serviceRequestSchema.index({ customer: 1, status: 1, createdAt: -1 });
serviceRequestSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports.SERVICE_REQUEST_STATUSES = SERVICE_REQUEST_STATUSES;
module.exports.SERVICE_REQUEST_URGENCIES = SERVICE_REQUEST_URGENCIES;