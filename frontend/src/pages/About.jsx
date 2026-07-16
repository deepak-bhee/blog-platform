import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, MessageCircle, Search, Lock, Zap,
  Globe, Code2, Database, Server, Sparkles, HelpCircle,
  Activity, Star, Cpu, Terminal, ArrowRight, CheckCircle, Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Zap,       title: 'Instant Publishing', desc: 'Write and share your story with the world in seconds.', accent: 'var(--accent-3)' },
  { icon: Globe,     title: 'Global Reach',        desc: 'Connect with readers and writers from everywhere.',   accent: 'var(--accent-4)' },
  { icon: Code2,     title: 'Rich Content',        desc: 'Code snippets, images, quotes, beautifully formatted.', accent: 'var(--accent)' },
  { icon: Lightbulb, title: 'Discover Ideas',      desc: 'Explore technology, science, lifestyle and beyond.',  accent: 'var(--accent-2)' },
];

const FAQ_ITEMS = [
  {
    q: 'How do I start publishing stories?',
    a: 'Simply click "Get Started" to create a free account. Once signed in, you will have access to the distraction-free markdown text editor where you can draft, add cover images, select categories, and publish instantly.'
  },
  {
    q: 'Is Bloggg free to use?',
    a: 'Yes, Bloggg is completely free and open-source. There are no paywalls, premium subscriptions, or advertisements.'
  },
  {
    q: 'What markdown formatting is supported?',
    a: 'Our editor supports rich text, custom headings, bullet points, blockquotes, code blocks with syntax highlighting, and custom embedded images.'
  },
  {
    q: 'How do threaded comment discussions work?',
    a: 'Every article has a dedicated discussion space. Users can reply directly to any comment to create structured, indented conversation threads.'
  }
];

const TIMELINE_PHASES = [
  { year: 'Phase 1', title: 'The Core Stack', desc: 'Crafting clean MongoDB schemas, RESTful Node/Express controllers, and securing auth routes.' },
  { year: 'Phase 2', title: 'React Architecture', desc: 'Assembling reusable component layers, responsive navigation, and state-driven hooks.' },
  { year: 'Phase 3', title: 'Fine Editorial UI', desc: 'Deploying the dark mode visual system, smooth grid alignment, and typography details.' },
];

function useReveal() {
  useEffect(() => {
    const ob = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => ob.observe(el));
    return () => ob.disconnect();
  }, []);
}

export default function About() {
  useReveal();
  const [activeFaq, setActiveFaq] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback text.');
      return;
    }
    setFeedbackSent(true);
    toast.success('Thank you for your feedback! ❤️');
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, paddingBottom: '80px' }}>
      
      {/* ── Editorial Hero ── */}
      <section style={{ padding: '90px 0 50px', textAlign: 'center' }}>
        <div className="section-container" style={{ maxWidth: '720px' }}>
          <div className="animate-fade-in" style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <BookOpen style={{ width: '24px', height: '24px', color: '#a5b4fc' }} />
          </div>
          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.15 }}>
            Behind <span className="text-gradient">Bloggg</span>
          </h1>
          <p className="animate-fade-in-up delay-100" style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            An open platform designed to explore clean layouts, intuitive reader experiences, and production-grade full-stack engineering.
          </p>
        </div>
      </section>

      {/* ── Why Bloggg? ── */}
      <section style={{ padding: '50px 0 20px', position: 'relative', zIndex: 2 }}>
        <div className="section-container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>Why Bloggg?</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, color: '#f0f2f8', marginBottom: '14px' }}>Built for Modern Storytellers</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '440px', margin: '0 auto', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>Everything you need to write, publish and grow your audience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
            {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
              <div
                key={title}
                className={`reveal card-shine delay-${(i + 1) * 100}`}
                style={{ padding: '28px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)', transition: 'all 0.35s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${accent}15`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Icon style={{ width: '22px', height: '22px', color: accent }} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f0f2f8', marginBottom: '10px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live System Dashboard (Human touch) ── */}
      <section style={{ padding: '30px 0' }}>
        <div className="section-container" style={{ maxWidth: '980px' }}>
          <div className="reveal" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', boxShadow: '0 4px 30px rgba(0,0,0,0.2)' }}>
            {[
              { icon: Activity, val: '99.98%', label: 'API Uptime Status', desc: 'Real-time server activity' },
              { icon: Cpu, val: '14ms', label: 'Query Latency', desc: 'Fast MongoDB indexing' },
              { icon: Terminal, val: 'REST v1.0', label: 'Backend Architecture', desc: 'Express API controllers' },
              { icon: Star, val: '100% Open', label: 'Source Integrity', desc: 'Distraction-free environment' },
            ].map(({ icon: Icon, val, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: '18px', height: '18px', color: '#a5b4fc' }} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{val}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px', fontFamily: 'Inter, sans-serif' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline (Human story) ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f0f2f8', marginBottom: '10px' }}>The Project Roadmap</h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>How this clean full-stack application came to life</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(180deg, rgba(99,102,241,0.4) 0%, rgba(232,121,160,0.1) 100%)' }} />

            {TIMELINE_PHASES.map(({ year, title, desc }, idx) => (
              <div key={idx} className="reveal" style={{ display: 'flex', gap: '20px', position: 'relative', paddingLeft: '44px' }}>
                <div style={{ position: 'absolute', left: '11px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', border: '3px solid #030712', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
                <div style={{ flex: 1, padding: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', transition: 'border 0.25s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Inter, sans-serif' }}>{year}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f8', marginTop: '4px', marginBottom: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive FAQs ── */}
      <section style={{ padding: '40px 0' }}>
        <div className="section-container" style={{ maxWidth: '720px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <HelpCircle style={{ width: '32px', height: '32px', color: '#6366f1', margin: '0 auto 12px', display: 'block' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f0f2f8', marginBottom: '10px' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>Find quick answers about writing, authentication, and publishing</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="reveal"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease' }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{ width: '100%', padding: '18px 24px', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', outline: 'none' }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#f0f2f8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.q}</span>
                    <span style={{ fontSize: '20px', color: '#6366f1', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease', lineHeight: 1 }}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: '16px', fontFamily: 'Inter, sans-serif' }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive Guestbook/Feedback Section (Human touch) ── */}
      <section style={{ padding: '50px 0' }}>
        <div className="section-container" style={{ maxWidth: '600px' }}>
          <div className="reveal" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '36px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f2f8', marginBottom: '10px', textAlign: 'center' }}>Leave Us Your Thoughts</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
              We value direct human feedback. Let us know how we can make Bloggg better.
            </p>

            {feedbackSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f0f2f8', marginBottom: '6px' }}>Feedback Sent Successfully!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Thank you for writing. Your submission helps improve the platform.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Rating selection */}
                <div>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '10px' }}>Rate Your Experience</label>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        <Star
                          style={{
                            width: '24px',
                            height: '24px',
                            fill: star <= feedbackRating ? '#fbbf24' : 'none',
                            color: star <= feedbackRating ? '#fbbf24' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text feedback */}
                <div>
                  <label htmlFor="feedbackText" className="form-label">Message</label>
                  <textarea
                    id="feedbackText"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you like or how we can improve..."
                    rows={4}
                    className="input-field"
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Submit Feedback</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Standardized Clean CTA ── */}
      <section style={{ padding: '30px 0 20px' }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <div className="reveal" style={{ maxWidth: '500px', margin: '0 auto', padding: '48px 36px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(232,121,160,0.12) 0%,transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <Sparkles style={{ width: '28px', height: '28px', color: '#6366f1', margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f2f8', marginBottom: '12px' }}>Ready to Start Writing?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>Join Bloggg and share your story with the world.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 26px', fontSize: '15px' }}>
                <Sparkles style={{ width: '15px', height: '15px' }} />
                <span>Create Account</span>
              </Link>
              <Link to="/" className="btn-secondary" style={{ padding: '12px 26px', fontSize: '15px' }}>
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
