import express from 'express';
import {
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { commentValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.put('/:commentId', protect, commentValidation, updateComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
