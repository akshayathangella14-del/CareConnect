const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { providerController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/', providerController.list);
router.get('/featured', providerController.featured);

// Put /me routes BEFORE /:id
router.get('/me', authenticate, providerController.me);
router.patch('/me', authenticate, providerController.updateMe);

// Public route after specific routes
router.get('/:id', providerController.get);

// Authenticated routes requiring ID
router.use(authenticate);
router.post('/:id/verification', providerController.verify);

module.exports = router;
