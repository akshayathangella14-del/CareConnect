const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { disputeController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', disputeController.create);
router.get('/', disputeController.list);
router.get('/:id', disputeController.get);
router.patch('/:id', disputeController.update);

module.exports = router;
