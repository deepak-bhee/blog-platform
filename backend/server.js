import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Set security headers
app.use(helmet());

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 registration/login requests per 15 mins
  message: {
    success: false,
    message: 'Too many login or registration attempts, please try again after 15 minutes',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Apply global rate limiting to all routes
app.use('/api', globalLimiter);

// Apply strict rate limiting to authentication routes
app.use('/api/auth', authLimiter);

// CORS configuration — support multiple origins (comma-separated in .env)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Bloggg API is running 🚀' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

export default app;
