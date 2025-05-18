const express = require('express');
const router = express.Router();
const ctrl = require('./controllers/notificationController');

router.post('/notifications', ctrl.sendNotification);
router.get('/users/:userId/notifications', ctrl.getNotifications);

module.exports = router;
