'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export function Navbar() {
  const { data } = usePortfolio();
  const { hero } = data;
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'contact'];
    const container = document.getElementById('scroll-container');
    if (!container) return;

    let ticking = false;

    const updateActiveSection = () => {
      const containerRect = container.getBoundingClientRect();
      const targetLine = 140;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 30;

      if (isAtBottom) {
        setActiveSection('contact');
        ticking = false;
        return;
      }

      let currentActive = 'about';

      for (let i = 0; i < sections.length; i++) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          const relativeTop = elRect.top - containerRect.top;
          const relativeBottom = elRect.bottom - containerRect.top;

          if (relativeTop <= targetLine && relativeBottom > targetLine) {
            currentActive = id;
            break;
          }
        }
      }

      setActiveSection(currentActive);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
  }, []);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile menu — always rendered, toggled via CSS */}
      <div
        className={`mobile-nav-backdrop xl:hidden ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className="fixed top-3 sm:top-4 lg:top-6 left-0 right-0 z-50 w-full px-3 sm:px-6 flex justify-center gpu-layer">
        
        {/* Outer Floating Container */}
        <div className="relative max-w-6xl w-full rounded-full">
          
          {/* Floating Navbar Capsule */}
          <div className="relative rounded-full glass-nav px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-md bg-white/95 border border-slate-300/90">
            
            {/* Brand/Name visible on screens below xl */}
            <div className="flex xl:hidden items-center shrink-0">
              <span className="font-extrabold text-[13px] sm:text-sm text-slate-900 tracking-tight whitespace-nowrap">Jason Kenneth N</span>
            </div>

            {/* Desktop Nav Buttons */}
            <div className="hidden xl:flex flex-1 items-center justify-center space-x-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setActiveSection(link.id)}
                    className={`apple-button px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-extrabold whitespace-nowrap transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'bg-[var(--primary)] text-white border-2 border-[var(--primary)] shadow-md shadow-[#494bd6]/30 scale-[1.03]'
                        : 'bg-white text-slate-800 border-2 border-slate-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-white hover:shadow-md hover:shadow-[#494bd6]/20 shadow-xs active:scale-95'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right: Resume Download Button */}
            <div className="hidden xl:flex items-center pl-2 shrink-0">
              <a 
                href={hero.resumeUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="apple-button inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-slate-950 hover:bg-transparent border-2 border-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#494bd6]/20 text-white font-extrabold text-xs sm:text-[13px] shadow-xs active:scale-95 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap cursor-pointer"
              >
                <span>Resume</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Hamburger Toggle Button visible below xl */}
            <div className="flex xl:hidden items-center shrink-0">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full border-2 border-slate-200 bg-white active:scale-90 active:bg-slate-50 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Mobile Nav Drawer — always rendered, animated via CSS classes */}
          <div 
            className={`mobile-nav-drawer xl:hidden ${isMenuOpen ? 'open' : ''}`}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <a 
              href={hero.resumeUrl || '#'}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="mobile-resume-btn"
            >
              <span>Download Resume</span>
              <Download className="w-4 h-4" />
            </a>
          </div>

        </div>
      </header>
    </>
  );
}
