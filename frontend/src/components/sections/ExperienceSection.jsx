import { usePortfolio } from '../../context/PortfolioContext';
import TimelineEntry from './TimelineEntry';

export default function ExperienceSection() {
  const { experiences } = usePortfolio();

  return (
    <section className="section" id="experience-section" style={{ position: 'relative' }}>
      <div className="container" style={{ position: 'relative' }}>
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)' }}>
            Professional Experience
          </h2>
        </div>

        {/* Timeline Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {(experiences || []).map((exp, i) => (
            <TimelineEntry key={exp.id || i} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
