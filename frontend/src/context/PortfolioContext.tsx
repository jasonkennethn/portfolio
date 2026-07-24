'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProjectItem {
  title: string;
  tech: string[];
  github: string;
  live: string;
  desc: string;
  image: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  url: string;
  period: string;
  durationMonths: number;
  summary: string;
  bullets: string[];
  tech: string[];
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
  score: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  image: string;
}

export interface AchievementItem {
  title: string;
  desc: string;
  location: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface HeroData {
  siteTitle?: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
}

export interface PortfolioData {
  hero: HeroData;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  skillCategories: SkillCategory[];
}

const defaultPortfolioData: PortfolioData = {
  hero: {
    siteTitle: 'Jason Kenneth N | Software Engineer Portfolio',
    name: 'Jason Kenneth N',
    role: 'Software Engineer',
    bio: "Software Engineer with experience building backend applications and database-driven solutions using Python, Django, Java, SQL, and PostgreSQL. Passionate about writing clean, maintainable, and scalable code.",
    photoUrl: '',
    resumeUrl: '',
    github: 'https://github.com/jasonkennethn',
    linkedin: 'https://linkedin.com/in/jason-kenneth-n',
    email: 'jasonkennethn@gmail.com',
    phone: '+916361975397'
  },
  projects: [
    {
      title: 'Celarox',
      tech: ['Python', 'Django', 'SQL', 'REST API', 'React'],
      github: 'https://github.com/jasonkennethn/Celarox',
      live: 'https://celarox.com',
      desc: 'Architected a modular SaaS backend supporting multi-application logic, role-based access control (RBAC), and cloud deployment on Oracle Cloud Infrastructure.',
      image: ''
    },
    {
      title: 'MedFlare',
      tech: ['Python', 'Django', 'AI/ML', 'REST API', 'PostgreSQL'],
      github: 'https://github.com/jasonkennethn/MediChain',
      live: 'https://medichain-healthcare.vercel.app/',
      desc: 'Built an AI-powered healthcare management platform with intelligent workflow automation, patient record management, and clinical productivity features.',
      image: ''
    },
    {
      title: 'CSFlow',
      tech: ['Python', 'Django', 'AI', 'PostgreSQL', 'REST API'],
      github: 'https://github.com/jasonkennethn/CSFlow',
      live: 'https://csflow.vercel.app/',
      desc: 'Developed a corporate governance and compliance management platform for company secretarial operations, statutory filings, and board management.',
      image: ''
    }
  ],
  experiences: [
    {
      role: 'Software Development Intern',
      company: 'Raylog Autonetics Pvt. Ltd.',
      url: 'https://raylog.in',
      period: 'Oct 2025 – Mar 2026',
      durationMonths: 6,
      summary: 'Developed and maintained backend modules using Python, Django, and SQL, implementing business logic and enhancing application functionality.',
      bullets: [
        'Developed and maintained backend modules using Python, Django, and SQL, implementing business logic and enhancing application functionality.',
        'Optimized SQL queries, debugged backend issues, and performed testing to improve application performance, reliability.',
        'Collaborated in an Agile development environment using Git, contributing to feature development, code reviews, deployment support, and technical documentation.'
      ],
      tech: ['Python', 'Django', 'SQL', 'Git', 'Agile']
    },
    {
      role: 'Backend Developer Intern',
      company: 'Frookoon Pvt. Ltd.',
      url: 'https://frookoon.com',
      period: 'Dec 2025 – Feb 2026',
      durationMonths: 3,
      summary: 'Contributed to software product development by performing feature analysis, business requirement analysis, and technical feasibility evaluation for web and mobile applications.',
      bullets: [
        'Contributed to software product development by performing feature analysis, business requirement analysis, and technical feasibility evaluation for web and mobile applications.',
        'Collaborated with the cross-functional teams on system architecture discussions, UI/UX planning, and the software workflow improvements to enhance product usability and development efficiency.'
      ],
      tech: ['System Architecture', 'UI/UX', 'R&D', 'Mobile App']
    }
  ],
  education: [
    {
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      institution: 'Kishkinda University',
      period: '2023 – 2027',
      score: 'CGPA: 8.8'
    },
    {
      degree: 'Pre-University Course',
      field: 'Science',
      institution: 'Nandi PU College',
      period: '2021 – 2023',
      score: 'Percentage: 73.8%'
    }
  ],
  certifications: [
    { title: 'Certified System Administrator (CSA)', issuer: 'ServiceNow', image: '' },
    { title: 'Certified Application Developer (CAD)', issuer: 'ServiceNow', image: '' },
    { title: 'IBM Data Engineering Professional Certificate', issuer: 'IBM, Coursera', image: '' }
  ],
  achievements: [
    {
      title: 'SIH Internal Hackathon Winner',
      desc: 'Secured 1st place in the university level Smart India Hackathon internal evaluation.',
      location: 'Kishkinda University',
      icon: 'Trophy'
    },
    {
      title: 'Finalist – Anveshana 2025',
      desc: 'Selected as project finalist at Anveshana 2025 Innovation Challenge.',
      location: 'State Level',
      icon: 'Zap'
    },
    {
      title: 'Top 15 – Google Developer Group',
      desc: 'Top 15 at GDG Hubli (KLE) and GDG Bengaluru (Cambridge Institute).',
      location: 'Google Developer Group',
      icon: 'Star'
    }
  ],
  skillCategories: [
    {
      title: 'Programming Languages',
      skills: ['Python', 'Java', 'SQL', 'JavaScript', 'C']
    },
    {
      title: 'Frameworks & Libraries',
      skills: ['Django', 'FastAPI', 'React (Basics)']
    },
    {
      title: 'Databases',
      skills: ['PostgreSQL', 'MySQL', 'Oracle Database', 'MongoDB', 'SQLite']
    },
    {
      title: 'Developer Tools & Cloud',
      skills: ['Git', 'GitHub', 'Linux', 'Docker', 'Nginx', 'GitHub Actions', 'AWS (Basics)', 'OCI (Basics)', 'ServiceNow']
    },
    {
      title: 'Languages & Core',
      skills: ['Python', 'SQL', 'Java', 'HTML/CSS', 'JavaScript', 'TypeScript']
    },
    {
      title: 'Backend & Frameworks',
      skills: ['Django', 'REST Framework', 'FastAPI', 'Node.js', 'Next.js']
    },
    {
      title: 'Databases & Cloud',
      skills: ['PostgreSQL', 'NeonDB', 'Oracle Cloud (OCI)', 'AWS', 'Docker', 'Git']
    }
  ]
};

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
}

import { getApiBaseUrl } from '@/config/api';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_custom_data_v9';

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);

  // Synchronize document title and DOM title element with MutationObserver for persistent title
  useEffect(() => {
    const titleToSet: string = data?.hero?.siteTitle || defaultPortfolioData.hero.siteTitle || 'Jason Kenneth N | Software Engineer Portfolio';
    
    if (typeof document === 'undefined') return;

    const enforceTitle = () => {
      if (document.title !== titleToSet) {
        document.title = titleToSet;
      }
      const titleEl = document.getElementsByTagName('title')[0];
      if (titleEl && titleEl.textContent !== titleToSet) {
        titleEl.textContent = titleToSet;
      }
    };

    enforceTitle();

    const observer = new MutationObserver(enforceTitle);
    const titleEl = document.getElementsByTagName('title')[0];
    if (titleEl) {
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    observer.observe(document.head, { childList: true });

    return () => observer.disconnect();
  }, [data?.hero?.siteTitle]);

  useEffect(() => {
    const loadSaved = async () => {
      // 1. Instant local render from storage if available
      let localSiteTitle = '';
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.hero?.siteTitle) {
            localSiteTitle = parsed.hero.siteTitle;
          }
          const merged = {
            ...defaultPortfolioData,
            ...parsed,
            hero: {
              ...defaultPortfolioData.hero,
              ...(parsed.hero || {}),
              siteTitle: parsed.hero?.siteTitle || defaultPortfolioData.hero.siteTitle
            }
          };
          setData(merged);
        }
      } catch {}

      // 2. Fetch authoritative synced data from NeonDB PostgreSQL database
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/portfolio-data/`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && Object.keys(result.data).length > 0) {
            const backendSiteTitle = result.data.hero?.siteTitle;
            const finalSiteTitle = backendSiteTitle || localSiteTitle || defaultPortfolioData.hero.siteTitle;
            const merged = {
              ...defaultPortfolioData,
              ...result.data,
              hero: {
                ...defaultPortfolioData.hero,
                ...(result.data.hero || {}),
                siteTitle: finalSiteTitle
              }
            };
            setData(merged);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
          } else if (result.success) {
            // Seed database with default data
            fetch(`${getApiBaseUrl()}/api/portfolio-data/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: defaultPortfolioData })
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Backend sync unavailable, using local cache:', err);
      }
    };

    loadSaved();

    const handleStorageEvent = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const merged = {
            ...defaultPortfolioData,
            ...parsed,
            hero: {
              ...defaultPortfolioData.hero,
              ...(parsed.hero || {}),
              siteTitle: parsed.hero?.siteTitle || defaultPortfolioData.hero.siteTitle
            }
          };
          setData(merged);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('portfolio_updated', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('portfolio_updated', handleStorageEvent);
    };
  }, []);

  const updateData = (newData: PortfolioData) => {
    const merged = {
      ...defaultPortfolioData,
      ...newData,
      hero: {
        ...defaultPortfolioData.hero,
        ...(newData.hero || {}),
        siteTitle: newData.hero?.siteTitle || defaultPortfolioData.hero.siteTitle
      }
    };
    setData(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event('portfolio_updated'));
    } catch {}

    // Persist to NeonDB database
    fetch(`${getApiBaseUrl()}/api/portfolio-data/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: merged })
    }).catch((err) => console.warn('Failed to persist portfolio data to backend:', err));
  };

  const resetData = () => {
    setData(defaultPortfolioData);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('portfolio_updated'));
    } catch {}

    fetch(`${getApiBaseUrl()}/api/portfolio-data/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: defaultPortfolioData })
    }).catch((err) => console.warn('Failed to reset backend portfolio data:', err));
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
