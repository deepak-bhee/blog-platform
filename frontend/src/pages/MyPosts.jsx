import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenSquare, FileText, Pencil, Trash2, Eye, Calendar, MessageCircle, Tag,
} from 'lucide-react';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const CAT_CLASS = {
  Technology:  'cat-technology',
  Programming: 'cat-programming',
  Education:   'cat-education',
  Lifestyle:   'cat-lifestyle',
  Travel:      'cat-travel',
  Science:     'cat-science',
  Business:    'cat-business',
  Other:       'cat-other',
};

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await usersAPI.getMyPosts();
        setPosts(res.data.data.posts);
      } catch (err) {
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await postsAPI.delete(deleteModal.postId);
      setPosts((prev) => prev.filter((p) => p._id !== deleteModal.postId));
      toast.success('Post deleted successfully');
      setDeleteModal({ open: false, postId: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '40px 0 80px' }}>
      <div className="section-container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f0f2f8', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'Playfair Display, serif' }}>
              <FileText style={{ width: '24px', height: '24px', color: '#6366f1' }} />
              My Stories
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
              {posts.length > 0 ? `${posts.length} published story${posts.length !== 1 ? 'ies' : ''}` : 'Your personal writing space'}
            </p>
          </div>
          <Link to="/create-post" id="create-new-post-btn" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            <PenSquare style={{ width: '15px', height: '15px' }} />
            <span>New Story</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={PenSquare}
            title="No stories yet"
            description="You haven't published anything yet. Share your thoughts, code, or perspectives with the world."
            action={
              <Link to="/create-post" className="btn-primary">
                <PenSquare style={{ width: '15px', height: '15px' }} />
                <span>Write First Story</span>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map((post) => {
              const badgeClass = CAT_CLASS[post.category] || CAT_CLASS.Other;
              return (
                <div
                  key={post._id}
                  className="animate-fade-in"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '18px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                >
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    
                    {/* Cover image thumbnail */}
                    <div
                      style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                        flexShrink: 0,
                        position: 'relative',
      
                      }}
                    >
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition:'center'

                          }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            fontWeight: 800,
                            color: 'rgba(255,255,255,0.15)',
                            fontFamily: 'Playfair Display, serif',
                          }}
                        >
                          {post.title.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Meta info & content */}
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                        <div>
                          {/* Tags row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span className={badgeClass} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                              <Tag style={{ width: '11px', height: '11px' }} />{post.category}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                              <Calendar style={{ width: '12px', height: '12px' }} />
                              {formatDate(post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                              <MessageCircle style={{ width: '12px', height: '12px' }} />
                              {post.commentCount || 0}
                            </span>
                          </div>

                          {/* Link to story */}
                          <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f0f2f8', lineHeight: 1.35, marginBottom: '6px', fontFamily: 'Playfair Display, serif', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#a5b4fc'} onMouseLeave={e => e.target.style.color = '#f0f2f8'}>
                              {post.title}
                            </h2>
                          </Link>
                          {post.excerpt && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'Inter, sans-serif', margin: 0 }}>{post.excerpt}</p>
                          )}
                        </div>

                        {/* Actions group */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Link
                            to={`/posts/${post._id}`}
                            title="View post"
                            style={{ padding: '8px', borderRadius: '10px', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Link>
                          <Link
                            to={`/edit-post/${post._id}`}
                            title="Edit post"
                            style={{ padding: '8px', borderRadius: '10px', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Pencil style={{ width: '15px', height: '15px' }} />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ open: true, postId: post._id })}
                            title="Delete post"
                            style={{ padding: '8px', borderRadius: '10px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 style={{ width: '15px', height: '15px' }} />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, postId: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this post?"
        message="This post and all its comments will be permanently deleted."
        confirmLabel="Delete Post"
      />
    </div>
  );
}
