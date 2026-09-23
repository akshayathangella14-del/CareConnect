const mongoose = require('mongoose');

const { Schema } = mongoose;

const AVAILABILITY_SLOT_STATUSES = ['AVAILABLE', 'BLOCKED', 'RESERVED', 'CANCELLED'];

const availabilitySlotSchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderProfile',
      required: true,
      index: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.startAt || value > this.startAt;
        },
        message: 'endAt must be after startAt.',
      },
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
      default: 'Asia/Kolkata',
    },
    status: {
      type: String,
      enum: AVAILABILITY_SLOT_STATUSES,
      default: 'AVAILABLE',
      index: true,
    },
  },
  { timestamps: true }
);

availabilitySlotSchema.index({ provider: 1, startAt: 1, endAt: 1 });
availabilitySlotSchema.index({ provider: 1, status: 1, startAt: 1 });

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);
module.exports.AVAILABILITY_SLOT_STATUSES = AVAILABILITY_SLOT_STATUSES;
