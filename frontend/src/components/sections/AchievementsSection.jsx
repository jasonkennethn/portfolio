import { usePortfolio } from '../../context/PortfolioContext';

export default function AchievementsSection() {
  const { achievements } = usePortfolio();

  if (!achievements || achievements.length === 0) return null;

  return (
    <section className="section" id="achievements-section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)' }}>
            Achievements & <span className="text-primary">Recognition</span>
          </h2>
        </div>
        <div className="grid grid-3">
          {achievements.map((ach, i) => (
            <div key={ach.id || i} className="glass-card" style={{
              padding: '5%', borderRadius: 'var(--radius-xl)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            }}>
              <div style={{
                width: 'clamp(40px, 5vw, 56px)', height: 'clamp(40px, 5vw, 56px)', borderRadius: 'var(--radius-full)',
                background: i === 0 ? 'linear-gradient(135deg, rgba(73,75,214,0.15), rgba(0,109,75,0.1))' : 'rgba(73, 75, 214, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '4%',
              }}>
                <span className="material-symbols-outlined filled" style={{
                  fontSize: 'clamp(20px, 2.5vw, 28px)', color: 'var(--primary)',
                }}>{ach.icon || 'emoji_events'}</span>
              </div>
              <h4 style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--on-surface)', marginBottom: '2%' }}>
                {ach.title}
              </h4>
              <p className="text-muted" style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', marginBottom: '2%' }}>{ach.description}</p>
              {ach.event && (
                <span className="text-code" style={{ fontSize: 'clamp(10px, 1vw, 12px)', color: 'var(--primary)', opacity: 0.8 }}>{ach.event}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
