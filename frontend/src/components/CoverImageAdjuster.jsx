import { useRef, useState, useCallback, useEffect } from 'react';
import { X, Move } from 'lucide-react';

/**
 * CoverImageAdjuster
 *
 * Shows a live preview of the cover image with a drag-to-reposition interface.
 * The user can pan the image inside the fixed container to set the focal point.
 *
 * Props:
 *   url          {string}   - The image URL to preview
 *   position     {string}   - Current objectPosition, e.g. "50% 30%"
 *   onPosition   {function} - Called with new position string on drag
 *   onRemove     {function} - Called when user clicks Remove
 *   height       {number}   - Preview height in px (default 160)
 */
export default function CoverImageAdjuster({
  url,
  position = '50% 50%',
  onPosition,
  onRemove,
  height = 160,
}) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset error when URL changes
  useEffect(() => { setImgError(false); }, [url]);

  // Parse current position % values
  const parsePos = (pos) => {
    const parts = (pos || '50% 50%').split(' ');
    return {
      x: parseFloat(parts[0]) || 50,
      y: parseFloat(parts[1]) || 50,
    };
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const { width, height: h } = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    const cur = parsePos(position);
    // Moving right means we want to see more of the right side → increase x
    // But dragging the image left reveals more right content → decrease x
    const newX = clamp(cur.x - (dx / width) * 100, 0, 100);
    const newY = clamp(cur.y - (dy / h) * 100, 0, 100);
    onPosition?.(`${newX.toFixed(1)}% ${newY.toFixed(1)}%`);
  }, [position, onPosition]);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  // Touch support
  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    isDragging.current = true;
    lastPos.current = { x: t.clientX, y: t.clientY };
    setDragging(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const { width, height: h } = containerRef.current.getBoundingClientRect();
    const dx = t.clientX - lastPos.current.x;
    const dy = t.clientY - lastPos.current.y;
    lastPos.current = { x: t.clientX, y: t.clientY };

    const cur = parsePos(position);
    const newX = clamp(cur.x - (dx / width) * 100, 0, 100);
    const newY = clamp(cur.y - (dy / h) * 100, 0, 100);
    onPosition?.(`${newX.toFixed(1)}% ${newY.toFixed(1)}%`);
  }, [position, onPosition]);

  if (imgError) {
    return (
      <div
        style={{
          marginTop: '12px',
          height: `${height}px`,
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px dashed rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#f87171',
          fontFamily: 'Inter, sans-serif',
          gap: '6px',
        }}
      >
        <span>⚠</span> Could not load image — check the URL
        <button
          type="button"
          onClick={onRemove}
          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', marginLeft: '4px', fontSize: '12px', textDecoration: 'underline' }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Drag area */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
        style={{
          position: 'relative',
          height: `${height}px`,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <img
          src={url}
          alt="Cover preview"
          draggable={false}
          onError={() => setImgError(true)}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: position,
            pointerEvents: 'none',
            transition: dragging ? 'none' : 'object-position 0.1s ease',
          }}
        />

        {/* Drag hint overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: dragging
              ? 'rgba(99,102,241,0.08)'
              : 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
            transition: 'background 0.2s',
          }}
        />

        {/* Centre crosshair */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)',
            border: '2px solid rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: dragging ? 1 : 0.7,
            transition: 'opacity 0.2s',
          }}
        >
          <Move style={{ width: '16px', height: '16px', color: '#fff' }} />
        </div>

        {/* Drag hint label */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: dragging ? 0 : 0.9,
            transition: 'opacity 0.2s',
          }}
        >
          Drag to adjust position
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 1,
          }}
          title="Remove cover image"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
        >
          <X style={{ width: '12px', height: '12px' }} />
        </button>
      </div>

      {/* Position readout */}
      <div
        style={{
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
          Position: {position}
        </span>
        <button
          type="button"
          onClick={() => onPosition?.('50% 50%')}
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            textDecoration: 'underline',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
