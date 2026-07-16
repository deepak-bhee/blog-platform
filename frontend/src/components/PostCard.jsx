import { Link } from 'react-router-dom';
import { Clock, MessageCircle, ArrowRight, Heart } from 'lucide-react';
import { formatDate, estimateReadTime } from '../utils/formatDate';
import { truncateText } from '../utils/truncateText';

const CAT_CLASS = {
  Technology: 'cat-technology',
  Programming: 'cat-programming',
  Education: 'cat-education',
  Lifestyle: 'cat-lifestyle',
  Travel: 'cat-travel',
  Science: 'cat-science',
  Business: 'cat-business',
  Other: 'cat-other',
};

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1e1b4b,#312e81)',
  'linear-gradient(135deg,#0c1445,#1e3a5f)',
  'linear-gradient(135deg,#1a0030,#3b0764)',
  'linear-gradient(135deg,#1a0a00,#431407)',
  'linear-gradient(135deg,#0a1a1a,#134e4a)',
];

export default function PostCard({ post, index = 0 }) {
  const { _id, title, excerpt, content, category, coverImage, coverImagePosition, author, createdAt, commentCount = 0, likes = [] } = post;

  const authorName = author?.name || 'Unknown';
  const catClass = CAT_CLASS[category] || CAT_CLASS.Other;
  const fallback = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  return (
    <article
      className="card-shine"
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-surface)', borderRadius: '18px',
        border: '1px solid var(--border)', overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        animation: `fadeInUp 0.55s ease-out ${Math.min(index * 0.07, 0.5)}s both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Cover */}
      <Link
        to={`/posts/${_id}`}
        style={{
          display: 'block',
          position: 'relative',
          height: '190px',
          overflow: 'hidden',
          background: fallback,
          flexShrink: 0,
        }}
      >
        {coverImage && (
          <img
            src={coverImage} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: coverImagePosition || 'center 30%', transition: 'transform 0.55s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
        {!coverImage && (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900, fontFamily: 'Playfair Display, serif', color: 'rgba(255,255,255,0.1)', userSelect: 'none' }}>
            {title.charAt(0)}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top,rgba(8,11,18,0.7),transparent)' }} />
        <span className={catClass} style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(8px)' }}>
          {category}
        </span>
      </Link>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '18px' }}>
        <Link to={`/posts/${_id}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8', lineHeight: 1.35, marginBottom: '9px', fontFamily: 'Playfair Display, serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#a5b4fc'}
            onMouseLeave={e => e.target.style.color = '#f0f2f8'}
          >
            {title}
          </h2>
        </Link>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
          {excerpt || truncateText(content, 130)}
        </p>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          {author?.avatar
            ? <img src={author.avatar} alt={authorName} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.3)', objectPosition: 'top' }} />
            : <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{authorName.charAt(0)}</div>
          }
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{authorName}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>{formatDate(createdAt, { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {[
              { icon: Clock, val: estimateReadTime(content) },
              { icon: MessageCircle, val: commentCount },
              { icon: Heart, val: likes.length },
            ].map(({ icon: Ic, val }) => (
              <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                <Ic style={{ width: '13px', height: '13px' }} />{val}
              </span>
            ))}
          </div>
          <Link
            to={`/posts/${_id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#6366f1', textDecoration: 'none', padding: '5px 10px', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#a5b4fc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#6366f1'; }}
          >
            Read <ArrowRight style={{ width: '12px', height: '12px' }} />
          </Link>
        </div>
      </div>
    </article>
  );
}
