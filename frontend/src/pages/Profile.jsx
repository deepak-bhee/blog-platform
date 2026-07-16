import { useState, useEffect, useRef } from 'react';
import { Camera, Save, User, Mail, Calendar, FileText, Edit2, X, Upload } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// The two local avatar assets (Vite resolves these at build time)
import avatarWoman from '../assets/vecteezy_a-woman-profile-avatar-icon-with-brown-hair-and-a-red-shirt_52755997.jpg';
import avatarMan from '../assets/vecteezy_a-man-profile-avatar-icon-with-a-white-background_52755981.jpg';

const AVATAR_PRESETS = [avatarWoman, avatarMan];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await usersAPI.getProfile(user._id);
        setPostCount(res.data.data.user.postCount || 0);
      } catch (err) {
        console.error('Failed to load profile');
      }
    };
    if (user?._id) fetchProfile();
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (formData.bio.length > 500) errs.bio = 'Bio cannot exceed 500 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSelectAvatar = (url) => {
    setFormData((p) => ({ ...p, avatar: url }));
  };

  // Convert a file picked from device into a Base64 data URL
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((p) => ({ ...p, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-picked
    e.target.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      setLoading(true);
      const res = await usersAPI.updateProfile(formData);
      updateUser(res.data.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const avatarInitial = user?.name?.charAt(0).toUpperCase() || 'U';
  const displayAvatar = isEditing ? formData.avatar : user?.avatar;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '40px 0 80px' }}>
      <div className="section-container" style={{ maxWidth: '820px' }}>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f2f8', marginBottom: '32px', fontFamily: 'Playfair Display, serif' }}>
          My Profile
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* ── Left: Avatar & Stats Card ─────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Avatar Card */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginTop: '28px', marginBottom: '18px' }}>
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user?.name}
                    style={{
                      display: 'block',
                      width: '96px',
                      height: '96px',
                      borderRadius: '18px',
                      objectFit: 'cover',
                      border: '3px solid rgba(99,102,241,0.25)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      margin: '0 auto',
                      objectPosition: 'top'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg,#6366f1,#4338ca)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '32px',
                      fontWeight: 700,
                      margin: '0 auto',
                    }}
                  >
                    {avatarInitial}
                  </div>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo from device"
                    style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '28px', height: '28px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer' }}
                  >
                    <Camera style={{ width: '13px', height: '13px' }} />
                  </button>
                )}
              </div>

              {!isEditing && (
                <>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f8', marginBottom: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{user?.name}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>{user?.email}</p>
                  {user?.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: 'Inter, sans-serif', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>{user.bio}</p>}
                </>
              )}
            </div>

            {/* Account Stats Card */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Account Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                    <FileText style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} /> Stories Published
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f8', fontFamily: 'Inter, sans-serif' }}>{postCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                    <Calendar style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} /> Member Since
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f8', fontFamily: 'Inter, sans-serif' }}>
                    {formatDate(user?.createdAt, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Form Card ─────────────────────────────── */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Profile Details</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} id="edit-profile-btn" className="btn-secondary" style={{ padding: '7px 14px', fontSize: '13px' }}>
                  <Edit2 style={{ width: '13px', height: '13px' }} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button onClick={handleCancel} className="btn-ghost" style={{ padding: '7px 14px', fontSize: '13px' }}>
                  <X style={{ width: '13px', height: '13px' }} /> Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {/* Name field */}
                <div>
                  <label htmlFor="profile-name" className="form-label">Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--text-muted)' }} />
                    <input
                      id="profile-name" name="name" type="text" value={formData.name} onChange={handleChange}
                      className="input-field" style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {errors.name && <p className="error-message">{errors.name}</p>}
                </div>

                {/* Avatar chooser */}
                <div>
                  <label className="form-label">Profile Photo</label>

                  {/* Preset avatars — only the 2 local ones */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '14px' }}>
                    {AVATAR_PRESETS.map((src, idx) => {
                      const isSelected = formData.avatar === src;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAvatar(src)}
                          title={idx === 0 ? 'Woman avatar' : 'Man avatar'}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            padding: 0,
                            cursor: 'pointer',
                            background: 'none',
                            border: isSelected
                              ? '3px solid #6366f1'
                              : '3px solid transparent',
                            boxShadow: isSelected
                              ? '0 0 0 2px rgba(99,102,241,0.25)'
                              : 'none',
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={src}
                            alt={idx === 0 ? 'Woman avatar' : 'Man avatar'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </button>
                      );
                    })}

                    {/* Divider */}
                    <div style={{ width: '1px', height: '40px', background: 'var(--border)', flexShrink: 0 }} />

                    {/* Upload from device button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        border: '2px dashed rgba(99,102,241,0.35)',
                        background: 'rgba(99,102,241,0.05)',
                        color: '#a5b4fc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                      title="Upload from device / gallery"
                    >
                      <Upload style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '8px', fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px', lineHeight: 1 }}>UPLOAD</span>
                    </button>
                  </div>

                  {/* Optional: paste a URL manually */}
                  <div style={{ position: 'relative' }}>
                    <input
                      id="profile-avatar"
                      name="avatar"
                      type="url"
                      value={formData.avatar.startsWith('data:') ? '' : formData.avatar}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Or paste an image URL..."
                      style={{ fontSize: '13px', paddingRight: formData.avatar ? '36px' : '12px' }}
                    />
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, avatar: '' }))}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Clear avatar"
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                  </div>
                  {formData.avatar.startsWith('data:') && (
                    <p style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '6px', fontFamily: 'Inter, sans-serif' }}>
                      ✓ Photo from device selected
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="profile-bio" className="form-label" style={{ margin: 0 }}>Bio</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formData.bio.length}/500</span>
                  </div>
                  <textarea
                    id="profile-bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} maxLength={500}
                    className="input-field" style={{ resize: 'none' }} placeholder="Write a short summary about yourself..."
                  />
                  {errors.bio && <p className="error-message">{errors.bio}</p>}
                </div>

                {/* Save */}
                <button type="submit" id="save-profile-btn" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }}>
                  {loading ? (
                    <><LoadingSpinner size="sm" /><span>Saving...</span></>
                  ) : (
                    <><Save style={{ width: '14px', height: '14px' }} /><span>Save Profile</span></>
                  )}
                </button>
              </form>
            ) : (
              /* View Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ProfileField icon={<User style={{ width: '14px', height: '14px' }} />} label="Full Name" value={user?.name} />
                <ProfileField icon={<Mail style={{ width: '14px', height: '14px' }} />} label="Email Address" value={user?.email} />
                <ProfileField
                  icon={<Edit2 style={{ width: '14px', height: '14px' }} />}
                  label="Bio"
                  value={user?.bio || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13px' }}>No bio added yet</span>}
                />
                <ProfileField
                  icon={<Calendar style={{ width: '14px', height: '14px' }} />}
                  label="Member Since"
                  value={formatDate(user?.createdAt)}
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

const ProfileField = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
    <div style={{ color: '#6366f1', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontFamily: 'Inter, sans-serif' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#f0f2f8', fontFamily: 'Inter, sans-serif', wordBreak: 'break-word', lineHeight: 1.5 }}>{value}</div>
    </div>
  </div>
);
