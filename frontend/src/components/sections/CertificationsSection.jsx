import { usePortfolio } from '../../context/PortfolioContext';

export default function CertificationsSection({ sectionOverride }) {
  const { certifications } = usePortfolio();

  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="section" id="certifications-section" style={{ background: 'var(--surface-container-low)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--primary)' }}>
            {sectionOverride?.label || 'Professional Certifications'}
          </h2>
        </div>
        <div className="grid grid-3">
          {certifications.map((cert, i) => (
            <div key={cert.id || i} className="solid-card" style={{
              padding: '5%', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: 'clamp(48px, 6vw, 64px)', height: 'clamp(48px, 6vw, 64px)', borderRadius: 'var(--radius-full)',
                background: 'rgba(73, 75, 214, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '4%',
              }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: 'clamp(24px, 3vw, 32px)', color: 'var(--primary)' }}>
                  workspace_premium
                </span>
              </div>
              <h4 className="text-headline-md" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'var(--on-surface)', marginBottom: '2%' }}>
                {cert.name}
              </h4>
              <p className="text-muted" style={{ fontSize: 'clamp(12px, 1.1vw, 14px)' }}>{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
