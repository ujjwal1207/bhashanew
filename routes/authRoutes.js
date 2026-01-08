const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);

// Admin only routes
router.get('/pending-users', protect, admin, authController.getPendingUsers);
router.put('/approve/:userId', protect, admin, authController.approveUser);
router.delete('/reject/:userId', protect, admin, authController.rejectUser);

module.exports = router;
