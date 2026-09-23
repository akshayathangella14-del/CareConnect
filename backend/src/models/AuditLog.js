const mongoose = require('mongoose');

const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });
auditLogSchema.index({ actor: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
