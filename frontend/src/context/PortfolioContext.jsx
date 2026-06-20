import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPortfolioData } from '../api/portfolio';

const PortfolioContext = createContext();

const EMPTY_DATA = {
  profile: {
    name: '',
    title: '',
    subtitle: '',
    email: '',
    phone: '',
    location: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    show_profile_picture: false,
    availability_status: '',
  },
  skills: [],
  projects: [],
  experiences: [],
  education: [],
  certifications: [],
  achievements: [],
  stats: [],
  sections: [
    { key: 'hero', label: 'Hero Header', description: 'Primary intro, headline, and CTA buttons.', is_visible: true, is_mandatory: true, icon: 'person' },
    { key: 'stats', label: 'Quick Stats', description: 'Key metrics at a glance.', is_visible: true, is_mandatory: false, icon: 'analytics' },
    { key: 'expertise', label: 'Core Expertise', description: 'Technical skill categories.', is_visible: true, is_mandatory: false, icon: 'hub' },
    { key: 'process', label: 'Technical Process', description: 'System thinking workflow.', is_visible: true, is_mandatory: false, icon: 'terminal' },
    { key: 'projects', label: 'Featured Projects', description: 'Engineering projects.', is_visible: true, is_mandatory: false, icon: 'folder' },
    { key: 'experience', label: 'Work Timeline', description: 'Professional experience.', is_visible: true, is_mandatory: false, icon: 'work' },
    { key: 'education', label: 'Education', description: 'Academic background.', is_visible: true, is_mandatory: false, icon: 'school' },
    { key: 'certifications', label: 'Certifications', description: 'Professional credentials.', is_visible: true, is_mandatory: false, icon: 'verified' },
    { key: 'achievements', label: 'Achievements', description: 'Awards and recognition.', is_visible: true, is_mandatory: false, icon: 'emoji_events' },
    { key: 'cta', label: 'Call to Action', description: 'Contact CTA section.', is_visible: true, is_mandatory: false, icon: 'mail' },
  ],
  config: { theme: 'light', primary_color: '#494BD6', enable_glassmorphism: true },
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchPortfolioData();
      const d = res.data;
      setData({
        profile: d.profile && d.profile.id ? d.profile : EMPTY_DATA.profile,
        skills: d.skills?.length ? d.skills : [],
        projects: d.projects?.length ? d.projects : [],
        experiences: d.experiences?.length ? d.experiences : [],
        education: d.education?.length ? d.education : [],
        certifications: d.certifications?.length ? d.certifications : [],
        achievements: d.achievements?.length ? d.achievements : [],
        stats: d.stats?.length ? d.stats : [],
        sections: d.sections?.length ? d.sections : EMPTY_DATA.sections,
        config: d.config || EMPTY_DATA.config,
      });
    } catch (err) {
      console.warn('API unreachable, using empty data:', err.message);
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const updateSections = (newSections) => {
    setData(prev => ({ ...prev, sections: newSections }));
  };

  const toggleSectionVisibility = (key) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.key === key && !s.is_mandatory ? { ...s, is_visible: !s.is_visible } : s
      ),
    }));
  };

  const renameSection = (key, newLabel) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.key === key ? { ...s, label: newLabel } : s
      ),
    }));
  };

  return (
    <PortfolioContext.Provider value={{
      ...data, loading, error, refreshData: loadData,
      updateSections, toggleSectionVisibility, renameSection,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
