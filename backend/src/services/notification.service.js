const Notification = require('../models/Notification');
const realtimeHub = require('../realtime/realtime.hub');

const createNotification = async ({ recipient, type, title, message, resourceType, resourceId }) => {
  if (!recipient) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    relatedResource: resourceType && resourceId ? { resourceType, resourceId } : undefined,
  });
  
  realtimeHub.emitToUser(recipient, 'notification', notification);
  
  return notification;
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
