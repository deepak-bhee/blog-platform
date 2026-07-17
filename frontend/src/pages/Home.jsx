import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PenSquare, ChevronLeft, ChevronRight,
  Sparkles, TrendingUp, Users, Star, Zap, Globe, BookOpen,
  ArrowDown, Code2, Lightbulb,
} from 'lucide-react';
import { postsAPI, statsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import TextPressure from '../components/TextPressure';

const LIMIT = 9;

// STATS is now built dynamically from the API — see liveStats state below

const TAGS = [
  'Technology','Programming','Education','Lifestyle',
  'Travel','Science','Business','Design','Philosophy',
  'Technology','Programming','Education','Lifestyle',
  'Travel','Science','Business','Design','Philosophy',
];

function useReveal() {
  useEffect(() => {
    const ob = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => ob.observe(el));
    return () => ob.disconnect();
  }, []);
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [liveStats, setLiveStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const exploreRef = useRef(null);

  useReveal();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 380);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => { setPage(1); }, [debouncedSearch, category]);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  // Fetch real platform stats once on mount
  useEffect(() => {
    statsAPI.get()
      .then(res => setLiveStats(res.data.data))
      .catch(() => setStatsError(true));
  }, []);

  // Build the stats array from live data (or show placeholders while loading)
  const STATS = liveStats
    ? [
        { icon: PenSquare,  label: 'Stories', value: liveStats.stories >= 1000 ? `${(liveStats.stories / 1000).toFixed(1)}k` : String(liveStats.stories) },
        { icon: Users,      label: 'Writers', value: liveStats.writers >= 1000 ? `${(liveStats.writers / 1000).toFixed(1)}k` : String(liveStats.writers) },
        { icon: TrendingUp, label: 'Topics',  value: String(liveStats.topics) },
        { icon: Star,       label: 'Rating',  value: statsError ? '—' : String(liveStats.rating) },
      ]
    : [
        { icon: PenSquare,  label: 'Stories', value: '…' },
        { icon: Users,      label: 'Writers', value: '…' },
        { icon: TrendingUp, label: 'Topics',  value: '…' },
        { icon: Star,       label: 'Rating',  value: '…' },
      ];


  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postsAPI.getAll({
        page, limit: LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== 'All' && { category }),
      });
      setPosts(res.data.data.posts);
      setPagination(res.data.data.pagination);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [page, debouncedSearch, category]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const scrollToExplore = () => exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  const clearFilters = () => { setSearch(''); setCategory('All'); };

  const tr = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>

            {/* Badge */}
            <div style={{ ...tr(0.1), display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '999px', marginBottom: '28px' }}>
              <div className="live-dot" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc', fontFamily: 'Inter, sans-serif' }}>
                Where great stories begin
              </span>
            </div>

            {/* Headline */}
            <div
              style={{
                ...tr(0.2),
                position: 'relative',
                height: 'clamp(90px, 14vw, 130px)',
                width: '100%',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TextPressure
                text="ideas that shape the world"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="inherit"
                className="text-gradient"
                minFontSize={24}
              />
            </div>

            {/* Sub */}
            <p style={{ ...tr(0.32), fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 44px', fontFamily: 'Inter, sans-serif' }}>
              A modern writing platform for thinkers, creators, and storytellers.
              Share knowledge. Discover perspectives. Build community.
            </p>

            {/* CTAs */}
            <div style={{ ...tr(0.44), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '72px' }}>
              <button onClick={scrollToExplore} className="btn-primary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                <BookOpen style={{ width: '17px', height: '17px' }} />
                <span>Explore Stories</span>
                <ArrowRight style={{ width: '17px', height: '17px' }} />
              </button>
              <Link to={isAuthenticated ? '/create-post' : '/register'} className="btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                <PenSquare style={{ width: '17px', height: '17px' }} />
                Start Writing
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4"
              style={{
                ...tr(0.55),
                gap: '16px',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {STATS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{ padding: '18px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Icon style={{ width: '18px', height: '18px', color: '#6366f1', margin: '0 auto 6px', display: 'block' }} />
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll arrow */}
        <button onClick={scrollToExplore} className="animate-float" style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.45, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.45}>
          <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Scroll</span>
          <ArrowDown style={{ width: '15px', height: '15px', color: '#6366f1' }} />
        </button>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 0', background: 'rgba(99,102,241,0.025)', position: 'relative', zIndex: 2 }} className="marquee-wrapper">
        <div className="marquee-track" style={{ gap: '12px', alignItems: 'center' }}>
          {TAGS.map((tag, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: ['#6366f1','#e879a0','#f59e0b','#06b6d4'][i % 4], display: 'inline-block', flexShrink: 0 }} />
              {tag}
            </span>
          ))}
        </div>
      </div>



      {/* ── POSTS SECTION ────────────────────────────────── */}
      <section id="explore" ref={exploreRef} style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(232,121,160,0.3),transparent)' }} />

        <div className="section-container">
          {/* Header */}
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 12px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#67e8f9', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}>Latest</span>
              <h2 style={{ fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', fontWeight: 800, color: '#f0f2f8', lineHeight: 1.2 }}>Fresh Stories</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontFamily: 'Inter, sans-serif' }}>Handpicked articles from writers around the world</p>
            </div>
            {isAuthenticated && (
              <Link to="/create-post" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
                <PenSquare style={{ width: '15px', height: '15px' }} />
                <span>New Story</span>
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="reveal" style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', marginBottom: '28px' }}>
            <div style={{ marginBottom: '14px' }}>
              <SearchBar value={search} onChange={setSearch} onClear={clearFilters} placeholder="Search articles, topics, authors…" />
            </div>
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>

          {/* Results info */}
          {!loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {pagination.total === 0 ? 'No posts found' : `${posts.length} of ${pagination.total} post${pagination.total !== 1 ? 's' : ''}`}
                {(debouncedSearch || category !== 'All') && (
                  <button onClick={clearFilters} style={{ marginLeft: '8px', color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>Clear</button>
                )}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {debouncedSearch && <span style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', borderRadius: '999px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(99,102,241,0.2)' }}>"{debouncedSearch}"</span>}
                {category !== 'All' && <span style={{ padding: '3px 10px', background: 'rgba(6,182,212,0.08)', color: '#67e8f9', borderRadius: '999px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(6,182,212,0.18)' }}>{category}</span>}
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6].map(n => (
                <div key={n} style={{ background: 'var(--bg-surface)', borderRadius: '18px', border: '1px solid var(--border)', padding: '18px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', height: '170px', borderRadius: '12px', marginBottom: '14px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  {[30, 80, 55].map((w, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', height: '12px', borderRadius: '6px', width: `${w}%`, marginBottom: '10px', animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title={debouncedSearch || category !== 'All' ? 'No matching posts' : 'No posts yet'}
              description={debouncedSearch || category !== 'All' ? 'Try different keywords or clear filters.' : 'Be the first to share a story!'}
              action={
                isAuthenticated
                  ? <Link to="/create-post" className="btn-primary"><PenSquare style={{ width: '15px', height: '15px' }} /><span>Write First Post</span></Link>
                  : <Link to="/register" className="btn-primary"><span>Get Started</span></Link>
              }
            />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '20px' }}>
                {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '52px' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ padding: '9px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: page === 1 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronLeft style={{ width: '17px', height: '17px' }} />
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p} onClick={() => setPage(p)}
                      style={{ width: '38px', height: '38px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: p === page ? 'linear-gradient(135deg,#6366f1,#4338ca)' : 'var(--bg-surface)', border: p === page ? 'none' : '1px solid var(--border)', color: p === page ? '#fff' : 'var(--text-secondary)', boxShadow: p === page ? '0 4px 14px rgba(99,102,241,0.35)' : 'none', fontFamily: 'Inter, sans-serif' }}
                    >{p}</button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    style={{ padding: '9px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: page === pagination.pages ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: page === pagination.pages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronRight style={{ width: '17px', height: '17px' }} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
          <div className="section-container">
            <div className="reveal" style={{ padding: '56px 40px', borderRadius: '28px', textAlign: 'center', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '280px', height: '280px', background: 'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '280px', height: '280px', background: 'radial-gradient(circle,rgba(232,121,160,0.12) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>
                  <Sparkles style={{ width: '13px', height: '13px' }} /> Join the Community
                </span>
                <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, color: '#f0f2f8', marginBottom: '14px' }}>Ready to Share Your Story?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '380px', margin: '0 auto 36px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>Join hundreds of writers. It's free, forever.</p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/register" className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    <span>Create Free Account</span>
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </Link>
                  <Link to="/login" className="btn-secondary" style={{ fontSize: '15px', padding: '14px 32px' }}>Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
