import { useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search posts…' }) {
  const ref = useRef(null);
  return (
    <div style={{ position: 'relative' }}>
      <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: value ? '#6366f1' : 'var(--text-muted)', pointerEvents: 'none', transition: 'color 0.2s' }} />
      <input
        ref={ref}
        id="search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search blog posts"
        className="input-field"
        style={{ paddingLeft: '42px', paddingRight: value ? '40px' : '16px' }}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <X style={{ width: '13px', height: '13px' }} />
        </button>
      )}
    </div>
  );
}
