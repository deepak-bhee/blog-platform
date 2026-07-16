import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const ABSTRACT_AVATARS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1618005195353-0982c504eedc?auto=format&fit=crop&w=150&h=150&q=80',
];

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const randomAvatar = ABSTRACT_AVATARS[Math.floor(Math.random() * ABSTRACT_AVATARS.length)];

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      avatar: randomAvatar,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
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

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
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

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

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
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
