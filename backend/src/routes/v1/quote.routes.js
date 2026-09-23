const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { quoteController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/:id', quoteController.get);
router.patch('/:id', quoteController.update);
router.post('/:id/submit', quoteController.transition('SUBMITTED', 'QUOTE_SUBMITTED'));
router.post('/:id/accept', quoteController.accept);
router.post('/:id/reject', quoteController.transition('REJECTED', 'QUOTE_REJECTED'));
router.post('/:id/request-changes', quoteController.requestChanges);

module.exports = router;
