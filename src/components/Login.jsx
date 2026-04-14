import { useState, useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = typeof import.meta !== 'undefined'
  ? (import.meta.env?.VITE_GOOGLE_CLIENT_ID || '')
  : '';

function useParticleCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(22,163,74,0.3)';
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(22,163,74,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [canvasRef]);
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ users, extraUsers, onLogin }) {
  const canvasRef = useRef();
  const googleBtnRef = useRef();
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useParticleCanvas(canvasRef);

  const allUsers = [...(users || []), ...(extraUsers || [])];

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const existing = document.getElementById('gsi-script');
    if (existing) { initGoogle(); return; }
    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, []);

  const initGoogle = () => {
    if (!window.google?.accounts) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signin_with',
        shape: 'rectangular',
      });
    }
    setGoogleReady(true);
  };

  const handleGoogleCredential = (response) => {
    try {
      const parts = response.credential.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const email = payload.email?.toLowerCase();
      const matchedUser = allUsers.find(u => u.email?.toLowerCase() === email);
      if (matchedUser) {
        setError('');
        onLogin(matchedUser);
      } else {
        setError(`${email} is not approved. Ask your admin to add you in Settings > Team Members.`);
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-canvas" />

      <div className="login-container">
        <div className="login-card">

          {/* Brand logo */}
          <div className="login-logo-row">
            <div className="login-logo-icon">M</div>
            <div>
              <div className="login-logo-name">Mosaic Wellness</div>
              <div className="login-logo-sub">NPD Team Central</div>
            </div>
          </div>

          <div className="login-divider" />

          <h1 className="login-title">Document Library</h1>
          <p className="login-subtitle">
            Sign in with your Mosaic Wellness Google account to continue
          </p>

          {/* Google sign-in (primary) */}
          {!showPicker && (
            <div className="login-google-section">
              {GOOGLE_CLIENT_ID ? (
                <>
                  <div ref={googleBtnRef} className="login-google-btn-wrap" />
                  {!googleReady && (
                    <div className="login-google-loading">
                      <div className="login-spinner" />
                      <span>Loading Sign-In...</span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="login-google-btn-custom"
                  onClick={() => setShowPicker(true)}
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              )}

              {error && (
                <div className="login-error">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.4" />
                    <path d="M7 4V7M7 10H7.01" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="login-secure-note">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.3"/>
                  <path d="M5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span>Secure SSO &mdash; only approved @mosaicwellness.in accounts</span>
              </div>
            </div>
          )}

          {/* Admin profile picker (hidden fallback) */}
          {showPicker && (
            <div className="login-picker-section">
              <div className="login-picker-header">
                <button
                  className="login-picker-back"
                  onClick={() => { setShowPicker(false); setError(''); }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
                <span className="login-picker-label">Admin Access</span>
              </div>
              <div className="login-picker-grid">
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    className="login-picker-card"
                    onClick={() => { setError(''); onLogin(user); }}
                  >
                    <div className="login-picker-avatar">
                      {user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="login-picker-name">{user.name}</div>
                    <div className="login-picker-role">{user.role}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="login-footer-row">
            <span className="login-version">Mosaic Wellness NPD Platform v2.7</span>
            {!showPicker && (
              <button className="login-admin-link" onClick={() => setShowPicker(true)}>
                Admin access
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
