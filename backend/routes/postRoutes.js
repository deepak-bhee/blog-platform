import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController.js';
import {
  getComments,
  addComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  postValidation,
  commentValidation,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Post routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, postValidation, createPost);
router.put('/:id', protect, postValidation, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

// Comment routes nested under posts
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, commentValidation, addComment);

export default router;
