const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const {
  serviceRequestController,
  matchingController,
  quoteController,
} = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', serviceRequestController.create);
router.get('/', serviceRequestController.list);
router.get('/:id', serviceRequestController.get);
router.patch('/:id', serviceRequestController.update);
router.post('/:id/submit', serviceRequestController.submit);
router.post('/:id/cancel', serviceRequestController.cancel);
router.patch('/:id/ai-understanding', serviceRequestController.correctUnderstanding);
router.get('/:id/matches', matchingController.list);
router.post('/:id/quotes', quoteController.createForRequest);
router.get('/:id/quotes', quoteController.listForRequest);

module.exports = router;
