const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { skillController } = require('../../controllers/business.controller');

const router = express.Router();

router.use(authenticate);
router.post('/', skillController.create);
router.get('/', skillController.list);
router.get('/:id', skillController.get);
router.patch('/:id', skillController.update);
router.delete('/:id', skillController.remove);

module.exports = router;
