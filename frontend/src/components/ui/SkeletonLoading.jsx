import React from 'react';

export default function SkeletonLoading() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '3% 0' }}>
      {/* Hero Skeleton */}
      <section className="section" style={{ paddingTop: '6%', paddingBottom: '4%' }}>
        <div className="container">
          <div className="skeleton-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3%', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              {/* Title skeleton */}
              <div className="skeleton-block" style={{ height: '3.5rem', width: '60%', borderRadius: 'var(--radius-lg)' }} />
              {/* Subtitle skeleton */}
              <div className="skeleton-block" style={{ height: '2rem', width: '40%', borderRadius: 'var(--radius-md)' }} />
              {/* Description line 1 & 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '90%' }}>
                <div className="skeleton-block" style={{ height: '1rem', width: '100%' }} />
                <div className="skeleton-block" style={{ height: '1rem', width: '85%' }} />
              </div>
              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div className="skeleton-block" style={{ height: '3rem', width: '150px', borderRadius: 'var(--radius-md)' }} />
                <div className="skeleton-block" style={{ height: '3rem', width: '150px', borderRadius: 'var(--radius-md)' }} />
              </div>
            </div>
            {/* Avatar skeleton */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="skeleton-block" style={{ width: '220px', height: '220px', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Skeleton */}
      <section className="section" style={{ padding: '4% 0' }}>
        <div className="container">
          <div className="skeleton-block" style={{ height: '2.5rem', width: '200px', marginBottom: '2rem', borderRadius: 'var(--radius-md)' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-block" style={{ height: '2.5rem', width: '110px', borderRadius: 'var(--radius-full)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Skeleton */}
      <section className="section" style={{ padding: '4% 0' }}>
        <div className="container">
          {/* Header */}
          <div className="skeleton-block" style={{ height: '2.5rem', width: '250px', marginBottom: '2rem', borderRadius: 'var(--radius-md)' }} />
          {/* Grid */}
          <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card-static" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--outline-variant)' }}>
                {/* Image area */}
                <div className="skeleton-block" style={{ height: '180px', borderRadius: '0' }} />
                {/* Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="skeleton-block" style={{ height: '1.5rem', width: '70%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="skeleton-block" style={{ height: '0.85rem', width: '100%' }} />
                    <div className="skeleton-block" style={{ height: '0.85rem', width: '90%' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div className="skeleton-block" style={{ height: '1.5rem', width: '60px', borderRadius: 'var(--radius-full)' }} />
                    <div className="skeleton-block" style={{ height: '1.5rem', width: '70px', borderRadius: 'var(--radius-full)' }} />
                    <div className="skeleton-block" style={{ height: '1.5rem', width: '50px', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Skeleton */}
      <section className="section" style={{ padding: '4% 0' }}>
        <div className="container">
          <div className="skeleton-block" style={{ height: '2.5rem', width: '220px', marginBottom: '2rem', borderRadius: 'var(--radius-md)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card-static" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <div className="skeleton-block" style={{ height: '1.5rem', width: '250px' }} />
                    <div className="skeleton-block" style={{ height: '1rem', width: '180px' }} />
                  </div>
                  <div className="skeleton-block" style={{ height: '1.5rem', width: '120px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div className="skeleton-block" style={{ height: '0.9rem', width: '95%' }} />
                  <div className="skeleton-block" style={{ height: '0.9rem', width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Styles for Skeleton Responsive Grid */}
      <style>{`
        @media (max-width: 768px) {
          .skeleton-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .skeleton-hero-grid > div {
            align-items: center !important;
            text-align: center !important;
          }
          .skeleton-hero-grid .skeleton-block {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
