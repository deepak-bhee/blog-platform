# Bloggg – Blog Platform with Comments

A full-stack MERN blogging platform where users can create accounts, publish blog posts, comment on articles, and manage their content.

## 🚀 Features

- **User Authentication** — JWT-based register/login/logout
- **Blog Posts** — Create, read, edit, and delete posts with categories, cover images, and excerpts
- **Comments** — Add, edit, and delete comments on any post
- **Search & Filter** — Full-text search by keyword + category filtering
- **Pagination** — Browse posts with paginated results (9 per page)
- **Profile Management** — Update name, bio, and avatar
- **Authorization** — Only authors can edit/delete their own posts and comments
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Protected Routes** — Auth-required pages redirect unauthenticated users

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM |
| State | React Context API |
| HTTP | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |

## 📁 Project Structure

```
blog-platform/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Navbar, Footer, PostCard, CommentCard, etc.
│   │   ├── pages/      # Home, Login, Register, CreatePost, PostDetails, etc.
│   │   ├── context/    # AuthContext
│   │   ├── services/   # Axios API service
│   │   └── utils/      # formatDate, truncateText
│   └── ...
│
└── backend/            # Node.js + Express API
    ├── config/         # MongoDB connection
    ├── controllers/    # Route handlers
    ├── middleware/     # Auth, error handling, validation
    ├── models/         # User, Post, Comment schemas
    ├── routes/         # API route definitions
    └── utils/          # JWT token generator
```

## ⚙️ Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (free tier works) or local MongoDB

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blog-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bloggg?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000/api`

### Start Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Click **Database Access** → Add database user with a strong password
4. Click **Network Access** → Add IP address (use `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application**
6. Copy the connection string and paste into `MONGODB_URI` in your `.env`
7. Replace `<password>` with your database user's password

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |

### Blog Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | No | Get all posts (search, filter, paginate) |
| GET | `/api/posts/:id` | No | Get single post |
| POST | `/api/posts` | Yes | Create post |
| PUT | `/api/posts/:id` | Yes (author) | Update post |
| DELETE | `/api/posts/:id` | Yes (author) | Delete post + comments |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts/:postId/comments` | No | Get post comments |
| POST | `/api/posts/:postId/comments` | Yes | Add comment |
| PUT | `/api/comments/:commentId` | Yes (owner) | Update comment |
| DELETE | `/api/comments/:commentId` | Yes (owner) | Delete comment |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:id` | No | Get public profile |
| PUT | `/api/users/profile` | Yes | Update own profile |
| GET | `/api/users/me/posts` | Yes | Get own posts |

### Query Parameters for GET /api/posts
```
?search=react        # Search in title and content
&category=Technology # Filter by category
&page=1              # Page number
&limit=9             # Posts per page
```

## 🗄 Database Models

### User
```js
{ name, email, password (hashed), bio, avatar, timestamps }
```

### Post
```js
{ title, content, excerpt, category, coverImage, author (ref User), timestamps }
```

### Comment
```js
{ content, user (ref User), post (ref Post), timestamps }
```

## 🔐 Authentication Flow

1. User registers → password hashed with bcryptjs → JWT returned
2. JWT stored in localStorage
3. Axios interceptor adds `Authorization: Bearer <token>` header
4. Backend middleware verifies JWT on protected routes
5. `req.user` available in all protected controller functions
6. On 401 response, frontend clears token and redirects to login

## 🚀 Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables in your hosting provider
2. Set `NODE_ENV=production`
3. Deploy with `npm start`

### Frontend (e.g., Vercel, Netlify)
1. Set `VITE_API_URL=https://your-backend-domain.com/api`
2. Build: `npm run build`
3. Serve `dist/` directory

## 🔮 Future Improvements

- [ ] Rich text editor (TipTap or ProseMirror)
- [ ] Image uploads to Cloudinary or S3
- [ ] Like/bookmark posts
- [ ] Follow authors
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Post drafts and scheduling
- [ ] RSS feed

## 👨‍💻 Author

Built with the MERN stack as a full-stack portfolio project demonstrating:
- RESTful API design
- JWT authentication
- MongoDB data modeling
- React state management
- Responsive UI/UX design
