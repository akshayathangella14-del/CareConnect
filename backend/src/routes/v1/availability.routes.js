const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { availabilityController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', availabilityController.create);
router.get('/', availabilityController.list);
router.patch('/:id', availabilityController.update);
router.delete('/:id', availabilityController.remove);

module.exports = router;
