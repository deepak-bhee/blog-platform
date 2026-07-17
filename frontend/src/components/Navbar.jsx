import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, PenSquare, User, LogOut, Menu, X,
  Home, FileText, Info, ChevronDown, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/about', label: 'About', icon: Info },
  ];
  const authLinks = isAuthenticated
    ? [
      { to: '/create-post', label: 'Write', icon: PenSquare },
      { to: '/my-posts', label: 'My Posts', icon: FileText },
    ]
    : [];



  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.35s ease',
        background: 'transparent',
      }}
    >
      <div className="section-container" style={{ padding: scrolled ? '0 16px' : undefined, transition: 'all 0.5s ease' }}>
        <nav
          className={scrolled ? "px-4 sm:px-7" : "px-3"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            height: scrolled ? '56px' : '64px',
            maxWidth: scrolled ? '920px' : '100%',
            margin: scrolled ? '12px auto 0' : '0 auto',
            background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(33, 33, 33, 0)',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            borderRadius: scrolled ? '999px' : '0px',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '0 12px 32px rgba(0, 0, 0, 0.4)' : 'none',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.3px', transition: 'color 0.3s' }}>
              Blog<span className="text-gradient-soft">gg.</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="hidden md:flex items-center justify-center"
            style={{
              gap: scrolled ? '24px' : '36px',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {[...navLinks, ...authLinks].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif',
                      color: isActive ? '#ffffff' : '#8892a4',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.color = '#8892a4';
                    }}
                  >
                    {isActive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#a3e635',
                          boxShadow: '0 0 8px #a3e635, 0 0 16px rgba(163, 230, 53, 0.5)',
                        }}
                      />
                    )}
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center" style={{ gap: '10px' }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  id="user-menu-button"
                  aria-expanded={userMenuOpen}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px 6px 8px', borderRadius: '12px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }} />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f8', fontFamily: 'Inter, sans-serif' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--text-muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setUserMenuOpen(false)} />
                    <div
                      className="animate-slide-down"
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: '200px', borderRadius: '16px', zIndex: 20,
                        background: 'rgba(10,12,22,0.96)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        padding: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Signed in as</p>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#a5b4fc'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User style={{ width: '15px', height: '15px' }} />
                        Profile
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                      <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px', fontSize: '14px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut style={{ width: '15px', height: '15px' }} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" className="btn-ghost">Sign In</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '9px 18px' }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'; }}
          >
            {mobileOpen ? <X style={{ width: '20px', height: '20px', color: '#a5b4fc' }} /> : <Menu style={{ width: '20px', height: '20px', color: '#f0f2f8' }} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden animate-slide-down"
            style={{
              marginTop: '10px',
              padding: '16px 20px',
              background: 'rgba(10, 10, 10, 0.94)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[...navLinks, ...authLinks].map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: isActive ? '#a5b4fc' : 'var(--text-secondary)', background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent', fontFamily: 'Inter, sans-serif' }}>
                      <Icon style={{ width: '16px', height: '16px' }} />
                      {label}
                    </span>
                  )}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                    {({ isActive }) => (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: isActive ? '#a5b4fc' : 'var(--text-secondary)', background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent', fontFamily: 'Inter, sans-serif' }}>
                        <User style={{ width: '16px', height: '16px' }} /> Profile
                      </span>
                    )}
                  </NavLink>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <LogOut style={{ width: '16px', height: '16px' }} /> Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                  <Link to="/login" className="btn-secondary" style={{ justifyContent: 'center' }}>Sign In</Link>
                  <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }}>
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
