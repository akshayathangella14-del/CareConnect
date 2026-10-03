const express = require('express');
const { concierge } = require('../../controllers/ai.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.post('/concierge', concierge);

module.exports = router;
