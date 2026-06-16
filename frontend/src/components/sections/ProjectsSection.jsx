import { usePortfolio } from '../../context/PortfolioContext';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  const { projects } = usePortfolio();

  return (
    <section className="section" id="projects-section">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '0.75rem' }}>
            Key Projects
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-3">
          {(projects || []).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)' }}>folder_off</span>
            <p className="text-muted" style={{ marginTop: '1rem' }}>No projects yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
