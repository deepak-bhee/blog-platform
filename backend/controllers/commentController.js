import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * @desc    Get all comments for a post
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
export const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { comments, count: comments.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: populatedComment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:commentId
 * @access  Private — comment owner only
 */
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    // Authorization check
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this comment',
      });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: updatedComment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:commentId
 * @access  Private — comment owner only
 */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    // Authorization check
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
