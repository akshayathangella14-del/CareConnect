const mongoose = require('mongoose');

const { Schema } = mongoose;

const BOOKING_STATUSES = [
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'PROVIDER_EN_ROUTE',
  'ARRIVED',
  'IN_PROGRESS',
  'AWAITING_CUSTOMER_CONFIRMATION',
  'COMPLETED',
  'CANCELLED',
];

const bookingSnapshotUserSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const bookingSnapshotProviderSchema = new Schema(
  {
    providerProfileId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    displayName: { type: String, required: true, trim: true, maxlength: 140 },
    phone: { type: String, trim: true, maxlength: 30 },
  },
  { _id: false }
);

const bookingScopeSnapshotSchema = new Schema(
  {
    summary: { type: String, required: true, trim: true, maxlength: 2000 },
    tasks: [{ type: String, trim: true, maxlength: 500 }],
    exclusions: [{ type: String, trim: true, maxlength: 300 }],
  },
  { _id: false }
);

const bookingPricingSnapshotSchema = new Schema(
  {
    currency: { type: String, default: 'INR', trim: true, uppercase: true, minlength: 3, maxlength: 3 },
    subtotal: { type: Number, min: 0, default: 0 },
    tax: { type: Number, min: 0, default: 0 },
    discount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const bookingEventSchema = new Schema(
  {
    type: { type: String, required: true, trim: true, maxlength: 100 },
    actor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    description: { type: String, trim: true, maxlength: 500 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const evidenceSchema = new Schema(
  {
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['BEFORE_SERVICE', 'SCOPE_CHANGE', 'AFTER_SERVICE', 'COMPLETION', 'OTHER_APPROVED_EVIDENCE'],
      required: true,
    },
    description: { type: String, trim: true, maxlength: 1000 },
    file: {
      url: { type: String, trim: true, maxlength: 1000 },
      publicId: { type: String, trim: true, maxlength: 300 },
      name: { type: String, trim: true, maxlength: 200 },
      mimeType: { type: String, trim: true, maxlength: 120 },
    },
    relatedScopeChangeId: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const scopeChangeSchema = new Schema(
  {
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    workItems: [{ type: String, trim: true, maxlength: 500 }],
    laborAmount: { type: Number, min: 0, default: 0 },
    materialAmount: { type: Number, min: 0, default: 0 },
    costDifference: { type: Number, min: 0, default: 0 },
    evidenceIds: [{ type: Schema.Types.ObjectId }],
    status: {
      type: String,
      enum: ['PENDING_CUSTOMER_APPROVAL', 'APPROVED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING_CUSTOMER_APPROVAL',
    },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    decidedAt: { type: Date, default: null },
    decisionNotes: { type: String, trim: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const bookingSchema = new Schema(
  {
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      unique: true,
    },
    acceptedQuote: {
      type: Schema.Types.ObjectId,
      ref: 'Quote',
      required: true,
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: true,
      index: true,
    },
    scheduledStartAt: {
      type: Date,
      required: true,
    },
    scheduledEndAt: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.scheduledStartAt || value > this.scheduledStartAt;
        },
        message: 'scheduledEndAt must be after scheduledStartAt.',
      },
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'PENDING_CONFIRMATION',
      index: true,
    },
    customerSnapshot: {
      type: bookingSnapshotUserSchema,
      required: true,
    },
    providerSnapshot: {
      type: bookingSnapshotProviderSchema,
      required: true,
    },
    scopeSnapshot: {
      type: bookingScopeSnapshotSchema,
      required: true,
    },
    pricingSnapshot: {
      type: bookingPricingSnapshotSchema,
      required: true,
    },
    statusEvents: {
      type: [bookingEventSchema],
      default: [],
    },
    evidence: {
      type: [evidenceSchema],
      default: [],
    },
    scopeChanges: {
      type: [scopeChangeSchema],
      default: [],
    },
    customerConfirmedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ scheduledStartAt: 1, scheduledEndAt: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.BOOKING_STATUSES = BOOKING_STATUSES;
