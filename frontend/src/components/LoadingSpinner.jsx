const SIZE_STYLES = {
  sm: { width: '16px', height: '16px', borderWidth: '2px' },
  md: { width: '32px', height: '32px', borderWidth: '2px' },
  lg: { width: '48px', height: '48px', borderWidth: '3px' },
  xl: { width: '64px', height: '64px', borderWidth: '4px' },
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        width: s.width,
        height: s.height,
        borderRadius: '50%',
        border: `${s.borderWidth} solid rgba(139, 92, 246, 0.2)`,
        borderTopColor: '#8b5cf6',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
};

export default LoadingSpinner;
