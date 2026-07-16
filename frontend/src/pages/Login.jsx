import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, BookOpen, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const InputField = ({ id, name, type = 'text', value, onChange, placeholder, icon: Icon, error, autoComplete, rightSlot }) => (
  <div>
    <div style={{ position: 'relative' }}>
      <Icon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: error ? '#f87171' : 'var(--text-muted)', pointerEvents: 'none' }} />
      <input
        id={id} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        className="input-field"
        style={{ paddingLeft: '42px', paddingRight: rightSlot ? '44px' : '16px', borderColor: error ? 'rgba(239,68,68,0.4)' : undefined }}
        onFocus={e => { if (!error) { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; } }}
        onBlur={e => { if (!error) { e.target.style.borderColor = ''; e.target.style.background = ''; e.target.style.boxShadow = ''; } }}
      />
      {rightSlot && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>{rightSlot}</div>}
    </div>
    {error && <p className="error-message">{error}</p>}
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setLoading(true);
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('password')) setErrors({ password: msg });
      else if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 2 }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Card */}
        <div style={{ background: 'rgba(10,12,22,0.85)', backdropFilter: 'blur(24px)', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.2)', padding: '44px 36px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Blog<span className="text-gradient-soft">gg.</span>
              </span>
            </Link>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f2f8', marginBottom: '6px' }}>Welcome back</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <InputField
                id="email" name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                icon={Mail} error={errors.email} autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <InputField
                id="password" name="password" type={showPw ? 'text' : 'password'}
                value={form.password} onChange={handleChange} placeholder="••••••••"
                icon={Lock} error={errors.password} autoComplete="current-password"
                rightSlot={
                  <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide' : 'Show'} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    {showPw ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                  </button>
                }
              />
            </div>

            <button type="submit" id="login-submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '6px' }}>
              {loading ? (
                <><LoadingSpinner size="sm" /><span>Signing in…</span></>
              ) : (
                <><LogIn style={{ width: '17px', height: '17px' }} /><span>Sign In</span></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px', fontFamily: 'Inter, sans-serif' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#a5b4fc', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#c7d2fe'} onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
