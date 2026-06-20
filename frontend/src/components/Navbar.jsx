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
        <div ref={containerRef} className="navbar-inner" style={{ display: 'flex', justifyContent: useHamburger ? 'space-between' : 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
          
          {useHamburger && (
            <Link to="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="nav-brand" style={{ color: 'var(--on-surface)', fontWeight: 700, textDecoration: 'none' }}>
              Jason Kenneth N
            </Link>
          )}

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
              <span key={sec.key} style={{ fontSize: 'clamp(12px, 1.2vw, 14.5px)' }}>{sec.label}</span>
            ))}
          </div>

          {/* Desktop inline links - Centered, hidden on mobile/tablet or when overflowing */}
          <div className="desktop-links" style={{ display: useHamburger ? 'none' : 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 1.5vw, 1.5rem)', margin: '0 auto' }}>
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
                    fontSize: 'clamp(12px, 1.2vw, 14.5px)',
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
          {useHamburger && (
            <div className="mobile-hamburger">
              <button 
                onClick={() => setDrawerOpen(true)} 
                className="hamburger-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--on-surface)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div 
        className={`mobile-nav-overlay ${drawerOpen ? 'open' : ''}`} 
        onClick={() => setDrawerOpen(false)} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 199,
          pointerEvents: drawerOpen ? 'all' : 'none',
          opacity: drawerOpen ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Drawer Menu */}
      <div 
        className={`mobile-nav ${drawerOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '75%',
          maxWidth: '320px',
          height: '100vh',
          height: '100dvh',
          zIndex: 200,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          overflowY: 'auto',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <span className="nav-brand" style={{ color: 'var(--on-surface)', fontWeight: 700, fontSize: '18px' }}>
            Jason Kenneth N
          </span>
          <button 
            className="drawer-close-btn" 
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <p className="text-label-caps text-muted" style={{ marginBottom: '8px', letterSpacing: '0.1em' }}>Navigation</p>
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
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'clamp(13px, 1.5vw, 15px)',
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
