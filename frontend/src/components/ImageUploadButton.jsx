import { useRef } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Renders a small "Upload from device" button.
 * When clicked, opens the native file picker and converts the chosen image
 * to a Base64 data URL, then calls onImage(dataUrl).
 *
 * Props:
 *   onImage  {function}  - called with the data: URI string
 *   label    {string}    - optional button label (default "Upload")
 *   style    {object}    - extra inline styles
 */
export default function ImageUploadButton({ onImage, label = 'Upload', style = {} }) {
  const ref = useRef(null);

  const handleChange = (e) => {
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
    reader.onload = (ev) => onImage?.(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        title="Upload image from device / gallery"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          border: '1px dashed rgba(99,102,241,0.4)',
          background: 'rgba(99,102,241,0.06)',
          color: '#a5b4fc',
          transition: 'all 0.2s',
          ...style,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.14)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.65)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
        }}
      >
        <Upload style={{ width: '13px', height: '13px' }} />
        <span>{label}</span>
      </button>
    </>
  );
}
