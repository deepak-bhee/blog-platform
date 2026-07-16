import mongoose from 'mongoose';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Education',
  'Lifestyle',
  'Travel',
  'Science',
  'Business',
  'Other',
];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category',
      },
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImagePosition: {
      type: String,
      default: '50% 50%',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
