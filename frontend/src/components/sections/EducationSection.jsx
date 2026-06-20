import { usePortfolio } from '../../context/PortfolioContext';

export default function EducationSection() {
  const { education } = usePortfolio();

  if (!education || education.length === 0) return null;

  return (
    <section className="section" id="education-section">
      <div className="container">
        <div className="section-header">
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)' }}>
            <span className="text-primary">Education</span>
          </h2>
        </div>
        <div className="grid grid-2">
          {education.map((edu, i) => (
            <div key={edu.id || i} className="glass-card" style={{ padding: '5%', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3%', marginBottom: '3%' }}>
                <div style={{
                  width: 'clamp(36px, 5vw, 48px)', height: 'clamp(36px, 5vw, 48px)', borderRadius: 'var(--radius-lg)',
                  background: 'rgba(73, 75, 214, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 'clamp(18px, 2vw, 24px)' }}>school</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}>{edu.degree}</h3>
                  <p className="text-primary" style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 500 }}>{edu.field}</p>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', marginBottom: '2%' }}>{edu.institution}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2%' }}>
                <span className="text-code" style={{ color: 'var(--outline)', fontSize: 'clamp(11px, 1vw, 13px)' }}>
                  {edu.start_year} — {edu.end_year}
                </span>
                <span className="tech-chip" style={{ fontSize: 'clamp(11px, 1vw, 13px)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {edu.grade_type}: {edu.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
