const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, message, resourceType, resourceId }) => {
  if (!recipient) {
    return null;
  }

  return Notification.create({
    recipient,
    type,
    title,
    message,
    relatedResource: resourceType && resourceId ? { resourceType, resourceId } : undefined,
  });
};

const notifyMany = async (notifications) => {
  const validNotifications = notifications.filter(Boolean);

  if (validNotifications.length === 0) {
    return [];
  }

  return Notification.insertMany(validNotifications);
};

module.exports = {
  createNotification,
  notifyMany,
};
