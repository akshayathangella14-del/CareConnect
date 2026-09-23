const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { reviewController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', reviewController.create);
router.get('/', reviewController.list);

module.exports = router;
