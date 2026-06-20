import { usePortfolio } from '../../context/PortfolioContext';
import TimelineEntry from './TimelineEntry';

export default function ExperienceSection({ sectionOverride }) {
  const { experiences } = usePortfolio();

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="section" id="experience-section" style={{ position: 'relative' }}>
      <div className="container" style={{ position: 'relative' }}>
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3%' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--primary)' }}>
            {sectionOverride?.label || 'Professional Experience'}
          </h2>
        </div>

        {/* Timeline Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3%' }}>
          {experiences.map((exp, i) => (
            <TimelineEntry key={exp.id || i} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
