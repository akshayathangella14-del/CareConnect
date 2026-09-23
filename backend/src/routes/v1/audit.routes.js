const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { auditController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', auditController.list);

module.exports = router;
