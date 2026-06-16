import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import HeroSection from '../components/sections/HeroSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import EducationSection from '../components/sections/EducationSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import CustomSection from '../components/sections/CustomSection';

const SECTION_MAP = {
  hero: HeroSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  certifications: CertificationsSection,
  achievements: AchievementsSection,
};

export default function Home({ isPreview = false, profileOverride = null, sectionsOverride = null }) {
  const { sections, loading } = usePortfolio();
  const location = useLocation();

  useEffect(() => {
    if (isPreview) return; // Skip scroll anchors in settings preview
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location, isPreview]);

  if (loading && !isPreview) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-symbols-outlined animate-pulse" style={{ fontSize: '48px', color: 'var(--primary)' }}>code</span>
          <p className="text-muted" style={{ marginTop: '1rem' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Render all active, visible sections ordered by order preference
  const targetSections = isPreview && sectionsOverride ? sectionsOverride : sections;
  const orderedSections = [...(targetSections || [])]
    .filter(s => s.is_visible && s.key !== 'stats')
    .sort((a, b) => a.order - b.order);

  return (
    <main style={{ scrollBehavior: 'smooth' }}>
      {orderedSections.map(section => {
        const Component = SECTION_MAP[section.key] || CustomSection;
        return (
          <div key={section.key} id={`${section.key}-section-wrapper`}>
            <Component
              sectionOverride={section}
              profileOverride={profileOverride}
              isPreview={isPreview}
            />
            {/* If section has dynamic content blocks in a standard section, render them below the default content */}
            {SECTION_MAP[section.key] && section.content && section.content.length > 0 && (
              <div style={{ marginTop: '-4rem', paddingBottom: '4rem' }}>
                <CustomSection sectionOverride={section} />
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}
