import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, resetPassword } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createUser);
router.get('/', protect, getUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

// Only superadmin can reset another user's password
router.put('/:id/reset-password', protect, authorize('superadmin'), resetPassword);

export default router;