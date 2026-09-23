const AuditLog = require('../models/AuditLog');

const recordAudit = async ({ actor, action, resourceType, resourceId, metadata = {} }) => {
  if (!resourceId) {
    return null;
  }

  return AuditLog.create({
    actor: actor?._id || actor || null,
    action,
    resourceType,
    resourceId,
    metadata,
  });
};

module.exports = {
  recordAudit,
};
