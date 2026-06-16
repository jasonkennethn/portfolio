export default function TimelineEntry({ experience }) {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      <TimelineCardContent experience={experience} />
    </div>
  );
}

function TimelineCardContent({ experience }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 className="text-headline-md" style={{ color: 'var(--on-surface)', fontSize: '22px', fontWeight: 700 }}>{experience.role}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '15px', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>{experience.company}</span>
            {experience.department && <span className="text-muted" style={{ fontWeight: 400 }}>• {experience.department}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="text-body-sm text-muted" style={{ fontWeight: 500, fontFamily: 'var(--font-code)' }}>
            {experience.start_date} — {experience.end_date}
          </span>
          {experience.is_current && (
            <span className="text-code" style={{
              background: 'rgba(73,75,214,0.1)', color: 'var(--primary)',
              padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
              fontSize: '11px', border: '1px solid rgba(73,75,214,0.2)',
              fontWeight: 700,
            }}>Present</span>
          )}
        </div>
      </div>

      <p className="text-body-sm text-muted" style={{ marginBottom: '1.25rem', fontSize: '15px', lineHeight: 1.6 }}>{experience.description}</p>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(experience.highlights || []).slice(0, 4).map((h, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              marginTop: '8px', 
              flexShrink: 0 
            }} />
            <span className="text-body-sm" style={{ color: 'var(--on-surface)', fontSize: '14.5px', lineHeight: 1.5 }}>{h}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.25rem', opacity: 0.9 }}>
        {(experience.technologies || []).map(t => (
          <span key={t} className="tech-chip-outline" style={{ fontSize: '11.5px', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)' }}>{t}</span>
        ))}
      </div>
    </>
  );
}
