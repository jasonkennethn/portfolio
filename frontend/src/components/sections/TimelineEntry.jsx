export default function TimelineEntry({ experience }) {
  return (
    <div className="glass-card" style={{ padding: '5%', width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      <TimelineCardContent experience={experience} />
    </div>
  );
}

function TimelineCardContent({ experience }) {
  return (
    <>
      <div className="experience-card-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{ minWidth: 0, flex: '1 1 250px' }}>
          <h3 className="text-headline-md" style={{ color: 'var(--on-surface)', fontSize: 'clamp(16px, 1.8vw, 20px)', fontWeight: 700 }}>
            {experience.role}
          </h3>
          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'clamp(13px, 1.3vw, 15px)', marginTop: '4px' }}>
            {experience.company}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '4px' }}>
          <span className="text-body-sm text-muted" style={{ fontWeight: 500, fontFamily: 'var(--font-code)', fontSize: 'clamp(11px, 1.1vw, 13px)' }}>
            {experience.start_date} — {experience.end_date}
          </span>
        </div>
      </div>

      <p className="text-body-sm text-muted" style={{ marginBottom: '16px', fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.6 }}>
        {experience.description}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(experience.highlights || []).slice(0, 4).map((h, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              marginTop: '8px', 
              flexShrink: 0 
            }} />
            <span className="text-body-sm" style={{ color: 'var(--on-surface)', fontSize: 'clamp(12.5px, 1.15vw, 14.5px)', lineHeight: 1.5 }}>{h}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--outline-variant)', paddingTop: '12px', opacity: 0.9 }}>
        {(experience.technologies || []).map(t => (
          <span key={t} className="tech-chip-outline">{t}</span>
        ))}
      </div>
    </>
  );
}
