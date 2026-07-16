import express from 'express';
import {
  getUserProfile,
  updateProfile,
} from '../controllers/userController.js';
import { getMyPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { profileValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/me/posts', protect, getMyPosts);
router.get('/:id', getUserProfile);
router.put('/profile', protect, profileValidation, updateProfile);

export default router;
