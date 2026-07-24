'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Download } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export function Navbar() {
  const { data } = usePortfolio();
  const { hero } = data;
  const [activeSection, setActiveSection] = useState<string>('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'contact'];
    const container = document.getElementById('scroll-container');
    if (!container) return;

    let ticking = false;

    const updateActiveSection = () => {
      const containerRect = container.getBoundingClientRect();
      const targetLine = 140; // Target line offset below container top
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

          // Check if this section spans across the target line
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

    // Initial check
    updateActiveSection();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
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
    <header className="fixed top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 flex justify-center gpu-layer">
      
      {/* Outer Floating Container */}
      <div className="relative max-w-6xl w-full rounded-full">
        
        {/* Floating Navbar Capsule */}
        <div className="relative rounded-full glass-nav px-6 py-2.5 flex items-center justify-between shadow-md bg-white/95 border border-slate-300/90">
          
          {/* Brand/Name visible on screens below xl */}
          <div className="flex xl:hidden items-center shrink-0">
            <span className="font-extrabold text-sm text-slate-900 tracking-tight whitespace-nowrap">Jason Kenneth N</span>
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
              className="p-2 rounded-full border-2 border-slate-200 bg-white hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md transition-all duration-300 active:scale-95 hover:ring-4 hover:ring-[#494bd6]/20 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav Overlay Drawer */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-6 shadow-xl flex flex-col space-y-3 transition-all duration-300 xl:hidden">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveSection(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                    isActive
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <a 
              href={hero.resumeUrl || '#'}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-950 hover:bg-[var(--primary)] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Resume</span>
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

      </div>
    </header>
  );
}
