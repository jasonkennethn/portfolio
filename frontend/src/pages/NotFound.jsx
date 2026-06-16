import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <main style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '520px' }}>
        {/* Glitch 404 number */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(100px, 20vw, 180px)',
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
            background: 'linear-gradient(135deg, var(--primary), var(--tertiary, #e879a8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-4px',
            animation: 'pulse404 2s ease-in-out infinite',
          }}>
            404
          </h1>
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 700,
          color: 'var(--on-surface)',
          margin: '0 0 0.75rem 0',
          fontFamily: 'var(--font-display)',
        }}>
          Page Not Found
        </h2>

        <p style={{
          fontSize: '15px',
          color: 'var(--on-surface-variant)',
          lineHeight: 1.7,
          margin: '0 0 2rem 0',
        }}>
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span style={{ opacity: 0.6, fontSize: '13px' }}>
            Redirecting to home in <strong style={{ color: 'var(--primary)' }}>{countdown}s</strong>
          </span>
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{
              padding: '0.7rem 1.8rem',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            style={{
              padding: '0.7rem 1.8rem',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Go Back
          </button>
        </div>

        {/* Decorative element */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          opacity: 0.35,
          fontSize: '12px',
          color: 'var(--outline)',
        }}>
          <span style={{ width: '40px', height: '1px', background: 'var(--outline)' }} />
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>code</span>
          <span style={{ width: '40px', height: '1px', background: 'var(--outline)' }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse404 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
      `}</style>
    </main>
  );
}
