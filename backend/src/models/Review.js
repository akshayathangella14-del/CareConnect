const mongoose = require('mongoose');

const { Schema } = mongoose;

const REVIEW_STATUSES = ['PENDING', 'PUBLISHED', 'HIDDEN', 'FLAGGED'];

const reviewSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);
module.exports.REVIEW_STATUSES = REVIEW_STATUSES;
