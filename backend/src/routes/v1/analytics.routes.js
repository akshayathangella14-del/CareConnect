const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { analyticsController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/stats', analyticsController.publicStats);
router.use(authenticate);
router.get('/summary', analyticsController.summary);

module.exports = router;
