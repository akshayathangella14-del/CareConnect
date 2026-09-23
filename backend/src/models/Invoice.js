const mongoose = require('mongoose');

const { Schema } = mongoose;

const INVOICE_STATUSES = ['DRAFT', 'ISSUED', 'UNPAID', 'PAID', 'VOID'];
const INVOICE_PAYMENT_STATUSES = [
  'NOT_APPLICABLE',
  'REFUND_PENDING',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
];

const invoiceLineItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 300 },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
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
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    lineItems: {
      type: [invoiceLineItemSchema],
      required: true,
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one invoice line item is required.',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, min: 0, default: 0 },
    discount: { type: Number, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    issuedAt: {
      type: Date,
      default: null,
    },
    dueAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      default: 'DRAFT',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: INVOICE_PAYMENT_STATUSES,
      default: 'NOT_APPLICABLE',
      index: true,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
module.exports.INVOICE_STATUSES = INVOICE_STATUSES;
module.exports.INVOICE_PAYMENT_STATUSES = INVOICE_PAYMENT_STATUSES;
