import { FileText } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FileText,
  title = 'Nothing here yet',
  description = '',
  action = null,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 0 30px rgba(139,92,246,0.1)',
        }}
      >
        <Icon style={{ width: '36px', height: '36px', color: '#8b5cf6' }} />
      </div>
      <h3
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#e2e8f0',
          marginBottom: '10px',
          fontFamily: 'Playfair Display, serif',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            color: '#475569',
            maxWidth: '360px',
            fontSize: '14px',
            lineHeight: 1.7,
            marginBottom: '32px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
