const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { notificationController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', notificationController.list);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);
router.post('/quote-request', notificationController.quoteRequest);

module.exports = router;
