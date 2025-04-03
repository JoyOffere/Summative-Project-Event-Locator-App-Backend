const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', protect, userController.getProfile);  // Add this line
router.put('/profile', protect, userController.updateProfile);

module.exports = router;