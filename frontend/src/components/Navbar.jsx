import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { sections } = usePortfolio();
  const location = useLocation();
  const navigate = useNavigate();

  // ScrollSpy State
  const [activeSection, setActiveSection] = useState('hero-section');
  const rafRef = useRef(null);
  
  const navItems = (sections || [])
    .filter(s => s.is_visible && s.key !== 'stats' && s.key !== 'settings')
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      if (rafRef.current) return; // throttle with rAF
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        // Use sorted navItems for correct order matching
        const sortedSections = (sections || [])
          .filter(s => s.is_visible && s.key !== 'stats' && s.key !== 'settings')
          .sort((a, b) => a.order - b.order);

        let currentActive = 'hero-section';
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // If near bottom of page, activate last section
        if (scrollY + windowHeight >= document.documentElement.scrollHeight - 50) {
          const last = sortedSections[sortedSections.length - 1];
          if (last) currentActive = `${last.key}-section`;
        } else {
          const targetOffset = windowHeight * 0.35; // 35% of viewport height from top
          let found = false;
          let minDistance = Infinity;
          let closestSection = null;

          for (const sec of sortedSections) {
            const el = document.getElementById(`${sec.key}-section`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= targetOffset && rect.bottom >= targetOffset) {
                currentActive = `${sec.key}-section`;
                found = true;
                break;
              }
              const dist = Math.abs(rect.top - targetOffset);
              if (dist < minDistance) {
                minDistance = dist;
                closestSection = sec;
              }
            }
          }
          if (!found && closestSection) {
            currentActive = `${closestSection.key}-section`;
          }
        }
        setActiveSection(currentActive);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sections, location.pathname]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setDrawerOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Immediately set active for instant feedback
        setActiveSection(targetId);
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  // Dynamic Hamburger Detection based on overflow & screen width
  const [useHamburger, setUseHamburger] = useState(false);
  const containerRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (!linksRef.current || !containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth;
      const linksWidth = linksRef.current.scrollWidth;
      // Only use hamburger when links actually overflow — not on desktop
      const isOverflowing = linksWidth + 80 > availableWidth;
      setUseHamburger(isOverflowing || window.innerWidth <= 768);
    };

    const observer = new ResizeObserver(checkOverflow);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', checkOverflow);
    checkOverflow();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [navItems.length]);

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <div ref={containerRef} className="navbar-inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
          
          {/* Invisible measurer to compute exact links width */}
          <div 
            ref={linksRef} 
            style={{ 
              position: 'absolute', 
              visibility: 'hidden', 
              pointerEvents: 'none', 
              display: 'flex', 
              gap: '1.5rem',
              whiteSpace: 'nowrap' 
            }}
          >
            {navItems.map(sec => (
              <span key={sec.key} style={{ fontSize: '14.5px' }}>{sec.label}</span>
            ))}
          </div>

          {/* Desktop inline links - Centered, hidden on mobile/tablet or when overflowing */}
          <div className="desktop-links" style={{ display: useHamburger ? 'none' : 'flex', alignItems: 'center', gap: '1.5rem', margin: '0 auto' }}>
            {navItems.map(sec => {
              const targetId = `${sec.key}-section`;
              const isActive = location.pathname === '/' && activeSection === targetId;
              return (
                <a
                  key={sec.key}
                  href={`#${targetId}`}
                  onClick={(e) => handleNavClick(e, targetId)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                    paddingBottom: '4px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {sec.label}
                </a>
              );
            })}
          </div>

          {/* Mobile/Tablet Hamburger button - Absolute right, hidden on desktop */}
          <div className="mobile-hamburger" style={{ display: useHamburger ? 'flex' : 'none', position: 'absolute', right: 'var(--gutter)' }}>
            <button 
              onClick={() => setDrawerOpen(true)} 
              style={{
                background: 'var(--surface-container-low)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.6rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--on-surface)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-apple)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div 
        className={`mobile-nav-overlay ${drawerOpen ? 'open' : ''}`} 
        onClick={() => setDrawerOpen(false)} 
        style={{
          pointerEvents: drawerOpen ? 'all' : 'none',
          opacity: drawerOpen ? 1 : 0,
        }}
      />

      {/* Drawer Menu */}
      <div 
        className={`mobile-nav ${drawerOpen ? 'open' : ''}`}
        style={{
          right: drawerOpen ? '0' : '-320px',
          width: '300px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
          <button 
            className="btn-ghost" 
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface)',
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <p className="text-label-caps text-muted" style={{ marginBottom: '1rem', letterSpacing: '0.1em' }}>Navigation</p>
          {navItems.map(sec => {
            const targetId = `${sec.key}-section`;
            const isActive = location.pathname === '/' && activeSection === targetId;
            return (
              <a
                key={sec.key}
                href={`#${targetId}`}
                onClick={(e) => handleNavClick(e, targetId)}
                className={`drawer-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                  background: isActive ? 'var(--primary-container)' : 'transparent',
                  transition: 'all var(--transition-apple)',
                  border: isActive ? '1px solid rgba(73, 75, 214, 0.15)' : '1px solid transparent',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{sec.icon || 'layers'}</span>
                {sec.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
