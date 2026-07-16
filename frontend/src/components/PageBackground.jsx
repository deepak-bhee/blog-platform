import LightRays from './LightRays';

/**
 * PageBackground — WebGL LightRays background.
 *
 * Stack (bottom → top):
 *   1. Solid base: #080b12
 *   2. LightRays — indigo god-ray beam from top-center (brand colour)
 *   3. Dot grid  — subtle structural texture
 */
const PageBackground = () => (
  <>
    {/* ── Layer 1: base + LightRays ── */}
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: '#000000',
      }}
    >
      <LightRays
        raysOrigin="top-center"
        raysColor="#6366f1"
        raysSpeed={0.6}
        lightSpread={0.72}
        rayLength={1.8}
        pulsating={false}
        fadeDistance={1.4}
        saturation={0.92}
        followMouse={true}
        mouseInfluence={0.08}
        noiseAmount={0.04}
        distortion={0.03}
      />
    </div>

    {/* ── Layer 2: fine dot grid ── */}
    <div className="page-grid" aria-hidden="true" />
  </>
);

export default PageBackground;
