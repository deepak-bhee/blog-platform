import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MessageCircle, Pencil, Trash2, ArrowLeft, Send, LogIn, Heart, Share2,
} from 'lucide-react';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatRelativeDate, estimateReadTime } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentCard from '../components/CommentCard';
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

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await postsAPI.getById(id);
        const postData = res.data.data.post;
        setPost(postData);
        setLikes(postData.likes || []);
      } catch (err) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  // Update hasLiked when user or likes array changes
  useEffect(() => {
    if (user && likes) {
      setHasLiked(likes.includes(user._id));
    } else {
      setHasLiked(false);
    }
  }, [user, likes]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const res = await commentsAPI.getByPost(id);
        setComments(res.data.data.comments);
      } catch (err) {
        console.error('Failed to fetch comments');
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to like this post');
      navigate('/login');
      return;
    }
    try {
      const res = await postsAPI.like(id);
      setLikes(res.data.data.likes);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update likes');
    }
  };

  const handleDeletePost = async () => {
    try {
      setDeleteLoading(true);
      await postsAPI.delete(id);
      toast.success('Post deleted successfully');
      navigate('/my-posts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      setCommentSubmitting(true);
      const res = await commentsAPI.create(id, { content: newComment.trim() });
      setComments((prev) => [res.data.data.comment, ...prev]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) {
      toast.error('Reply content cannot be empty');
      return;
    }
    try {
      setReplySubmitting(true);
      const res = await commentsAPI.create(id, {
        content: replyContent.trim(),
        parentComment: parentId,
      });
      setComments((prev) => [...prev, res.data.data.comment]);
      setReplyContent('');
      setReplyToId(null);
      toast.success('Reply posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;
  const badgeClass = CAT_CLASS[post.category] || CAT_CLASS.Other;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '32px 0 80px' }}>
      <div className="section-container" style={{ maxWidth: '820px' }}>
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', padding: '6px 12px', borderRadius: '10px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f2f8'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <ArrowLeft style={{ width: '15px', height: '15px' }} />
          <span>Back</span>
        </button>

        {/* Article block */}
        <article
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          {/* Cover */}
          {post.coverImage && (
            <div
              style={{
                width: '100%',
                height: '360px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                flexShrink: 0,
              }}
            >
              <img
                src={post.coverImage}
                alt={post.title}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: post.coverImagePosition || 'center 30%',
                }}
                onError={(e) => (e.target.parentElement.style.display = 'none')}
              />
            </div>
          )}

          <div style={{ padding: '40px' }}>
            {/* Meta tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span className={badgeClass} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                {post.category}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                <Clock style={{ width: '13px', height: '13px' }} />
                {estimateReadTime(post.content)}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                <MessageCircle style={{ width: '13px', height: '13px' }} />
                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f0f2f8', lineHeight: 1.25, marginBottom: '24px', fontFamily: 'Playfair Display, serif' }}>
              {post.title}
            </h1>

            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar} alt={post.author.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.3)' }}
                  />
                ) : (
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8', fontFamily: 'Inter, sans-serif' }}>{post.author?.name || 'Unknown'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>
                    <Calendar style={{ width: '12px', height: '12px' }} />
                    {formatDate(post.createdAt)}
                    {post.updatedAt !== post.createdAt && (
                      <span>(Updated {formatRelativeDate(post.updatedAt)})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Like Button */}
                <button
                  type="button" onClick={handleLikePost}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: hasLiked ? 'rgba(232,121,160,0.15)' : 'var(--bg-surface)',
                    border: hasLiked ? '1px solid rgba(232,121,160,0.35)' : '1px solid var(--border)',
                    color: hasLiked ? '#e879a0' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!hasLiked) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }
                  }}
                  onMouseLeave={e => {
                    if (!hasLiked) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }
                  }}
                >
                  <Heart style={{ width: '15px', height: '15px', fill: hasLiked ? '#e879a0' : 'none' }} />
                  <span>{likes.length}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Post link copied to clipboard!');
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <Share2 style={{ width: '15px', height: '15px' }} />
                </button>

                {isAuthor && (
                  <>
                    <Link to={`/edit-post/${post._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      <Pencil style={{ width: '13px', height: '13px' }} />
                      <span>Edit</span>
                    </Link>
                    <button type="button" onClick={() => setDeleteModal(true)} className="btn-danger" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Prose Body */}
            <div className="prose-custom" style={{ color: 'var(--text-secondary)' }}>
              {(() => {
                if (!post.content) return null;
                const blocks = post.content.split(/\n\n+/);
                return blocks.map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;
                  
                  if (trimmed.startsWith('###')) {
                    return <h3 key={idx} style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8', marginTop: '24px', marginBottom: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{trimmed.replace(/^###\s*/, '')}</h3>;
                  }
                  if (trimmed.startsWith('##')) {
                    return <h2 key={idx} style={{ fontSize: '20px', fontWeight: 800, color: '#f0f2f8', marginTop: '32px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', fontFamily: 'Playfair Display, serif' }}>{trimmed.replace(/^##\s*/, '')}</h2>;
                  }
                  if (trimmed.startsWith('#')) {
                    return <h1 key={idx} style={{ fontSize: '24px', fontWeight: 800, color: '#f0f2f8', marginTop: '32px', marginBottom: '16px', fontFamily: 'Playfair Display, serif' }}>{trimmed.replace(/^#\s*/, '')}</h1>;
                  }
                  if (trimmed.startsWith('>')) {
                    const cleanQuote = trimmed.split('\n').map(line => line.replace(/^>\s*/, '')).join('\n');
                    return (
                      <blockquote key={idx}>
                        {cleanQuote}
                      </blockquote>
                    );
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const items = trimmed.split('\n').map(line => line.replace(/^[-*]\s*/, ''));
                    return (
                      <ul key={idx} style={{ paddingLeft: '24px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {items.map((item, i) => <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{item}</li>)}
                      </ul>
                    );
                  }
                  if (trimmed.startsWith('```')) {
                    const codeLines = trimmed.split('\n');
                    const cleanCode = codeLines.slice(1, codeLines.length - (codeLines[codeLines.length - 1] === '```' ? 1 : 0)).join('\n');
                    return (
                      <pre key={idx}>
                        <code>{cleanCode}</code>
                      </pre>
                    );
                  }
                  const parts = trimmed.split(/(`[^`]+`)/g);
                  const elements = parts.map((part, i) => {
                    if (part.startsWith('`') && part.endsWith('`')) {
                      return <code key={i}>{part.slice(1, -1)}</code>;
                    }
                    return part;
                  });
                  return <p key={idx} style={{ marginBottom: '20px', fontSize: '15px', lineHeight: 1.7 }}>{elements}</p>;
                });
              })()}
            </div>

            {/* Author details block */}
            <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar} alt={post.author.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.2)' }}
                />
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, flexShrink: 0 }}>
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8', marginBottom: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Written by {post.author?.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Member since {formatDate(post.author?.createdAt, { year: 'numeric', month: 'long' })}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  {post.author?.bio || "This author hasn't shared a bio yet, but stay tuned for more amazing stories."}
                </p>
              </div>
            </div>

          </div>
        </article>

        {/* ── Comments Card Block ─────────────────────── */}
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f0f2f8', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <MessageCircle style={{ width: '20px', height: '20px', color: '#6366f1' }} />
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>

          {/* Add Comment input */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {user?.avatar ? (
                  <img
                    src={user.avatar} alt={user.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', marginTop: '4px' }}
                  />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, marginTop: '4px', flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <textarea
                    id="new-comment-input" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    rows={3} maxLength={1000} className="input-field" style={{ resize: 'none', marginBottom: '8px' }}
                    placeholder={`Share your thoughts about "${post.title}"...`}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{newComment.length}/1000</span>
                    <button type="submit" id="submit-comment-btn" disabled={commentSubmitting || !newComment.trim()} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      {commentSubmitting ? (
                        <><LoadingSpinner size="sm" /><span>Posting...</span></>
                      ) : (
                        <><Send style={{ width: '13px', height: '13px' }} /><span>Post Comment</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '16px', padding: '16px', marginBottom: '32px' }}>
              <LogIn style={{ width: '18px', height: '18px', color: '#6366f1', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                <Link to="/login" style={{ fontWeight: 700, color: '#a5b4fc', textDecoration: 'none' }}>Sign in</Link> to join the conversation and leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
              <LoadingSpinner size="md" />
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <MessageCircle style={{ width: '36px', height: '36px', margin: '0 auto 12px', color: 'var(--border)' }} />
              <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>No comments yet</p>
              <p style={{ fontSize: '12px', marginTop: '4px', margin: 0 }}>Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {comments.filter(c => !c.parentComment).map((rootComment) => {
                const replies = comments
                  .filter(c => c.parentComment === rootComment._id)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                return (
                  <div key={rootComment._id} style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <CommentCard
                      comment={rootComment} onDelete={handleCommentDelete} onUpdate={handleCommentUpdate}
                      onReplyClick={() => {
                        setReplyToId(replyToId === rootComment._id ? null : rootComment._id);
                        setReplyContent('');
                      }}
                    />

                    {/* Inline Reply Input */}
                    {replyToId === rootComment._id && (
                      <div className="animate-slide-up" style={{ marginLeft: '32px', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', gap: '12px' }}>
                        {user?.avatar ? (
                          <img
                            src={user.avatar} alt={user.name}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
                          />
                        ) : (
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <textarea
                            value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
                            rows={2} maxLength={1000} className="input-field"
                            placeholder={`Reply to ${rootComment.user?.name || 'comment'}...`}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button type="button" onClick={() => setReplyToId(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                              Cancel
                            </button>
                            <button type="button" onClick={() => handleSubmitReply(rootComment._id)} disabled={replySubmitting || !replyContent.trim()} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                              {replySubmitting ? <LoadingSpinner size="sm" /> : 'Post Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies Thread */}
                    {replies.length > 0 && (
                      <div style={{ marginLeft: '32px', paddingLeft: '16px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
                        {replies.map((reply) => (
                          <CommentCard
                            key={reply._id} comment={reply}
                            onDelete={handleCommentDelete} onUpdate={handleCommentUpdate}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDeletePost}
        loading={deleteLoading} title="Delete this post?"
        message="This post and all its comments will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Post"
      />
    </div>
  );
}
