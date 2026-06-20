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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3%', marginBottom: '3%' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 className="text-headline-md" style={{ color: 'var(--on-surface)', fontSize: 'clamp(17px, 2vw, 22px)', fontWeight: 700 }}>{experience.role}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'clamp(13px, 1.3vw, 15px)', marginTop: '0.5%', display: 'flex', alignItems: 'center', gap: '2%', flexWrap: 'wrap' }}>
            <span>{experience.company}</span>
            {experience.department && <span className="text-muted" style={{ fontWeight: 400 }}>• {experience.department}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2%', flexShrink: 0 }}>
          <span className="text-body-sm text-muted" style={{ fontWeight: 500, fontFamily: 'var(--font-code)', fontSize: 'clamp(11px, 1.1vw, 14px)' }}>
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

      <p className="text-body-sm text-muted" style={{ marginBottom: '3%', fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.6 }}>{experience.description}</p>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '4%', display: 'flex', flexDirection: 'column', gap: '2%' }}>
        {(experience.highlights || []).slice(0, 4).map((h, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '2%' }}>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2%', borderTop: '1px solid var(--outline-variant)', paddingTop: '3%', opacity: 0.9 }}>
        {(experience.technologies || []).map(t => (
          <span key={t} className="tech-chip-outline" style={{ fontSize: 'clamp(10px, 1vw, 11.5px)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)' }}>{t}</span>
        ))}
      </div>
    </>
  );
}
