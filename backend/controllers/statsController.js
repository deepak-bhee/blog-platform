import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

/**
 * @desc    Get platform-wide stats: stories, writers, topics, avg engagement rating
 * @route   GET /api/stats
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const [totalStories, totalWriters, categoryAgg, likesAgg] = await Promise.all([
      // Total published posts
      Post.countDocuments(),

      // Total registered users
      User.countDocuments(),

      // Number of unique categories that have at least 1 post
      Post.distinct('category'),

      // Average likes per post as a simple engagement score (scaled 0-5)
      Post.aggregate([
        {
          $project: {
            likeCount: { $size: '$likes' },
          },
        },
        {
          $group: {
            _id: null,
            avgLikes: { $avg: '$likeCount' },
            maxLikes: { $max: '$likeCount' },
          },
        },
      ]),
    ]);

    // Derive a 0-5 "rating" from average likes.
    // If there are no posts yet, default to 0.
    let rating = 0;
    if (likesAgg.length > 0) {
      const { avgLikes, maxLikes } = likesAgg[0];
      if (maxLikes > 0) {
        // Normalise average to a 5-star scale
        rating = Math.min(5, ((avgLikes / maxLikes) * 5 + 4) / 2);
      } else {
        // Posts exist but none are liked yet — show a neutral 4.0
        rating = totalStories > 0 ? 4.0 : 0;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        stories: totalStories,
        writers: totalWriters,
        topics: categoryAgg.length,
        rating: parseFloat(rating.toFixed(1)),
      },
    });
  } catch (error) {
    next(error);
  }
};
