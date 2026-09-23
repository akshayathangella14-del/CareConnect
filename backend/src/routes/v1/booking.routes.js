const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { bookingController, invoiceController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', bookingController.list);
router.get('/:id', bookingController.get);
router.post('/:id/confirm', bookingController.transition('confirm'));
router.post('/:id/en-route', bookingController.transition('enRoute'));
router.post('/:id/arrived', bookingController.transition('arrived'));
router.post('/:id/start', bookingController.transition('start'));
router.post('/:id/request-completion', bookingController.transition('requestCompletion'));
router.post('/:id/confirm-completion', bookingController.transition('confirmCompletion'));
router.post('/:id/cancel', bookingController.cancel);
router.post('/:id/evidence', bookingController.addEvidence);
router.post('/:id/scope-changes', bookingController.requestScopeChange);
router.post('/:id/scope-changes/:changeId/approve', bookingController.decideScopeChange('APPROVED'));
router.post('/:id/scope-changes/:changeId/reject', bookingController.decideScopeChange('REJECTED'));
router.get('/:id/service-trace', bookingController.serviceTrace);
router.get('/:id/proof-pack', bookingController.proofPack);
router.post('/:id/invoice', invoiceController.createForBooking);

module.exports = router;
