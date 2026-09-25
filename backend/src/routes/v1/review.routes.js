const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { reviewController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/', reviewController.list);
router.use(authenticate);
router.post('/', reviewController.create);

module.exports = router;
