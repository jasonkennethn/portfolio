import { usePortfolio } from '../../context/PortfolioContext';

export default function CertificationsSection() {
  const { certifications } = usePortfolio();

  return (
    <section className="section" id="certifications-section" style={{ background: 'var(--surface-container-low)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)' }}>
            Professional <span className="text-primary">Certifications</span>
          </h2>
        </div>
        <div className="grid grid-3">
          {certifications.map((cert, i) => (
            <div key={cert.id || i} className="solid-card" style={{
              padding: 'var(--stack-lg)', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: 'var(--radius-full)',
                background: 'rgba(73, 75, 214, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '32px', color: 'var(--primary)' }}>
                  workspace_premium
                </span>
              </div>
              <h4 className="text-headline-md" style={{ fontSize: '17px', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                {cert.name}
              </h4>
              <p className="text-muted" style={{ fontSize: '14px' }}>{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
