import { body, validationResult } from 'express-validator';

/**
 * Run validation and return errors if any.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation rules
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  validate,
];

// Login validation rules
export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Post validation rules
export const postValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('coverImage')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (typeof value !== 'string') return false;
      if (value.startsWith('data:image/') || value.startsWith('/')) return true;
      try { new URL(value); return true; } catch { return false; }
    })
    .withMessage('Cover image must be a valid URL or uploaded image'),
  validate,
];

// Comment validation rules
export const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  validate,
];

// Profile update validation rules
export const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('avatar')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (typeof value !== 'string') return false;
      if (value.startsWith('data:image/') || value.startsWith('/')) return true;
      try { new URL(value); return true; } catch { return false; }
    })
    .withMessage('Avatar must be a valid URL or uploaded image'),
  validate,
];
