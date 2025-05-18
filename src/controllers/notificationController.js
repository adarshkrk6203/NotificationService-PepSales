const Notification = require('../models/notification');
const { publish } = require('../queue');

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, payload } = req.body;
    const notif = await Notification.create({ userId, type, payload });
    await publish(notif.id);
    res.status(201).json({ notificationId: notif.id, status: notif.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.params.userId };
    if (status) where.status = status;
    const notifs = await Notification.findAll({ where });
    res.json({ userId: req.params.userId, notifications: notifs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
