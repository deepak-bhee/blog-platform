import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloggg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle expired/invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clean up storage
      localStorage.removeItem('bloggg_token');
      localStorage.removeItem('bloggg_user');
      // Only redirect if not already on auth pages
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Posts API ─────────────────────────────────────────────
export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.put(`/posts/${id}/like`),
};

// ─── Comments API ──────────────────────────────────────────
export const commentsAPI = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  update: (commentId, data) => api.put(`/comments/${commentId}`, data),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// ─── Users API ─────────────────────────────────────────────
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getMyPosts: () => api.get('/users/me/posts'),
};

// ─── Stats API ─────────────────────────────────────────────
export const statsAPI = {
  get: () => api.get('/stats'),
};

export default api;
