const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { categoryController } = require('../../controllers/business.controller');

const router = express.Router();

router.get('/', categoryController.list);
router.get('/:id', categoryController.get);
router.use(authenticate);
router.post('/', categoryController.create);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
