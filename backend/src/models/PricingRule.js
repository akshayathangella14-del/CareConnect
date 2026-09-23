const mongoose = require('mongoose');

const { Schema } = mongoose;

const additionalChargeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pricingRuleSchema = new Schema(
  {
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
    serviceArea: {
      type: String,
      trim: true,
      maxlength: 160,
      index: true,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    basePrice: { type: Number, required: true, min: 0 },
    laborCharge: { type: Number, min: 0, default: 0 },
    materialCharge: { type: Number, min: 0, default: 0 },
    minimumCharge: { type: Number, min: 0, default: 0 },
    additionalCharges: {
      type: [additionalChargeSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
      default: null,
      validate: {
        validator(value) {
          return !value || !this.effectiveFrom || value > this.effectiveFrom;
        },
        message: 'effectiveTo must be after effectiveFrom.',
      },
    },
  },
  { timestamps: true }
);

pricingRuleSchema.index({ category: 1, service: 1, serviceArea: 1, isActive: 1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
