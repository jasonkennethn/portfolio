import { usePortfolio } from '../../context/PortfolioContext';

export default function EducationSection() {
  const { education } = usePortfolio();

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
            <div key={edu.id || i} className="glass-card" style={{ padding: 'var(--stack-lg)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                  background: 'rgba(73, 75, 214, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>school</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}>{edu.degree}</h3>
                  <p className="text-primary" style={{ fontSize: '14px', fontWeight: 500 }}>{edu.field}</p>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '15px', marginBottom: '0.5rem' }}>{edu.institution}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-code" style={{ color: 'var(--outline)', fontSize: '13px' }}>
                  {edu.start_year} — {edu.end_year}
                </span>
                <span className="tech-chip" style={{ fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
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
