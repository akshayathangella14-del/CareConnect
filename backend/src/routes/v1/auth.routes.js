const express = require('express');
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, authController.updateMe);
router.post('/me/profile-image', authenticate, upload.single('image'), authController.uploadProfileImage);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
