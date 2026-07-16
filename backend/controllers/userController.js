import User from '../models/User.js';
import Post from '../models/Post.js';

/**
 * @desc    Get public user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const postCount = await Post.countDocuments({ author: user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
          postCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
