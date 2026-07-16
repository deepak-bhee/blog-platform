import { CATEGORIES } from '../constants/categories';

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }} role="group" aria-label="Filter by category">
      {CATEGORIES.map(cat => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
            style={{
              padding: '5px 15px',
              borderRadius: '999px',
              fontSize: '13px', fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              background: isActive ? 'rgba(99,102,241,0.15)' : 'var(--bg-surface)',
              color: isActive ? '#a5b4fc' : 'var(--text-muted)',
              border: isActive ? '1px solid rgba(99,102,241,0.35)' : '1px solid var(--border)',
              boxShadow: isActive ? '0 0 10px rgba(99,102,241,0.18)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
