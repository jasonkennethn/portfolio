'use client';

import React from 'react';
import { getApiBaseUrl } from '@/config/api';
import { 
  GraduationCap, 
  Code2, 
  Cloud, 
  ShieldCheck,
  ArrowRight,
  Mail,
  Phone,
  Trophy,
  Zap,
  Star,
  Download,
  ExternalLink,
  User,
  Printer,
  Heart,
  Lightbulb,
  Target,
  Flame,
  Crown,
  Rocket,
  Globe,
  Medal,
  Award
} from 'lucide-react';
import { 
  BsGithub, 
  BsLinkedin, 
  BsEnvelopeFill, 
  BsTelephoneFill,
  BsCodeSquare,
  BsLayersHalf,
  BsDatabase,
  BsTools,
  BsCpu,
  BsTranslate
} from 'react-icons/bs';
import { usePortfolio } from '@/context/PortfolioContext';

export function BlankCanvas() {
  const { data } = usePortfolio();
  const { hero, projects, experiences, education, certifications, achievements, skillCategories } = data;

  React.useEffect(() => {
    if (hero?.siteTitle) {
      document.title = hero.siteTitle;
    }
  }, [hero?.siteTitle]);

  const [contactForm, setContactForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = React.useState(false);
  const [sendSuccess, setSendSuccess] = React.useState('');
  const [sendError, setSendError] = React.useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess('');
    setSendError('');

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSendSuccess('Message sent successfully! Thank you for reaching out.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setSendError(result.error || 'Failed to send message.');
      }
    } catch {
      setSendError('Could not connect to backend server. Ensure Django server is running on port 8000.');
    } finally {
      setIsSending(false);
    }
  };
  // Dynamic Statistics Calculations
  const totalExperienceMonths = experiences.reduce((sum, exp) => sum + (exp.durationMonths || 0), 0);
  const totalProjectsCount = projects.length;
  const totalCertificationsCount = certifications.length;

  const getSkillIcon = (title: string) => {
    switch (title) {
      case 'Programming Languages': return <BsCodeSquare className="w-5 h-5" />;
      case 'Frameworks & Libraries': return <BsLayersHalf className="w-5 h-5" />;
      case 'Databases': return <BsDatabase className="w-5 h-5" />;
      case 'Developer Tools & Cloud': return <BsTools className="w-5 h-5" />;
      case 'Core CS Concepts': return <BsCpu className="w-5 h-5" />;
      default: return <BsTranslate className="w-5 h-5" />;
    }
  };

  const getCertificationIcon = (title: string) => {
    if (title.includes('CAD') || title.includes('Developer')) return <Code2 className="w-5 h-5" />;
    if (title.includes('IBM') || title.includes('Cloud')) return <Cloud className="w-5 h-5" />;
    return <ShieldCheck className="w-5 h-5" />;
  };

  const getAchievementIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Trophy': <Trophy className="w-5 h-5" />,
      'Zap': <Zap className="w-5 h-5" />,
      'Star': <Star className="w-5 h-5" />,
      'Award': <Award className="w-5 h-5" />,
      'GraduationCap': <GraduationCap className="w-5 h-5" />,
      'Code': <Code2 className="w-5 h-5" />,
      'Target': <Target className="w-5 h-5" />,
      'Flame': <Flame className="w-5 h-5" />,
      'Medal': <Medal className="w-5 h-5" />,
      'Crown': <Crown className="w-5 h-5" />,
      'Rocket': <Rocket className="w-5 h-5" />,
      'Globe': <Globe className="w-5 h-5" />,
      'Heart': <Heart className="w-5 h-5" />,
      'Lightbulb': <Lightbulb className="w-5 h-5" />,
    };
    return iconMap[iconName] || <Trophy className="w-5 h-5" />;
  };

  return (
    <div id="scroll-container" className="h-full w-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-executive-mesh relative select-text">

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-10 lg:px-16">
        
        {/* ==========================================
            SECTION 1: HERO (#about)
            ========================================== */}
        <section id="about" className="min-h-screen flex items-center justify-center pt-32 pb-20 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full max-w-6xl">
            
            {/* Left side text column */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 flex-1 max-w-2xl order-2 lg:order-1 translate-y-3 lg:translate-y-4">
              
              {/* Header Text Group */}
              <div className="flex flex-col items-center lg:items-start space-y-3 w-full">
                <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'clamp(32px, 5.5vw, 64px)', color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  {hero.name}
                </h1>

                <p 
                  className="bg-gradient-to-r from-[var(--primary)] via-indigo-600 to-violet-600 bg-clip-text text-transparent font-extrabold"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(20px, 2.6vw, 30px)', letterSpacing: '0.03em' }}
                >
                  {hero.role}
                </p>

                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'var(--foreground-muted)', lineHeight: 1.8, maxWidth: '720px' }}>
                  {hero.bio}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1 w-full max-w-[340px] sm:max-w-none justify-center lg:justify-start px-4 sm:px-0">
                <a 
                  href="#projects"
                  className="apple-button btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  href={hero.resumeUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="apple-button btn-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-center cursor-pointer"
                >
                  <span>Resume</span>
                  <Download className="w-4 h-4" />
                </a>
              </div>

              {/* Short Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-xs hover:border-[var(--primary)] transition-all">
                  <span className="font-extrabold text-base sm:text-lg text-[var(--primary)]">{totalExperienceMonths}+</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700">Months Experience</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-xs hover:border-[var(--primary)] transition-all">
                  <span className="font-extrabold text-base sm:text-lg text-[var(--primary)]">{totalProjectsCount}+</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700">Projects</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-xs hover:border-[var(--primary)] transition-all">
                  <span className="font-extrabold text-base sm:text-lg text-[var(--primary)]">{totalCertificationsCount}</span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-700">Certifications</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-5 pt-1 justify-center lg:justify-start">
                <a href={hero.github} target="_blank" rel="noreferrer"
                  className="social-icon-btn"
                  title="GitHub">
                  <BsGithub className="w-5 h-5" />
                </a>
                <a href={hero.linkedin} target="_blank" rel="noreferrer"
                  className="social-icon-btn"
                  title="LinkedIn">
                  <BsLinkedin className="w-5 h-5" />
                </a>
                <a href={`mailto:${hero.email}`}
                  className="social-icon-btn"
                  title="Email">
                  <BsEnvelopeFill className="w-5 h-5" />
                </a>
                <a href={`tel:${hero.phone}`}
                  className="social-icon-btn"
                  title="Call">
                  <BsTelephoneFill className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right side circular photo column */}
            <div className="flex-shrink-0 relative group order-1 lg:order-2 translate-y-0 lg:-translate-y-7">
              {/* Outer decorative glowing background ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
              
              {/* Circular border wrapper */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full p-1.5 bg-[var(--primary)] shadow-xl shadow-[#494bd6]/5 group-hover:shadow-2xl group-hover:shadow-[#494bd6]/15 hover:scale-[1.03] transition-all duration-500 ease-out will-change-transform">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-indigo-50/70 flex items-center justify-center relative">
                  {hero.photoUrl ? (
                    <img 
                      key={hero.photoUrl}
                      src={hero.photoUrl} 
                      alt={hero.name} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[var(--primary)] space-y-1">
                      <User className="w-20 h-20 sm:w-24 sm:h-24 opacity-80" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            SECTION 2: EXPERIENCE (#experience)
            ========================================== */}
        <section id="experience" className="scroll-mt-28 py-20">
          <h2 className="section-title mb-10">Experience</h2>

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={idx} className="experience-card">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(17px, 1.8vw, 21px)', color: 'var(--foreground)' }}>
                      {exp.role}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '14px', color: 'var(--primary)' }}>
                      {exp.company}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                    {exp.period}
                  </span>
                </div>

                {/* Summary */}
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.65, marginBottom: '16px' }}>
                  {exp.summary}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-5">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5" style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--primary)', fontSize: '8px', marginTop: '7px', flexShrink: 0 }}>●</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t, tIdx) => (
                    <span key={tIdx} className="tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 3: KEY PROJECTS (#projects)
            ========================================== */}
        <section id="projects" className="scroll-mt-28 py-20">
          <h2 className="section-title mb-10">Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="project-card">
                {/* Project Image Header */}
                <div className="project-card-image">
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="code-icon">&lt;/&gt;</span>
                  )}
                </div>

                <div className="project-card-body">
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--foreground)', marginBottom: '8px' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                    {proj.desc}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tech.map((t, tIdx) => (
                      <span key={tIdx} className="tech-pill">{t}</span>
                    ))}
                  </div>

                  {/* Action Links Footer */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 mt-auto">
                    {/* Highlighted GitHub Button */}
                    <a 
                      href={proj.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="apple-button btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-xs"
                    >
                      <BsGithub className="w-4 h-4 text-slate-800" />
                      <span>GitHub</span>
                    </a>

                    {/* Live Button on Right */}
                    <a 
                      href={proj.live} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="apple-button btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 4: SKILLS (#skills)
            ========================================== */}
        <section id="skills" className="scroll-mt-28 py-20">
          <h2 className="section-title mb-10">Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="glass-panel p-6 flex flex-col space-y-4">
                <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0" style={{ color: 'var(--primary)' }}>
                    {getSkillIcon(cat.title)}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '17px', color: 'var(--foreground)' }}>
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="tech-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 5: EDUCATION (#education)
            ========================================== */}
        <section id="education" className="scroll-mt-28 py-24 sm:py-32 pt-16 sm:pt-24">
          <h2 className="section-title mb-14">Education</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 sm:mt-6">
            {education.map((edu, edIdx) => (
              <div key={edIdx} className="education-card p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0" style={{ color: 'var(--primary)' }}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--foreground)' }}>
                        {edu.degree}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '15px', color: 'var(--primary)' }}>
                        {edu.field}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '15px', color: 'var(--foreground-muted)' }}>
                    {edu.institution}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
                    {edu.period}
                  </span>
                  <span className="tech-pill" style={{ fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)', padding: '6px 16px', fontSize: '13px' }}>
                    {edu.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 6: CERTIFICATIONS (#certifications)
            ========================================== */}
        <section id="certifications" className="scroll-mt-28 py-24 sm:py-32">
          <h2 className="section-title mb-12">Certifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, idx) => (
              <div key={idx} className="cert-card">
                {/* Certification Image */}
                <div className="cert-image-container" style={{ background: cert.image ? 'transparent' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)' }}>
                  {cert.image ? (
                    <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#94a3b8' }}>
                      <div className="text-center">
                        {getCertificationIcon(cert.title)}
                        <p className="mt-2 text-xs font-semibold">{cert.issuer}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5 text-center">
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '15px', color: 'var(--foreground)', marginBottom: '4px' }}>
                    {cert.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--foreground-muted)' }}>
                    {cert.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 7: ACHIEVEMENTS (#achievements)
            ========================================== */}
        <section id="achievements" className="scroll-mt-28 py-24 sm:py-32 animate-fade-in-up">
          <h2 className="section-title mb-12">Achievements</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((ach, idx) => (
              <div key={idx} className="glass-panel p-8 sm:p-10 flex flex-col justify-between space-y-6 hover:border-[var(--primary)] transition-all min-h-[260px]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0" style={{ color: 'var(--primary)' }}>
                    {getAchievementIcon(ach.icon || 'Trophy')}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '18px', color: 'var(--foreground)' }}>
                    {ach.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.65 }}>
                    {ach.desc}
                  </p>
                </div>
                <div className="border-t pt-4" style={{ borderColor: 'var(--card-border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                    {ach.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 8: CONTACT (#contact)
            ========================================== */}
        <section id="contact" className="scroll-mt-28 py-20">
          <h2 className="section-title mb-10">Let&apos;s Connect</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Details Card */}
            <div className="glass-panel p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="tech-pill" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', fontWeight: 600 }}>
                  Open to Opportunities
                </span>
                
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(20px, 2.2vw, 26px)', color: 'var(--foreground)', lineHeight: 1.2 }}>
                  Looking for a Software Engineer?
                </h3>
                
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
                  I am currently seeking full-time developer roles where I can apply my 9 months of software development experience in Python, Django REST, SQL, and database optimization. Whether you have an open role, a SaaS project, or just want to talk tech — my inbox is always open.
                </p>
              </div>

              <div className="space-y-4 border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0">
                    <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Me Directly</p>
                    <a href="mailto:jasonkennethn@gmail.com" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                      jasonkennethn@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0">
                    <Phone className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</p>
                    <a href="tel:+916361975397" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                      +91 6361975397
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <form onSubmit={handleContactSubmit} className="glass-panel p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '18px', color: 'var(--foreground)' }}>
                  Send a Direct Message
                </h4>
                
                {sendSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    {sendSuccess}
                  </div>
                )}

                {sendError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                    {sendError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: '6px' }}>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[#494bd6]/10 text-sm font-medium"
                      style={{ borderColor: 'var(--card-border)', background: 'var(--background)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[#494bd6]/10 text-sm font-medium"
                      style={{ borderColor: 'var(--card-border)', background: 'var(--background)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)', display: 'block', marginBottom: '6px' }}>Message</label>
                    <textarea 
                      rows={3}
                      placeholder="Let's talk about..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[#494bd6]/10 resize-none text-sm font-medium"
                      style={{ borderColor: 'var(--card-border)', background: 'var(--background)' }}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSending}
                className="apple-button btn-primary w-full py-3.5 rounded-xl font-semibold text-center cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>

          </div>
        </section>

      </div>

    </div>
  );
}
