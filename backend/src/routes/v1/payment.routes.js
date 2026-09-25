const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { paymentController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', paymentController.list);
router.get('/:id', paymentController.get);
router.post('/', paymentController.create);

module.exports = router;