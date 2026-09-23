const mongoose = require('mongoose');

const { Schema } = mongoose;

const NOTIFICATION_TYPES = [
  'SYSTEM',
  'SERVICE_REQUEST',
  'QUOTE',
  'BOOKING',
  'SCOPE_CHANGE',
  'INVOICE',
  'DISPUTE',
  'REVIEW',
];

const RELATED_RESOURCE_TYPES = [
  'ServiceRequest',
  'Quote',
  'Booking',
  'ScopeChange',
  'Invoice',
  'Dispute',
  'Review',
  'User',
  'ProviderProfile',
];

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    relatedResource: {
      resourceType: { type: String, enum: RELATED_RESOURCE_TYPES },
      resourceId: { type: Schema.Types.ObjectId },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
module.exports.RELATED_RESOURCE_TYPES = RELATED_RESOURCE_TYPES;
