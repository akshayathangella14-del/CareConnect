const mongoose = require('mongoose');

const { Schema } = mongoose;

const DISPUTE_STATUSES = [
  'OPEN',
  'UNDER_REVIEW',
  'AWAITING_EVIDENCE',
  'RESOLUTION_PROPOSED',
  'RESOLVED',
  'REJECTED',
  'ESCALATED',
];

const DISPUTE_REASONS = [
  'SERVICE_QUALITY',
  'BILLING',
  'SCOPE_CHANGE',
  'DAMAGE',
  'NO_SHOW',
  'OTHER',
];

const disputeSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      index: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
      index: true,
    },
    openedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: DISPUTE_REASONS,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: DISPUTE_STATUSES,
      default: 'OPEN',
      index: true,
    },
    resolution: {
      summary: { type: String, trim: true, maxlength: 2000 },
      outcome: { type: String, trim: true, maxlength: 500 },
    },
    assistantSummary: {
      source: { type: String, enum: ['STRUCTURED_FALLBACK'], default: 'STRUCTURED_FALLBACK' },
      summary: { type: String, trim: true, maxlength: 2000 },
      generatedAt: { type: Date, default: null },
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

disputeSchema.index({ booking: 1, status: 1 });
disputeSchema.index({ openedBy: 1, status: 1 });

module.exports = mongoose.model('Dispute', disputeSchema);
module.exports.DISPUTE_STATUSES = DISPUTE_STATUSES;
module.exports.DISPUTE_REASONS = DISPUTE_REASONS;
