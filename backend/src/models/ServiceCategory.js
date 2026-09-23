const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 140,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

serviceCategorySchema.index({ parent: 1, isActive: 1 });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
