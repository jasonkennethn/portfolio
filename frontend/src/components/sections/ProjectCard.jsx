const CATEGORY_COLORS = {
  fullstack: { bg: 'rgba(73, 75, 214, 0.1)', text: 'var(--primary)', label: 'Full Stack' },
  frontend: { bg: 'rgba(0, 109, 75, 0.1)', text: 'var(--secondary)', label: 'Frontend' },
  backend: { bg: 'rgba(90, 94, 113, 0.1)', text: 'var(--tertiary)', label: 'Backend' },
  system_design: { bg: 'rgba(73, 75, 214, 0.1)', text: 'var(--primary)', label: 'System Design' },
  ai_ml: { bg: 'rgba(0, 109, 75, 0.1)', text: 'var(--secondary)', label: 'AI/ML' },
};

export default function ProjectCard({ project }) {
  const cat = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.fullstack;

  return (
    <div className="project-card" id={`project-${project.id}`}>
      {/* Image placeholder with gradient */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, var(--surface-container) 0%, var(--surface-container-high) 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(73,75,214,0.05) 0%, rgba(0,109,75,0.05) 100%)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline-variant)', opacity: 0.5 }}>code</span>
        </div>
      </div>

      <div className="project-card-body">
        {/* Category */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="text-code" style={{
            padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
            background: cat.bg, color: cat.text, fontSize: '11px',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {cat.label}
          </span>
        </div>

        <h3 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: '0.5rem' }}>{project.title}</h3>
        <p className="text-body-sm text-muted" style={{ marginBottom: '1.25rem', flex: 1 }}>{project.description}</p>

        {/* Technologies */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {(project.technologies || []).map(t => (
            <span key={t} className="tech-chip-outline">{t}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>code</span>
              GitHub
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
