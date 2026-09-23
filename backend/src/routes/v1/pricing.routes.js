const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { pricingController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', pricingController.create);
router.get('/', pricingController.list);
router.get('/:id', pricingController.get);
router.patch('/:id', pricingController.update);
router.delete('/:id', pricingController.remove);

module.exports = router;
