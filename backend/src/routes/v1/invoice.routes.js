const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { invoiceController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', invoiceController.list);
router.get('/:id', invoiceController.get);
router.patch('/:id', invoiceController.update);

module.exports = router;
