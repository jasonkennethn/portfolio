import { usePortfolio } from '../../context/PortfolioContext';
import ProjectCard from './ProjectCard';

export default function ProjectsSection({ sectionOverride }) {
  const { projects } = usePortfolio();

  return (
    <section className="section" id="projects-section">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3%' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--primary)', marginBottom: '2%' }}>
            {sectionOverride?.label || 'Key Projects'}
          </h2>
        </div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-3">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5% 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 'clamp(36px, 5vw, 48px)', color: 'var(--outline-variant)' }}>folder_off</span>
            <p className="text-muted" style={{ marginTop: '2%' }}>No projects yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
