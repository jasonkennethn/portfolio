import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPortfolioData } from '../api/portfolio';

const PortfolioContext = createContext();

const DEFAULT_DATA = {
  profile: {
    name: 'Jason Kenneth N',
    title: 'Software Development Engineer',
    subtitle: 'Software Development Engineer specialized in clean, scalable backend architectures and API-driven systems.',
    email: 'jasonkennethn@gmail.com',
    phone: '+91 6361975397',
    location: 'Bengaluru, Karnataka',
    portfolio_url: 'https://jasonkennethn.vercel.app',
    linkedin_url: 'https://linkedin.com/in/jason-kenneth-n',
    github_url: 'https://github.com/jasonkennethn',
    show_profile_picture: false,
    availability_status: 'Open to SDE Opportunities',
  },
  skills: [
    { id: 1, name: 'Python', category: 'language', proficiency: 90 },
    { id: 2, name: 'Java', category: 'language', proficiency: 80 },
    { id: 3, name: 'JavaScript', category: 'language', proficiency: 80 },
    { id: 4, name: 'C', category: 'language', proficiency: 75 },
    { id: 5, name: 'Kotlin', category: 'language', proficiency: 70 },
    { id: 6, name: 'SQL', category: 'language', proficiency: 85 },
    { id: 7, name: 'Django', category: 'framework', proficiency: 90 },
    { id: 8, name: 'FastAPI', category: 'framework', proficiency: 70 },
    { id: 9, name: 'React', category: 'framework', proficiency: 75 },
    { id: 10, name: 'MySQL', category: 'database', proficiency: 85 },
    { id: 11, name: 'PostgreSQL', category: 'database', proficiency: 80 },
    { id: 12, name: 'MongoDB', category: 'database', proficiency: 75 },
    { id: 13, name: 'Git', category: 'tool', proficiency: 85 },
    { id: 14, name: 'AWS', category: 'tool', proficiency: 70 },
    { id: 15, name: 'Linux', category: 'tool', proficiency: 80 },
    { id: 16, name: 'ServiceNow', category: 'tool', proficiency: 85 },
    { id: 17, name: 'DSA', category: 'concept', proficiency: 85 },
    { id: 18, name: 'OOP', category: 'concept', proficiency: 90 },
    { id: 19, name: 'DBMS', category: 'concept', proficiency: 85 },
  ],
  projects: [
    {
      id: 1, title: 'RailTrace', category: 'fullstack', featured: true,
      description: 'Developed a real-time railway operations and analytics platform with automated tracking and data-driven monitoring, while troubleshooting complex system bottlenecks to improve operational efficiency.',
      technologies: ['Python', 'Django', 'SQL', 'REST API', 'Analytics'],
      github_url: 'https://github.com/jasonkennethn/RailTrace',
    },
    {
      id: 2, title: 'MedFlare', category: 'fullstack', featured: true,
      description: 'Built an AI-powered healthcare management platform with intelligent workflow automation, patient record management, and clinical productivity features for doctors and hospitals.',
      technologies: ['Python', 'Django', 'AI/ML', 'REST API', 'PostgreSQL'],
      github_url: 'https://github.com/jasonkennethn/MediChain',
    },
    {
      id: 3, title: 'CSFlow', category: 'fullstack', featured: true,
      description: 'Developed a corporate governance and compliance management platform for company secretarial operations, statutory filings, board management, compliance tracking, document management, and AI-assisted workflow automation.',
      technologies: ['Python', 'Django', 'AI', 'PostgreSQL', 'REST API'],
      github_url: 'https://github.com/jasonkennethn/CSFlow',
    },
  ],
  experiences: [
    {
      id: 1, company: 'Raylog Industries Pvt Ltd', role: 'Software Development Intern',
      department: 'Engineering', start_date: 'Oct 2025', end_date: 'Present', is_current: true,
      description: 'Supporting deployment and maintenance of Django applications in production environments.',
      highlights: [
        'Supported deployment and maintenance of Django applications in production environments.',
        'Developed and optimized SQL queries to improve data integrity and application performance.',
        'Engaged in collaborative development using Git and Agile practices.',
        'Conducted thorough code reviews to enforce engineering best practices.',
      ],
      technologies: ['Python', 'Django', 'SQL', 'Git', 'Agile'],
    },
    {
      id: 2, company: 'Frookoon Pvt Ltd', role: 'Tech Intern',
      department: 'R&D', start_date: 'Dec 2025', end_date: 'Feb 2026', is_current: false,
      description: 'Contributed to website and mobile app R&D, UI/UX planning, and system architecture discussions.',
      highlights: [
        'Contributed to website and mobile app R&D, UI/UX planning, and system architecture.',
        'Designed practical software workflows by analyzing product requirements.',
        'Demonstrated strong initiative and technical ownership across research and design.',
      ],
      technologies: ['UI/UX', 'System Architecture', 'R&D', 'Mobile App'],
    },
  ],
  education: [
    { id: 1, institution: 'Kishkinda University', degree: 'B.Tech', field: 'Computer Science and Engineering', start_year: '2023', end_year: '2027', grade: '8.8', grade_type: 'CGPA' },
    { id: 2, institution: 'Nandi PU College', degree: 'Pre-University Course', field: 'Science', start_year: '2021', end_year: '2023', grade: '73.8%', grade_type: 'Percentage' },
  ],
  certifications: [
    { id: 1, name: 'Certified System Administrator (CSA)', issuer: 'ServiceNow', icon: 'verified' },
    { id: 2, name: 'Certified Application Developer (CAD)', issuer: 'ServiceNow', icon: 'code' },
    { id: 3, name: 'IBM Data Engineering Professional Certificate', issuer: 'IBM, Coursera', icon: 'school' },
  ],
  achievements: [
    { id: 1, title: 'SIH Internal Hackathon Winner', description: 'Developed RailTrace — Railway Track Management System', event: 'BITM, Ballari', icon: 'emoji_events' },
    { id: 2, title: 'E Summit 2025 – IIT Bombay', description: 'Participated in startup innovation workshops and networking sessions', event: 'IIT Bombay', icon: 'groups' },
    { id: 3, title: 'Top 15 – Google Developer Group', description: 'GDG Hubli (KLE) and GDG Bengaluru (Cambridge Institute)', event: 'Google Developer Group', icon: 'star' },
  ],
  stats: [
    { id: 1, label: 'Projects Built', value: '3+', icon: 'folder', color: 'primary' },
    { id: 2, label: 'Certifications', value: '3', icon: 'verified', color: 'secondary' },
    { id: 3, label: 'Internships', value: '2', icon: 'work', color: 'primary' },
    { id: 4, label: 'CGPA', value: '8.8', icon: 'school', color: 'secondary' },
  ],
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    const startTime = Date.now();
    try {
      const res = await fetchPortfolioData();
      const d = res.data;
      setData({
        profile: d.profile && d.profile.id ? d.profile : DEFAULT_DATA.profile,
        skills: d.skills?.length ? d.skills : DEFAULT_DATA.skills,
        projects: d.projects?.length ? d.projects : DEFAULT_DATA.projects,
        experiences: d.experiences?.length ? d.experiences : DEFAULT_DATA.experiences,
        education: d.education?.length ? d.education : DEFAULT_DATA.education,
        certifications: d.certifications?.length ? d.certifications : DEFAULT_DATA.certifications,
        achievements: d.achievements?.length ? d.achievements : DEFAULT_DATA.achievements,
        stats: d.stats?.length ? d.stats : DEFAULT_DATA.stats,
        sections: d.sections?.length ? d.sections : DEFAULT_DATA.sections,
        config: d.config || DEFAULT_DATA.config,
      });
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(DEFAULT_DATA);
    } finally {
      // Enforce showing the skeleton loading for at least 100ms (0.1 seconds)
      const elapsedTime = Date.now() - startTime;
      const minDuration = 100;
      const remainingTime = Math.max(0, minDuration - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
