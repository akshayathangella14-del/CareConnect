const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { categoryController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/', authenticate, categoryController.list);
router.get('/:id', authenticate, categoryController.get);
router.post('/', authenticate, categoryController.create);
router.patch('/:id', authenticate, categoryController.update);
router.delete('/:id', authenticate, categoryController.remove);

module.exports = router;
