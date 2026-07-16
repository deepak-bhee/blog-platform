import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 2 }}>
      <div className="animate-fade-in-up" style={{ textAlign: 'center', maxWidth: '440px' }}>
        
        {/* 404 Visual */}
        <div style={{ position: 'relative', marginBottom: '24px', userSelect: 'none' }}>
          <div className="text-gradient" style={{ fontSize: 'clamp(8rem, 16vw, 11rem)', fontWeight: 900, lineHeight: 1, fontFamily: 'Playfair Display, serif' }}>
            404
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}>
              <span style={{ fontSize: '28px' }}>🔍</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f2f8', marginBottom: '10px' }}>
          Story Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, marginBottom: '32px', fontFamily: 'Inter, sans-serif' }}>
          The page you're looking for doesn't exist or has been moved to another space. Let's get you back on track!
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
            <Home style={{ width: '16px', height: '16px' }} />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: '15px' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
