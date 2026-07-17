import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, BookOpen, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

/* Reusable styled input */
const InputField = ({ id, name, type = 'text', value, onChange, placeholder, icon: Icon, error, autoComplete, rightSlot }) => (
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
);

/* Password strength bar */
const StrengthBar = ({ password }) => {
  if (!password) return null;
  const s = password.length >= 10 ? 3 : password.length >= 8 ? 2 : password.length >= 6 ? 1 : 0;
  const colors = ['', 'rgba(239,68,68,0.8)', 'rgba(245,158,11,0.8)', 'rgba(34,197,94,0.8)'];
  const labels = ['', 'Weak', 'Good', 'Strong'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: '3px', flex: 1, borderRadius: '999px', background: i <= s ? colors[s] : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      {s > 0 && <span style={{ fontSize: '11px', fontWeight: 600, color: colors[s], fontFamily: 'Inter, sans-serif' }}>{labels[s]}</span>}
    </div>
  );
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'At least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min. 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      await register(form);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
    } finally { setLoading(false); }
  };

  const eyeBtn = (show, setShow) => (
    <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide' : 'Show'} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
      {show ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 2 }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '440px' }}>

        <div className="p-6 sm:p-10" style={{ background: 'rgba(10,12,22,0.85)', backdropFilter: 'blur(24px)', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '22px' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Blog<span className="text-gradient-soft">gg.</span>
              </span>
            </Link>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f2f8', marginBottom: '6px' }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Join writers and readers worldwide</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">Full name</label>
              <InputField id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" icon={User} error={errors.name} autoComplete="name" />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <InputField id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" icon={Mail} error={errors.email} autoComplete="email" />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="form-label">Password</label>
              <InputField id="reg-password" name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" icon={Lock} error={errors.password} autoComplete="new-password" rightSlot={eyeBtn(showPw, setShowPw)} />
              <StrengthBar password={form.password} />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
              <InputField id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" icon={Lock} error={errors.confirmPassword} autoComplete="new-password" rightSlot={eyeBtn(showConfirm, setShowConfirm)} />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" id="register-submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '6px' }}>
              {loading ? (
                <><LoadingSpinner size="sm" /><span>Creating account…</span></>
              ) : (
                <><UserPlus style={{ width: '17px', height: '17px' }} /><span>Create Account</span></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px', fontFamily: 'Inter, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#a5b4fc', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#c7d2fe'} onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
