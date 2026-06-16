import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function ContactFormBlock({ block, glassmorphism }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // '', 'sending', 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus(''), 4000);
    }, 1000);
  };

  return (
    <div
      className={glassmorphism ? 'glass-card-static' : 'solid-card'}
      style={{
        padding: '2.5rem',
        gridColumn: '1 / -1',
        maxWidth: '550px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <h3 className="text-headline-md" style={{ color: 'var(--on-surface)', fontSize: '20px', fontWeight: 700, margin: 0, textAlign: 'center' }}>
        {block.title || 'Get In Touch'}
      </h3>
      
      {status === 'success' && (
        <div style={{
          background: 'rgba(0, 109, 75, 0.08)',
          border: '1px solid rgba(0, 109, 75, 0.2)',
          color: '#006d4b',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '13.5px',
          textAlign: 'center',
          fontWeight: 600,
        }}>
          Message sent successfully! Thank you.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
              background: 'var(--surface-container-low)',
              fontSize: '13.5px',
              outline: 'none',
              color: 'var(--on-surface)',
            }}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
              background: 'var(--surface-container-low)',
              fontSize: '13.5px',
              outline: 'none',
              color: 'var(--on-surface)',
            }}
            placeholder={block.emailPlaceholder || 'your.email@example.com'}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Message</label>
          <textarea
            required
            rows="4"
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
              background: 'var(--surface-container-low)',
              fontSize: '13.5px',
              outline: 'none',
              color: 'var(--on-surface)',
              resize: 'vertical',
            }}
            placeholder={block.messagePlaceholder || "Let's build something together..."}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'sending'}
          style={{ width: '100%', justifyContent: 'center', padding: '0.7rem 1.25rem', fontSize: '14px', fontWeight: 600 }}
        >
          {status === 'sending' ? 'Sending Message...' : (block.buttonText || 'Send Message')}
        </button>
      </form>
    </div>
  );
}

export default function CustomSection({ sectionOverride }) {
  const { glassmorphism } = useTheme();
  const section = sectionOverride;

  if (!section) return null;

  const blocks = section.content || [];

  return (
    <section className="section" id={`${section.key}-section`}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
            {section.label}
          </h2>
          {section.description && (
            <p className="text-body-lg text-muted" style={{ maxWidth: '600px' }}>
              {section.description}
            </p>
          )}
        </div>

        {/* Content Blocks Grid */}
        <div className="grid grid-3" style={{ gap: '2rem' }}>
          {blocks.map((block, idx) => {
            if (block.type === 'paragraph') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    padding: '2rem',
                    gridColumn: '1 / -1', // span full width
                  }}
                >
                  <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '15.5px' }}>
                    {block.text}
                  </p>
                </div>
              );
            }

            if (block.type === 'card') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card' : 'solid-card'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {block.imageUrl && (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: 'var(--surface-container)' }}>
                      <img
                        src={block.imageUrl}
                        alt={block.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 className="text-headline-md" style={{ fontSize: '18px', color: 'var(--on-surface)' }}>{block.title}</h4>
                    <p className="text-body-sm text-muted" style={{ flex: 1, fontSize: '14px', lineHeight: 1.5 }}>{block.text}</p>
                    {block.linkUrl && (
                      <a
                        href={block.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: 'var(--primary)',
                          marginTop: '0.5rem',
                        }}
                      >
                        Learn More
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === 'card_no_media') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card' : 'solid-card'}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 className="text-headline-md" style={{ fontSize: '18px', color: 'var(--on-surface)' }}>{block.title}</h4>
                    <p className="text-body-sm text-muted" style={{ fontSize: '14px', lineHeight: 1.5 }}>{block.text}</p>
                  </div>
                  {block.linkUrl && (
                    <a
                      href={block.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--primary)',
                        marginTop: '0.5rem',
                      }}
                    >
                      Learn More
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                    </a>
                  )}
                </div>
              );
            }

            if (block.type === 'media') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    overflow: 'hidden',
                    gridColumn: 'span 2',
                    height: '350px',
                  }}
                >
                  <img
                    src={block.imageUrl}
                    alt="Uploaded media content"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              );
            }

            if (block.type === 'grid_card') {
              const span = parseInt(block.gridSpan || '1');
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card' : 'solid-card'}
                  style={{
                    padding: '1.75rem',
                    gridColumn: `span ${span}`,
                    background: 'var(--surface-container-low)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <h4 className="text-headline-md" style={{ fontSize: '19px', color: 'var(--on-surface)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>widgets</span>
                    {block.title}
                  </h4>
                  <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: 1.6 }}>{block.text}</p>
                </div>
              );
            }

            if (block.type === 'timeline_card') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    padding: '1.5rem',
                    gridColumn: '1 / -1',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <div style={{ minWidth: '120px', fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', paddingTop: '2px' }}>
                    {block.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>{block.title}</h4>
                    {block.subtitle && <p style={{ fontSize: '14px', color: 'var(--outline)', margin: '0.15rem 0 0.5rem 0', fontWeight: 500 }}>{block.subtitle}</p>}
                    <p className="text-muted" style={{ fontSize: '14px', marginTop: '0.5rem', lineHeight: 1.5 }}>{block.text}</p>
                  </div>
                </div>
              );
            }

            if (block.type === 'quote_card') {
              return (
                <div
                  key={block.id || idx}
                  className="glass-card-static"
                  style={{
                    padding: '2.5rem',
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    border: '1px solid var(--outline-variant)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', opacity: 0.15, position: 'absolute', top: '10px', left: '20px' }}>format_quote</span>
                  <p className="text-headline-md" style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 500, color: 'var(--on-surface)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    "{block.text}"
                  </p>
                  {block.author && <p className="text-label-caps" style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>— {block.author}</p>}
                </div>
              );
            }

            if (block.type === 'code_block') {
              return (
                <div
                  key={block.id || idx}
                  style={{
                    gridColumn: '1 / -1',
                    width: '100%',
                  }}
                >
                  <div style={{
                    background: 'var(--surface-container-highest)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    border: '1px solid var(--outline-variant)',
                    borderBottom: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span className="text-code" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>
                      {block.language || 'code'}
                    </span>
                  </div>
                  <pre className="code-block" style={{ margin: 0, borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', maxHeight: '300px', overflowY: 'auto' }}>
                    <code>{block.code}</code>
                  </pre>
                </div>
              );
            }

            if (block.type === 'contact_form') {
              return (
                <ContactFormBlock
                  key={block.id || idx}
                  block={block}
                  glassmorphism={glassmorphism}
                />
              );
            }

            if (block.type === 'skill_progress') {
              const val = parseInt(block.percentageValue || '0');
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, color: 'var(--on-surface)' }}>
                    <span style={{ fontSize: '14.5px' }}>{block.skillName}</span>
                    <span style={{ fontSize: '13.5px', color: 'var(--primary)', fontFamily: 'var(--font-code)' }}>{val}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--surface-container-highest)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: 'var(--primary)', borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            }

            if (block.type === 'skill_badge_cloud') {
              const badges = (block.badgeList || '').split(',').map(s => s.trim()).filter(Boolean);
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    padding: '2rem',
                    gridColumn: '1 / -1',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                    {badges.map((b, i) => (
                      <span
                        key={i}
                        className="tech-chip-outline"
                        style={{
                          fontSize: '13px',
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-lg)',
                          background: 'var(--surface-container-low)',
                          border: '1px solid var(--outline-variant)',
                          color: 'var(--on-surface-variant)',
                          transition: 'all 0.2s',
                          cursor: 'default',
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            if (block.type === 'social_grid') {
              return (
                <div
                  key={block.id || idx}
                  style={{
                    gridColumn: '1 / -1',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    width: '100%',
                  }}
                >
                  {block.github && (
                    <a href={block.github} target="_blank" rel="noopener noreferrer" className={glassmorphism ? 'glass-card' : 'solid-card'} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--on-surface)' }}>code</span>
                      <div>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: 'var(--on-surface)' }}>GitHub</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--outline)' }}>View source code</span>
                      </div>
                    </a>
                  )}
                  {block.linkedin && (
                    <a href={block.linkedin} target="_blank" rel="noopener noreferrer" className={glassmorphism ? 'glass-card' : 'solid-card'} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#0a66c2' }}>account_circle</span>
                      <div>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: 'var(--on-surface)' }}>LinkedIn</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--outline)' }}>Connect professionally</span>
                      </div>
                    </a>
                  )}
                  {block.twitter && (
                    <a href={block.twitter} target="_blank" rel="noopener noreferrer" className={glassmorphism ? 'glass-card' : 'solid-card'} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>share</span>
                      <div>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: 'var(--on-surface)' }}>Twitter</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--outline)' }}>Follow updates</span>
                      </div>
                    </a>
                  )}
                  {block.email && (
                    <a href={`mailto:${block.email}`} className={glassmorphism ? 'glass-card' : 'solid-card'} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#ea4335' }}>mail</span>
                      <div>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '14px', color: 'var(--on-surface)' }}>Email</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--outline)' }}>Send an inquiry</span>
                      </div>
                    </a>
                  )}
                </div>
              );
            }

            if (block.type === 'faq_accordion') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0',
                    overflow: 'hidden',
                  }}
                >
                  <details style={{ width: '100%' }}>
                    <summary style={{
                      padding: '1.25rem 1.5rem',
                      fontWeight: 650,
                      color: 'var(--on-surface)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '15.5px',
                    }}>
                      {block.question}
                    </summary>
                    <div style={{
                      padding: '1.25rem 1.5rem',
                      borderTop: '1px solid var(--outline-variant)',
                      background: 'rgba(0,0,0,0.01)',
                      color: 'var(--on-surface-variant)',
                      fontSize: '14.5px',
                      lineHeight: 1.6,
                    }}>
                      {block.answer}
                    </div>
                  </details>
                </div>
              );
            }

            if (block.type === 'stat_counter') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    background: 'var(--surface-container-low)',
                  }}
                >
                  <span style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary, #494BD6))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-code)',
                  }}>
                    {block.metricValue}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--on-surface)' }}>
                    {block.metricLabel}
                  </span>
                  {block.description && (
                    <span style={{ fontSize: '12px', color: 'var(--outline)' }}>
                      {block.description}
                    </span>
                  )}
                </div>
              );
            }

            if (block.type === 'youtube_embed') {
              let videoId = block.videoUrlOrId || '';
              if (videoId.includes('v=')) {
                videoId = videoId.split('v=')[1].split('&')[0];
              } else if (videoId.includes('youtu.be/')) {
                videoId = videoId.split('youtu.be/')[1].split('?')[0];
              }
              return (
                <div
                  key={block.id || idx}
                  style={{
                    gridColumn: '1 / -1',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    aspectRatio: '16 / 9',
                    border: '1px solid var(--outline-variant)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>
              );
            }

            if (block.type === 'github_repo') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card' : 'solid-card'}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    border: '1px solid var(--outline-variant)',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)' }}>folder</span>
                      <a
                        href={block.repoName ? `https://github.com/${block.repoName}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 700, fontSize: '15.5px', color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        {block.repoName && block.repoName.includes('/') ? block.repoName.split('/')[1] : (block.repoName || 'Repo')}
                      </a>
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--on-surface-variant)', lineHeight: 1.4, margin: '0.25rem 0' }}>{block.repoDesc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '12px', color: 'var(--outline)', paddingTop: '0.5rem' }}>
                    {block.language && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
                        {block.language}
                      </span>
                    )}
                    {block.starsCount && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                        {block.starsCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === 'resume_embed') {
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: 'var(--surface-container-low)',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '17px', color: 'var(--on-surface)' }}>Professional Resume</h4>
                    <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '13.5px' }}>Access current certifications and credentials document</p>
                  </div>
                  <a
                    href={block.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span className="material-symbols-outlined">download</span>
                    {block.buttonText || 'Download Resume'}
                  </a>
                </div>
              );
            }

            if (block.type === 'pricing_card') {
              const features = (block.featuresList || '').split(',').map(f => f.trim()).filter(Boolean);
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card' : 'solid-card'}
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    border: '1px solid var(--outline-variant)',
                  }}
                >
                  <div style={{ textAlign: 'center', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--on-surface)' }}>{block.planName}</h4>
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{block.priceText}</span>
                      {block.billingCycle && <span style={{ fontSize: '12px', color: 'var(--outline)', marginLeft: '4px' }}>/ {block.billingCycle}</span>}
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {features.map((feat, fidx) => (
                      <li key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13.5px', color: 'var(--on-surface-variant)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>check</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a href={`mailto:${block.email || 'jasonkennethn@gmail.com'}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                    {block.buttonText || 'Hire Me'}
                  </a>
                </div>
              );
            }

            if (block.type === 'alert_banner') {
              const typeColors = {
                info: { bg: 'rgba(73, 75, 214, 0.08)', border: 'rgba(73, 75, 214, 0.2)', text: 'var(--primary)', icon: 'info' },
                warning: { bg: 'rgba(234, 88, 12, 0.08)', border: 'rgba(234, 88, 12, 0.2)', text: '#ea580c', icon: 'warning' },
                success: { bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.2)', text: '#059669', icon: 'check_circle' },
              };
              const c = typeColors[block.alertType || 'info'] || typeColors.info;
              return (
                <div
                  key={block.id || idx}
                  className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '1.25rem 1.5rem',
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: c.text, fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                  <p style={{ margin: 0, color: 'var(--on-surface)', fontSize: '14px', lineHeight: 1.5 }}>{block.text}</p>
                </div>
              );
            }

            if (block.type === 'tech_stack_grid') {
              const techs = (block.items || '').split(',').map(t => t.trim()).filter(Boolean);
              return (
                <div
                  key={block.id || idx}
                  style={{
                    gridColumn: '1 / -1',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.75rem',
                    width: '100%',
                  }}
                >
                  {techs.map((t, tidx) => (
                    <div
                      key={tidx}
                      className={glassmorphism ? 'glass-card-static' : 'solid-card'}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontWeight: 650,
                        fontSize: '13.5px',
                        background: 'var(--surface-container-low)',
                        color: 'var(--on-surface-variant)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}
