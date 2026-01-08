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
router.get('/all-users', protect, admin, authController.getAllUsers);
router.put('/approve/:userId', protect, admin, authController.approveUser);
router.put('/revoke/:userId', protect, admin, authController.revokeUser);
router.delete('/reject/:userId', protect, admin, authController.rejectUser);
router.delete('/delete/:userId', protect, admin, authController.deleteUser);

module.exports = router;
