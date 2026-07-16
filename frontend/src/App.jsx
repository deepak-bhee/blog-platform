import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageBackground from './components/PageBackground';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import MyPosts from './pages/MyPosts';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Global aurora background — rendered once behind everything */}
        <PageBackground />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(10,12,22,0.95)',
              color: '#f0f2f8',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 500,
              padding: '14px 18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
              style: {
                background: 'rgba(10,12,22,0.95)',
                border: '1px solid rgba(34,197,94,0.2)',
              },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
              style: {
                background: 'rgba(10,12,22,0.95)',
                border: '1px solid rgba(239,68,68,0.2)',
              },
            },
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/about" element={<About />} />

              {/* Protected */}
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
