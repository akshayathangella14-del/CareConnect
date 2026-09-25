const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { invoiceController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', invoiceController.list);
router.post('/booking/:id', invoiceController.createForBooking);
router.get('/:id', invoiceController.get);
router.get('/:id/download', invoiceController.downloadPdf);
router.patch('/:id', invoiceController.update);

module.exports = router;
