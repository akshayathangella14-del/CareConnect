const mongoose = require('mongoose');

const { Schema } = mongoose;

const QUOTE_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'VIEWED',
  'CHANGES_REQUESTED',
  'REVISED',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
  'WITHDRAWN',
];

const scopeItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 500 },
    included: { type: Boolean, default: true },
  },
  { _id: false }
);

const quoteSchema = new Schema(
  {
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      index: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: true,
      index: true,
    },
    scope: {
      summary: { type: String, required: true, trim: true, maxlength: 2000 },
      tasks: { type: [scopeItemSchema], default: [] },
      exclusions: [{ type: String, trim: true, maxlength: 300 }],
      unclearItems: [{ type: String, trim: true, maxlength: 300 }],
      assumptions: [{ type: String, trim: true, maxlength: 300 }],
    },
    pricingBreakdown: {
      currency: { type: String, default: 'INR', trim: true, uppercase: true, minlength: 3, maxlength: 3 },
      labor: { type: Number, min: 0, default: 0 },
      materials: { type: Number, min: 0, default: 0 },
      fees: { type: Number, min: 0, default: 0 },
      discount: { type: Number, min: 0, default: 0 },
      tax: { type: Number, min: 0, default: 0 },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDuration: {
      value: { type: Number, min: 0 },
      unit: { type: String, enum: ['HOURS', 'DAYS'], default: 'HOURS' },
    },
    validUntil: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: QUOTE_STATUSES,
      default: 'DRAFT',
      index: true,
    },
    providerNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    customerNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

quoteSchema.index({ serviceRequest: 1, status: 1 });
quoteSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model('Quote', quoteSchema);
module.exports.QUOTE_STATUSES = QUOTE_STATUSES;
