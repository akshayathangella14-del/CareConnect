const mongoose = require('mongoose');

const { Schema } = mongoose;

const PAYMENT_METHODS = ['CARD', 'UPI', 'NETBANKING', 'WALLET'];
const PAYMENT_STATUS = ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'];

const paymentSchema = new Schema(
  {
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
      index: true,
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: 'PENDING',
      index: true,
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

paymentSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
module.exports.PAYMENT_STATUS = PAYMENT_STATUS;