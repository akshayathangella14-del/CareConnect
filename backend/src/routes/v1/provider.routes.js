const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { providerController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/', providerController.list);
router.get('/featured', providerController.featured);
router.get('/:id', providerController.get);
router.use(authenticate);
router.get('/me', providerController.me);
router.patch('/me', providerController.updateMe);
router.post('/:id/verification', providerController.verify);

module.exports = router;
