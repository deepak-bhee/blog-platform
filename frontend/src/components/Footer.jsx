import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

const LINKS_NAV = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/register', label: 'Sign Up' }, { to: '/login', label: 'Sign In' }];
const LINKS_CREATE = [{ to: '/create-post', label: 'Write a Post' }, { to: '/my-posts', label: 'My Posts' }, { to: '/profile', label: 'Profile' }];

const ColLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
    >
      {label}
    </Link>
  </li>
);

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.35),rgba(232,121,160,0.25),transparent)' }} />

      <div style={{ background: 'rgba(8,11,18,0.92)', backdropFilter: 'blur(16px)', paddingTop: '52px', paddingBottom: '28px' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '40px', marginBottom: '48px' }}>

            {/* Brand */}
            <div style={{ gridColumn: 'span 2' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}>

                <span style={{ fontSize: '20px', fontWeight: 900, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Blog<span className="text-gradient-soft">gg.</span>
                </span>
              </Link>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '280px', fontFamily: 'Inter, sans-serif' }}>
                A modern platform where writers, thinkers, and creators share ideas that shape the future.
              </p>
            </div>

            {/* Nav */}
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px', fontFamily: 'Inter, sans-serif' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {LINKS_NAV.map(l => <ColLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Create */}
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px', fontFamily: 'Inter, sans-serif' }}>Create</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {LINKS_CREATE.map(l => <ColLink key={l.to} {...l} />)}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ paddingTop: '22px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              © {new Date().getFullYear()} Bloggg · Made with <Heart style={{ display: 'inline', width: '12px', height: '12px', color: '#e879a0', margin: '0 2px' }} /> on the MERN stack
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['MongoDB', 'Express', 'React', 'Node.js'].map(t => (
                <span key={t} style={{ fontSize: '11px', padding: '3px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '999px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
