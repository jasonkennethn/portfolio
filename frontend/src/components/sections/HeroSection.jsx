import { usePortfolio } from '../../context/PortfolioContext';

export default function HeroSection({ profileOverride }) {
  const { profile: contextProfile } = usePortfolio();
  const profile = profileOverride || contextProfile;

  if (!profile) return null;

  const hasPic = !!(profile.show_profile_picture && profile.profile_picture && (typeof profile.profile_picture !== 'string' || profile.profile_picture.trim() !== ''));

  return (
    <section className="section" style={{ paddingTop: '6%', paddingBottom: '4%' }} id="hero-section">
      <div className="container">
        <div className={`hero-grid ${hasPic ? 'with-pic' : 'no-pic'}`} style={{
          display: hasPic ? 'grid' : 'flex',
          flexDirection: hasPic ? undefined : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: hasPic ? 'left' : 'center',
          gap: hasPic ? '3%' : '3%',
        }}>
          <div className="hero-text-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3%',
            alignItems: hasPic ? 'flex-start' : 'center',
            textAlign: hasPic ? 'left' : 'center',
            maxWidth: '90%',
            margin: '0 auto',
            width: '100%',
          }}>
            {/* Headline */}
            <h1 className="text-display hero-title" style={{ color: 'var(--on-surface)', fontWeight: 800 }}>
              {profile.name || 'Your Name'}
            </h1>

            {/* Technical Sub-headline */}
            <h3 className="text-headline-md hero-subtitle" style={{ color: 'var(--primary)', marginTop: '-0.5%', fontWeight: 600 }}>
              {profile.title || 'Your Title'}
            </h3>

            {/* Subtitle */}
            <p className="text-body-lg text-muted hero-desc" style={{ maxWidth: '90%', margin: hasPic ? '0' : '0 auto' }}>
              {profile.subtitle || 'Your professional bio goes here.'}
            </p>

            {/* CTA Buttons */}
            <div className="hero-btn-container" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2%',
              paddingTop: '2%',
              justifyContent: hasPic ? 'flex-start' : 'center',
              width: '100%',
            }}>
              <a href="#projects-section" className="btn btn-primary btn-lg" id="hero-view-projects">
                View Projects
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-secondary btn-lg" id="hero-contact">
                Get In Touch
              </a>
            </div>

            {/* Social Links - Improved Glass Circular Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '12px',
              justifyContent: hasPic ? 'flex-start' : 'center',
              width: '100%',
            }}>
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hero-social-btn github" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hero-social-btn linkedin" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/></svg>
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="hero-social-btn mail" aria-label="Email">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile Picture */}
          {hasPic && (
            <div className="glass-card hero-pic-container" style={{ padding: '2%', borderRadius: 'var(--radius-3xl)', width: '100%', maxWidth: '40%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <img
                src={profile.profile_picture}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-2xl)' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hero Responsive Styles */}
      <style>{`
        .hero-grid.with-pic {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr !important;
          gap: 3% !important;
          align-items: center;
        }
        .hero-social-btn {
          width: clamp(36px, 5vw, 48px);
          height: clamp(36px, 5vw, 48px);
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--outline-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--on-surface-variant);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-apple);
          cursor: pointer;
        }
        .hero-social-btn.github:hover {
          border-color: #24292e !important;
          background: rgba(36, 41, 46, 0.08) !important;
          color: #24292e !important;
          box-shadow: 0 0 15px rgba(36, 41, 46, 0.25) !important;
          transform: translateY(-4px) scale(1.1) !important;
        }
        .hero-social-btn.linkedin:hover {
          border-color: #0a66c2 !important;
          background: rgba(10, 102, 194, 0.08) !important;
          color: #0a66c2 !important;
          box-shadow: 0 0 15px rgba(10, 102, 194, 0.25) !important;
          transform: translateY(-4px) scale(1.1) !important;
        }
        .hero-social-btn.mail:hover {
          border-color: #ea4335 !important;
          background: rgba(234, 67, 53, 0.08) !important;
          color: #ea4335 !important;
          box-shadow: 0 0 15px rgba(234, 67, 53, 0.25) !important;
          transform: translateY(-4px) scale(1.1) !important;
        }
        .hero-social-btn svg {
          width: clamp(16px, 2vw, 20px);
          height: clamp(16px, 2vw, 20px);
        }
        @media (max-width: 768px) {
          .hero-grid.with-pic {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 1.5rem !important;
          }
          .hero-title {
            font-size: clamp(24px, 7vw, 36px) !important;
          }
          .hero-subtitle {
            font-size: clamp(15px, 4.5vw, 18px) !important;
          }
          .hero-desc {
            font-size: clamp(13px, 3vw, 15px) !important;
            line-height: 1.5 !important;
            margin: 0 auto !important;
          }
          .hero-pic-container {
            max-width: clamp(160px, 40vw, 220px) !important;
            border-radius: var(--radius-2xl) !important;
            margin: 0 auto !important;
            order: -1;
          }
          .hero-pic-container img {
            border-radius: var(--radius-xl) !important;
          }
          .hero-text-container {
            gap: 12px !important;
            align-items: center !important;
            text-align: center !important;
            margin: 0 auto !important;
          }
          .hero-btn-container {
            gap: 12px !important;
            padding-top: 12px !important;
            justify-content: center !important;
          }
          .hero-btn-container .btn {
            padding: 0.5rem 1rem !important;
            font-size: clamp(12px, 3vw, 14px) !important;
            border-radius: var(--radius-md) !important;
          }
        }
      `}</style>
    </section>
  );
}
