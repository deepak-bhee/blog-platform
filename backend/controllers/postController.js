import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

/**
 * Generate an excerpt from content if not provided
 */
const generateExcerpt = (content, maxLength = 160) => {
  const plainText = content.replace(/\n/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * @desc    Get all posts with search, filter, sort, pagination
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get comment counts for each post
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const commentMap = {};
    commentCounts.forEach((c) => {
      commentMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: commentMap[post._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithCounts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name email avatar bio'
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const commentCount = await Comment.countDocuments({ post: post._id });

    res.status(200).json({
      success: true,
      data: { post: { ...post.toObject(), commentCount } },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, coverImage, excerpt, coverImagePosition } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      coverImage: coverImage || '',
      coverImagePosition: coverImagePosition || '50% 50%',
      excerpt: excerpt || generateExcerpt(content),
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: populatedPost },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private — author only
 */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Authorization check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this post',
      });
    }

    const { title, content, category, coverImage, excerpt, coverImagePosition } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.coverImagePosition = coverImagePosition !== undefined ? coverImagePosition : post.coverImagePosition;
    post.excerpt = excerpt || (content ? generateExcerpt(content) : post.excerpt);

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post and all its comments
 * @route   DELETE /api/posts/:id
 * @access  Private — author only
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Authorization check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post and all associated comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts by authenticated user
 * @route   GET /api/users/me/posts
 * @access  Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    // Get comment counts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const commentMap = {};
    commentCounts.forEach((c) => {
      commentMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: commentMap[post._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      data: { posts: postsWithCounts },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like or unlike a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: { likes: post.likes },
    });
  } catch (error) {
    next(error);
  }
};
