import { usePortfolio } from '../../context/PortfolioContext';
import servicenowCsa from '../../assets/servicenow_csa.png';
import servicenowCad from '../../assets/servicenow_cad.png';
import ibmDataEngineering from '../../assets/ibm_data_engineering.png';

const CERT_IMAGES = {
  'Certified System Administrator (CSA)': servicenowCsa,
  'Certified Application Developer (CAD)': servicenowCad,
  'IBM Data Engineering Professional Certificate': ibmDataEngineering,
};

const FallbackCertificateSvg = () => (
  <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" rx="16" fill="var(--surface-container-high)" />
    <rect x="20" y="20" width="360" height="260" rx="8" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
    <path d="M200 80C177.909 80 160 97.9086 160 120C160 137.892 171.792 153.018 188 158.051V200L200 190L212 200V158.051C228.208 153.018 240 137.892 240 120C240 97.9086 222.091 80 200 80ZM200 140C188.954 140 180 131.046 180 120C180 108.954 188.954 100 200 100C211.046 100 220 108.954 220 120C220 131.046 211.046 140 200 140Z" fill="var(--primary)" opacity="0.8" />
    <line x1="80" y1="230" x2="320" y2="230" stroke="var(--outline-variant)" strokeWidth="4" strokeLinecap="round" />
    <line x1="120" y1="250" x2="280" y2="250" stroke="var(--outline-variant)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export default function CertificationsSection({ sectionOverride }) {
  const { certifications } = usePortfolio();

  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="section" id="certifications-section" style={{ background: 'var(--surface-container-low)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--primary)' }}>
            {sectionOverride?.label || 'Professional Certifications'}
          </h2>
        </div>
        <div className="grid grid-3">
          {certifications.map((cert, i) => {
            const imgSrc = CERT_IMAGES[cert.name];
            return (
              <div key={cert.id || i} className="solid-card cert-card" style={{
                padding: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface-container-low)',
                border: '1px solid var(--outline-variant)',
                transition: 'all var(--transition-apple)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <a 
                  href={cert.credential_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    aspectRatio: '4/3', 
                    borderRadius: 'var(--radius-lg)', 
                    overflow: 'hidden', 
                    marginBottom: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--transition-apple), box-shadow var(--transition-apple)',
                  }}
                  className="cert-image-link"
                >
                  {imgSrc ? (
                    <img 
                      src={imgSrc} 
                      alt={cert.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        transition: 'transform var(--transition-apple)' 
                      }} 
                      className="cert-img"
                    />
                  ) : (
                    <FallbackCertificateSvg />
                  )}
                </a>
                <h4 className="text-headline-md" style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', color: 'var(--on-surface)', marginBottom: '8px', fontWeight: 700 }}>
                  {cert.name}
                </h4>
                <p className="text-muted" style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', marginTop: 'auto' }}>{cert.issuer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
