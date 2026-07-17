import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PenSquare, Image, Tag, FileText, Eye, EyeOff as EyeClose, Send, X, ChevronDown, AlertCircle,
} from 'lucide-react';
import { postsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CoverImageAdjuster from '../components/CoverImageAdjuster';
import ImageUploadButton from '../components/ImageUploadButton';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Technology', 'Programming', 'Education', 'Lifestyle',
  'Travel', 'Science', 'Business', 'Other',
];

const COVER_PRESETS = [
  { name: 'Tech & Space', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coding', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
  { name: 'Research', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },
  { name: 'Business', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Creative', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mountain', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' },
  { name: 'Library', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gradient', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    coverImage: '',
    coverImagePosition: '50% 50%',
    content: '',
    excerpt: '',
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.trim().length > 200) errs.title = 'Title too long (max 200 chars)';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.content.trim()) errs.content = 'Content is required';
    else if (formData.content.trim().length < 50) errs.content = 'Content must be at least 50 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSelectPreset = (url) => {
    setFormData((p) => ({ ...p, coverImage: url, coverImagePosition: '50% 50%' }));
    if (errors.coverImage) setErrors((p) => ({ ...p, coverImage: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before publishing');
      return;
    }
    try {
      setLoading(true);
      const res = await postsAPI.create(formData);
      toast.success('Post published successfully!');
      navigate(`/posts/${res.data.data.post._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = formData.content.length;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '40px 0 80px' }}>
      <div className="section-container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f2f8', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'Playfair Display, serif' }}>
              <PenSquare style={{ width: '24px', height: '24px', color: '#6366f1' }} />
              Write New Story
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>Compose and share your thoughts</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button" onClick={() => setPreview((p) => !p)}
              className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {preview ? (
                <><EyeClose style={{ width: '14px', height: '14px' }} /> <span>Edit</span></>
              ) : (
                <><Eye style={{ width: '14px', height: '14px' }} /> <span>Preview</span></>
              )}
            </button>
            <Link to="/" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <X style={{ width: '14px', height: '14px' }} />
              <span>Cancel</span>
            </Link>
          </div>
        </div>

        {preview ? (
          /* ── Preview Mode ── */
          <div className="p-5 sm:p-10" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
            <span style={{ display: 'inline-block', padding: '3px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              Preview Draft
            </span>
            {formData.coverImage && (
              <img
                src={formData.coverImage} alt="Cover preview"
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            {formData.category && (
              <span className="badge badge-primary" style={{ marginBottom: '14px' }}>{formData.category}</span>
            )}
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f0f2f8', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>
              {formData.title || 'Untitled Story'}
            </h1>
            <div className="prose-custom" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
              {formData.content || 'Start typing in the editor to see your draft details here...'}
            </div>
          </div>
        ) : (
          /* ── Edit Form ── */
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Side: Content Fields */}
              <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Title */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <label htmlFor="post-title" className="form-label">Story Title *</label>
                  <div style={{ position: 'relative' }}>
                    <FileText style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--text-muted)' }} />
                    <input
                      id="post-title" name="title" type="text" value={formData.title} onChange={handleChange}
                      className="input-field" style={{ paddingLeft: '40px', fontSize: '16px', fontWeight: 600 }}
                      placeholder="Give your story a clear headline..." maxLength={200}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    {errors.title ? <p className="error-message" style={{ margin: 0 }}>{errors.title}</p> : <span />}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formData.title.length}/200</span>
                  </div>
                </div>
 
                {/* Main Content Area */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <label htmlFor="post-content" className="form-label">Write your thoughts *</label>
                  <textarea
                    id="post-content" name="content" value={formData.content} onChange={handleChange}
                    rows={18} className="input-field" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, minHeight: '360px', resize: 'vertical' }}
                    placeholder="Express your ideas here. Supports simple paragraphs and basic headings..."
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    {errors.content ? (
                      <p className="error-message" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle style={{ width: '13px', height: '13px' }} />
                        {errors.content}
                      </p>
                    ) : <span />}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {wordCount} words · {charCount} characters
                    </span>
                  </div>
                </div>
 
                {/* Excerpt */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="post-excerpt" className="form-label" style={{ margin: 0 }}>Short Description</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formData.excerpt.length}/300</span>
                  </div>
                  <textarea
                    id="post-excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange}
                    rows={3} maxLength={300} className="input-field" style={{ resize: 'none' }}
                    placeholder="A quick preview line shown on the list page (auto-generated if empty)"
                  />
                </div>
              </div>
 
              {/* Right Side: Sidebar */}
              <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Publish actions */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f0f2f8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Publish</h3>
                  <button
                    type="submit" id="publish-post-btn" disabled={loading}
                    className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  >
                    {loading ? (
                      <><LoadingSpinner size="sm" /><span>Publishing...</span></>
                    ) : (
                      <><Send style={{ width: '14px', height: '14px' }} /><span>Publish Story</span></>
                    )}
                  </button>
                  <Link
                    to="/" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}
                  >
                    Discard Draft
                  </Link>
                </div>

                {/* Category select */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <label htmlFor="post-category" className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag style={{ width: '14px', height: '14px', color: '#6366f1' }} /> Category *</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="post-category" name="category" value={formData.category} onChange={handleChange}
                      className="input-field" style={{ appearance: 'none', paddingRight: '40px', background: 'rgba(255,255,255,0.04)' }}
                    >
                      <option value="" style={{ background: '#080b12' }}>Choose category...</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} style={{ background: '#080b12', color: '#f0f2f8' }}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown style={{ absolute: true, position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  </div>
                  {errors.category && <p className="error-message">{errors.category}</p>}
                </div>

                {/* Cover Image Preset */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label htmlFor="post-cover" className="form-label" style={{ margin: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Image style={{ width: '14px', height: '14px', color: '#6366f1' }} /> Cover Photo</span>
                    </label>
                    <ImageUploadButton
                      onImage={(dataUrl) => setFormData((p) => ({ ...p, coverImage: dataUrl, coverImagePosition: '50% 50%' }))}
                      label="Upload cover"
                    />
                  </div>
                  <input
                    id="post-cover" name="coverImage" type="url" value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage} onChange={handleChange}
                    className="input-field" placeholder="Or paste a cover photo URL..." style={{ marginBottom: '14px', fontSize: '13px' }}
                  />
                  {formData.coverImage.startsWith('data:') && (
                    <p style={{ fontSize: '11px', color: '#a5b4fc', marginBottom: '14px', fontFamily: 'Inter, sans-serif' }}>
                      ✓ Photo from device selected
                    </p>
                  )}

                  {/* Preset list */}
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                    Choose cover preset
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', maxHeight: '110px', overflowY: 'auto' }}>
                    {COVER_PRESETS.map((preset) => {
                      const isSelected = formData.coverImage === preset.url;
                      return (
                        <button
                          key={preset.name} type="button" onClick={() => handleSelectPreset(preset.url)}
                          style={{ aspectRatio: '16/10', borderRadius: '6px', overflow: 'hidden', border: isSelected ? '2px solid #6366f1' : '2px solid transparent', padding: 0, cursor: 'pointer', background: 'none', transition: 'all 0.2s' }}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Live preview with drag-to-adjust */}
                  {formData.coverImage && (
                    <CoverImageAdjuster
                      url={formData.coverImage}
                      position={formData.coverImagePosition}
                      onPosition={(pos) => setFormData((p) => ({ ...p, coverImagePosition: pos }))}
                      onRemove={() => setFormData((p) => ({ ...p, coverImage: '', coverImagePosition: '50% 50%' }))}
                      height={160}
                    />
                  )}
                </div>

              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}
